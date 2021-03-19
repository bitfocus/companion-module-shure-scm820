var tcp = require('../../tcp')
var instance_skel = require('../../instance_skel')

var instance_api = require('./internalAPI')
var actions = require('./actions')
var feedback = require('./feedback')
var variables = require('./variables')

/**
 * Companion instance class for the Shure SCM820.
 *
 * @extends instance_skel
 * @version 1.0.0
 * @since 1.0.0
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class instance extends instance_skel {
	/**
	 * Create an instance of a shure scm820 module.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(system, id, config) {
		super(system, id, config)

		this.initDone = false

		Object.assign(this, {
			...actions,
			...feedback,
			...variables,
		})

		this.api = new instance_api(this)

		this.CHOICES_CHANNELS = []
		this.CHOICES_CHANNELS_I = []
		this.CHOICES_CHANNELS_IA = []
		this.CHOICES_CHANNELS_IMU = []
		this.CHOICES_CHANNELS_M = []

		this.defineConst('REGEX_CHAR_8', '/^.{1,8}$/')

		this.setupFields()

		this.actions() // export actions
	}

	/**
	 * Setup the actions.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	actions() {
		this.setupChannelChoices()
		this.setActions(this.getActions())
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	config_fields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				default: 2202,
				width: 2,
				regex: this.REGEX_PORT,
			},
			{
				type: 'checkbox',
				id: 'meteringOn',
				label: 'Enable Metering?',
				width: 2,
				default: true,
			},
			{
				type: 'number',
				id: 'meteringInterval',
				label: 'Metering Interval (in ms)',
				width: 4,
				min: 250,
				max: 99999,
				default: 2000,
				required: true,
			},
		]
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		this.debug('destroy', this.id)
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	init() {
		this.status(this.STATUS_WARNING, 'Connecting')

		this.initVariables()
		this.initFeedbacks()

		this.checkFeedbacks()

		this.initTCP()
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initTCP() {
		var receivebuffer = ''

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}

		if (this.config.port === undefined) {
			this.config.port = 2202
		}

		if (this.config.host) {
			this.socket = new tcp(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.status(status, message)
			})

			this.socket.on('error', (err) => {
				this.debug('Network error', err)
				this.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('connect', () => {
				this.debug('Connected')
				let cmd = '< GET DEVICE_ID >\r\n'
				cmd += '< GET FLASH >\r\n'
				cmd += '< GET AUTO_LINK_MODE >\r\n'
				cmd += '< GET 0 AUDIO_GAIN_HI_RES >\r\n'
				cmd += '< GET 0 AUDIO_MUTE >\r\n'
				cmd += '< GET 0 CHAN_NAME >\r\n'
				cmd += '< GET 0 ALWAYS_ON_ENABLE_A >\r\n'
				cmd += '< GET 0 ALWAYS_ON_ENABLE_B >\r\n'
				cmd += '< GET 18 INTELLIMIX_MODE >\r\n'
				cmd += '< GET 19 INTELLIMIX_MODE >\r\n'
				cmd += '< GET DFR1_ASSIGNED_CHAN >\r\n'
				cmd += '< GET DFR2_ASSIGNED_CHAN >\r\n'
				cmd += '< GET DFR1_BYPASS >\r\n'
				cmd += '< GET DFR2_BYPASS >\r\n'
				cmd += '< GET DFR1_FREEZE >\r\n'
				cmd += '< GET DFR2_FREEZE >\r\n'
				cmd += '< GET 0 AUDIO_INPUT_GATE_A >\r\n'
				cmd += '< GET 0 AUDIO_INPUT_GATE_B >\r\n'
				cmd += '< GET 0 LIMITER_ENGAGED >\r\n'
				cmd += '< GET 0 AUDIO_IN_CLIP_INDICATOR >\r\n'
				cmd += '< GET 0 AUDIO_OUT_CLIP_INDICATOR >\r\n'

				if (this.config.meteringOn === true) {
					cmd += '< SET METER_RATE ' + this.config.meteringInterval + ' >\r\n'
				}

				this.socket.send(cmd)

				this.actions() // export actions
			})

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				var i = 0,
					line = '',
					offset = 0
				receivebuffer += chunk

				while ((i = receivebuffer.indexOf('>', offset)) !== -1) {
					line = receivebuffer.substr(offset, i - offset)
					offset = i + 1
					this.socket.emit('receiveline', line.toString())
				}

				receivebuffer = receivebuffer.substr(offset)
			})

			this.socket.on('receiveline', (line) => {
				this.processShureCommand(line.replace('< ', '').trim())
			})
		}
	}

	/**
	 * INTERNAL: Routes incoming data to the appropriate function for processing.
	 *
	 * @param {string} command - the command/data type being passed
	 * @access protected
	 * @since 1.0.0
	 */
	processShureCommand(command) {
		if ((typeof command === 'string' || command instanceof String) && command.length > 0) {
			let commandArr = command.split(' ')
			let commandType = commandArr.shift()
			let commandNum = parseInt(commandArr[0])

			if (commandType == 'REP') {
				if (commandArr[0].match(/DFR1/)) {
					this.api.updateDfr(1, commandArr[0], commandArr[1])
				} else if (commandArr[0].match(/DFR2/)) {
					this.api.updateDfr(2, commandArr[0], commandArr[1])
				} else if (isNaN(commandNum)) {
					//this command isn't about a specific channel
					this.api.updateMixer(commandArr[0], commandArr[1])
				} else {
					//this command is about a specific channel
					this.api.updateChannel(commandNum, commandArr[1], commandArr[2])
				}
			} else if (commandType == 'SAMPLE') {
				this.api.parseSample(commandArr)
			}
		}
	}

	/**
	 * Send a command to the device.
	 *
	 * @param {String} cmd - the command to send
	 */
	sendCommand(cmd) {
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.connected) {
				this.socket.send(`< ${cmd} >\r\n`)
			} else {
				this.debug('Socket not connected :(')
			}
		}
	}

	/**
	 * INTERNAL: use data to define the channel choice.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	setupChannelChoices() {
		this.CHOICES_CHANNELS = []
		let data

		for (var i = 1; i <= 8; i++) {
			data = 'Channel ' + i

			if (this.api.getChannel(i).name != '' && this.api.getChannel(i).name !== data) {
				data += ' (' + this.api.getChannel(i).name + ')'
			}

			this.CHOICES_CHANNELS.push({ id: i, label: data })
			this.CHOICES_CHANNELS_I.push({ id: i, label: data })
			this.CHOICES_CHANNELS_IA.push({ id: i, label: data })
			this.CHOICES_CHANNELS_IMU.push({ id: i, label: data })
		}

		data = 'Aux In'

		if (this.api.getChannel(9).name != '' && this.api.getChannel(i).name !== data) {
			data += ' (' + this.api.getChannel(9).name + ')'
		}

		this.CHOICES_CHANNELS.push({ id: 9, label: data })
		this.CHOICES_CHANNELS_IA.push({ id: 9, label: data })

		data = 'Mix A'

		if (this.api.getChannel(18).name != '' && this.api.getChannel(i).name !== data) {
			data += ' (' + this.api.getChannel(18).name + ')'
		}

		this.CHOICES_CHANNELS.push({ id: 18, label: data })
		this.CHOICES_CHANNELS_IMU.push({ id: 18, label: data })
		this.CHOICES_CHANNELS_M.push({ id: 18, label: data })

		data = 'Mix B'

		if (this.api.getChannel(19).name != '' && this.api.getChannel(i).name !== data) {
			data += ' (' + this.api.getChannel(19).name + ')'
		}

		this.CHOICES_CHANNELS.push({ id: 19, label: data })
		this.CHOICES_CHANNELS_IMU.push({ id: 19, label: data })
		this.CHOICES_CHANNELS_M.push({ id: 19, label: data })
	}

	/**
	 * Set up the fields used in actions and feedbacks
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	setupFields() {
		this.BG_COLOR_FIELD = function (defaultColor) {
			return {
				type: 'colorpicker',
				label: 'Background color',
				id: 'bg',
				default: defaultColor,
			}
		}
		this.FG_COLOR_FIELD = function (defaultColor) {
			return {
				type: 'colorpicker',
				label: 'Foreground color',
				id: 'fg',
				default: defaultColor,
			}
		}
		this.CHANNELS_FIELD = function (type = 'IAM') {
			let out = {
				type: 'dropdown',
				label: 'Channel',
				id: 'channel',
				default: '1',
			}

			if (type == 'IAM') {
				out.choices = this.CHOICES_CHANNELS
			} else if (type == 'I') {
				out.choices = this.CHOICES_CHANNELS_I
			} else if (type == 'IA') {
				out.choices = this.CHOICES_CHANNELS_IA
			} else if (type == 'IMU') {
				out.choices = this.CHOICES_CHANNELS_IMU
			} else if (type == 'M') {
				out.choices = this.CHOICES_CHANNELS_M
				out.default = '18'
			}

			return out
		}
		this.DFR_FIELD = {
			type: 'dropdown',
			label: 'DFR #',
			id: 'dfr',
			default: 1,
			choices: [
				{ id: 1, label: 'DFR 1' },
				{ id: 2, label: 'DFR 2' },
			],
		}
		this.GAIN_INC_FIELD = {
			type: 'number',
			label: 'Gain Value (dB)',
			id: 'gain',
			min: 0.1,
			max: 120,
			step: 0.1,
			default: 3,
			required: true,
			range: true,
		}
		this.GAIN_SET_FIELD = {
			type: 'number',
			label: 'Gain Value (dB)',
			id: 'gain',
			min: -110,
			max: 18,
			step: 0.1,
			default: 0,
			required: true,
			range: true,
		}
		this.INTELLIMIX_MODE_FIELD = {
			type: 'dropdown',
			label: 'IntelliMix Mode',
			id: 'choice',
			default: 'CLASSIC',
			choices: [
				{ id: 'CLASSIC', label: 'Classic' },
				{ id: 'SMOOTH', label: 'Smooth' },
				{ id: 'EXTREME', label: 'Extreme' },
				{ id: 'CUSTOM', label: 'Custom' },
				{ id: 'MANUAL', label: 'Manual' },
				{ id: 'CUSTOM_PRESET', label: 'Custom Preset' },
			],
		}
		this.MIXER_FIELD = {
			type: 'dropdown',
			label: 'Mix',
			id: 'mix',
			default: 'A',
			choices: [
				{ id: 'A', label: 'Mix A' },
				{ id: 'B', label: 'Mix B' },
			],
		}
		this.MUTE_FIELD = {
			type: 'dropdown',
			label: 'Mute/Unmute/Toggle',
			id: 'choice',
			default: 'ON',
			choices: [
				{ id: 'ON', label: 'Mute' },
				{ id: 'OFF', label: 'Unmute' },
				{ id: 'TOGGLE', label: 'Toggle Mute/Unmute' },
			],
		}
		this.NAME_FIELD = {
			type: 'textinput',
			label: 'Name (31 characters max)',
			id: 'name',
			default: '',
			regex: '/^.{1,31}$/',
		}
		this.ONOFF_FIELD = {
			type: 'dropdown',
			label: 'Set On/Off',
			id: 'choice',
			default: 'ON',
			choices: [
				{ id: 'ON', label: 'On' },
				{ id: 'OFF', label: 'Off' },
			],
		}
		this.ONOFFTOGGLE_FIELD = {
			type: 'dropdown',
			label: 'Set On/Off/Toggle',
			id: 'choice',
			default: 'TOGGLE',
			choices: [
				{ id: 'ON', label: 'On' },
				{ id: 'OFF', label: 'Off' },
				{ id: 'TOGGLE', label: 'Toggle' },
			],
		}
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	updateConfig(config) {
		var resetConnection = false
		var cmd

		if (this.config.host != config.host) {
			resetConnection = true
		}

		if (this.config.meteringOn !== config.meteringOn) {
			if (config.meteringOn === true) {
				cmd = '< SET METER_RATE ' + this.config.meteringInterval + ' >\r\n'
			} else {
				cmd = '< SET METER_RATE 0 >\r\n'
			}
		} else if (this.config.meteringRate != config.meteringRate && this.config.meteringOn === true) {
			cmd = '< SET METER_RATE ' + config.meteringInterval + ' >\r\n'
		}

		this.config = config

		this.actions()
		this.initFeedbacks()
		this.initVariables()

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP()
		} else if (cmd !== undefined) {
			this.socket.send(cmd)
		}
	}
}

exports = module.exports = instance
