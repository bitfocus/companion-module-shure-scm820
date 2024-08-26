import {
	CreateConvertToBooleanFeedbackUpgradeScript,
	InstanceBase,
	Regex,
	runEntrypoint,
	TCPHelper,
} from '@companion-module/base'
import { updateActions } from './actions.js'
import { updateFeedbacks } from './feedback.js'
import { updateVariables } from './variables.js'
import Scm820Api from './internalAPI.js'
import { BooleanFeedbackUpgradeMap } from './upgrades.js'

/**
 * Companion instance class for the Shure SCM820.
 *
 * @extends InstanceBase
 * @since 1.0.0
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class ShureScm820Instance extends InstanceBase {
	/**
	 * Create an instance of a shure scm820 module.
	 *
	 * @param {Object} internal - Companion internals
	 * @since 1.0.0
	 */
	constructor(internal) {
		super(internal)

		this.updateActions = updateActions.bind(this)
		this.updateFeedbacks = updateFeedbacks.bind(this)
		this.updateVariables = updateVariables.bind(this)
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	async configUpdated(config) {
		let resetConnection = false
		let cmd
		if (this.config.host != config.bonjour_host?.split(':')[0] || config.host) {
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
		this.config.host = config.bonjour_host?.split(':')[0] || config.host
		this.config.port = config.bonjour_host ? 2202 : config.port //bonjour returns port 80
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariables()

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP()
		} else if (cmd !== undefined) {
			this.socket.send(cmd)
		}
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	async destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
			this.initDone = false
		}

		if (this.heartbeatInterval !== undefined) {
			clearInterval(this.heartbeatInterval)
		}

		if (this.heartbeatTimeout !== undefined) {
			clearTimeout(this.heartbeatTimeout)
		}

		this.log('debug', 'destroy', this.id)
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	getConfigFields() {
		return [
			{
				type: 'bonjour-device',
				id: 'bonjour_host',
				label: 'Bonjour Host',
				width: 8,
				regex: Regex.HOSTNAME,
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: Regex.IP,
				isVisible: (options) => !options.bonjour_host,
			},
			{
				type: 'number',
				id: 'port',
				label: 'Target Port',
				default: 2202,
				width: 3,
				min: 1,
				max: 65534,
				isVisible: (options) => !options.bonjour_host,
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
				default: 1000,
				required: true,
			},
			{
				type: 'dropdown',
				id: 'variableFormat',
				label: 'Variable Format',
				choices: [
					{ id: 'units', label: 'Include Units' },
					{ id: 'numeric', label: 'Numeric Only' },
				],
				width: 6,
				default: 'units',
				tooltip:
					'Changing this setting will apply to new values received.  To refresh all variables with the new setting, disable and re-enable the connection after saving these settings.',
			},
		]
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @param {Object} config - the configuration
	 * @access public
	 * @since 1.0.0
	 */
	async init(config) {
		this.config = config
		this.config.host = config.bonjour_host?.split(':')[0] || config.host
		this.config.port = config.bonjour_host ? 2202 : config.port //bonjour returns port 80
		this.initDone = false

		this.heartbeatInterval = null
		this.heartbeatTimeout = null

		this.CHOICES_CHANNELS = []
		this.CHOICES_CHANNELS_I = []
		this.CHOICES_CHANNELS_IA = []
		this.CHOICES_CHANNELS_IMU = []
		this.CHOICES_CHANNELS_M = []

		if (this.config.variableFormat === undefined) {
			this.config.variableFormat = 'units'
		}

		this.updateStatus('disconnected', 'Connecting')

		this.api = new Scm820Api(this)

		this.setupFields()

		this.updateActions()
		this.updateVariables()
		this.updateFeedbacks()

		this.initTCP()
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initTCP() {
		this.receiveBuffer = ''

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
			this.initDone = false
		}

		if (this.heartbeatInterval !== undefined) {
			clearInterval(this.heartbeatInterval)
		}

		if (this.heartbeatTimeout !== undefined) {
			clearTimeout(this.heartbeatTimeout)
		}

		if (this.config.port === undefined) {
			this.config.port = 2202
		}

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.log('error', `Network error: ${err.message}`)
			})

			this.socket.on('connect', () => {
				this.log('debug', 'Connected')
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
				cmd += '< GET 0 INPUT_AUDIO_GATE_A >\r\n'
				cmd += '< GET 0 INPUT_AUDIO_GATE_B >\r\n'
				cmd += '< GET 0 LIMITER_ENGAGED >\r\n'
				cmd += '< GET 0 AUDIO_IN_CLIP_INDICATOR >\r\n'
				cmd += '< GET 0 AUDIO_OUT_CLIP_INDICATOR >\r\n'

				if (this.config.meteringOn === true) {
					cmd += `< SET METER_RATE ${this.config.meteringInterval} >\r\n`
				}

				this.socket.send(cmd)

				this.heartbeatInterval = setInterval(() => {
					this.socket.send('< GET METER_RATE >')
				}, 30000)

				this.initDone = true

				this.updateActions()
				this.updateFeedbacks()
			})

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				let i = 0,
					line = '',
					offset = 0
				this.receiveBuffer += chunk

				while ((i = this.receiveBuffer.indexOf('>', offset)) !== -1) {
					line = this.receiveBuffer.substr(offset, i - offset)
					offset = i + 1
					this.socket.emit('receiveline', line.toString())
				}

				this.receiveBuffer = this.receiveBuffer.substr(offset)
			})

			this.socket.on('receiveline', (line) => {
				this.processShureCommand(line.replace('< ', '').trim())

				if (line.match(/METER_RATE/)) {
					if (this.heartbeatTimeout !== undefined) {
						clearTimeout(this.heartbeatTimeout)
					}

					this.heartbeatTimeout = setTimeout(this.initTCP.bind(this), 60000)
				}
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
			//this.log('debug', `command recieved: ${command}`)
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
				} else if (commandArr[1] == 'CHAN_NAME') {
					//this command is about a specific channel name
					let channelName = command.split('{')
					channelName = channelName[1] != undefined ? channelName[1].split('}') : undefined
					if (channelName[0] === undefined) {
						return undefined
					}
					this.api.updateChannel(commandNum, commandArr[1], channelName[0])
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
			if (this.socket !== undefined && this.socket.isConnected) {
				this.socket.send(`< ${cmd} >\r\n`)
			} else {
				this.log('debug', 'Socket not connected :(')
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
		this.CHOICES_CHANNELS_I = []
		this.CHOICES_CHANNELS_IA = []
		this.CHOICES_CHANNELS_IMU = []
		this.CHOICES_CHANNELS_M = []

		let data

		for (let i = 1; i <= 8; i++) {
			data = `Channel ${i}`

			if (this.api.getChannel(i).name != '' && this.api.getChannel(i).name !== data) {
				data += ` (${this.api.getChannel(i).name})`
			}

			this.CHOICES_CHANNELS.push({ id: i, label: data })
			this.CHOICES_CHANNELS_I.push({ id: i, label: data })
			this.CHOICES_CHANNELS_IA.push({ id: i, label: data })
			this.CHOICES_CHANNELS_IMU.push({ id: i, label: data })
		}

		data = 'Aux In'

		if (this.api.getChannel(9).name != '' && this.api.getChannel(9).name !== data) {
			data += ` (${this.api.getChannel(9).name})`
		}

		this.CHOICES_CHANNELS.push({ id: 9, label: data })
		this.CHOICES_CHANNELS_IA.push({ id: 9, label: data })

		data = 'Mix A'

		if (this.api.getChannel(18).name != '' && this.api.getChannel(18).name !== data) {
			data += ` (${this.api.getChannel(18).name})`
		}

		this.CHOICES_CHANNELS.push({ id: 18, label: data })
		this.CHOICES_CHANNELS_IMU.push({ id: 18, label: data })
		this.CHOICES_CHANNELS_M.push({ id: 18, label: data })

		data = 'Mix B'

		if (this.api.getChannel(19).name != '' && this.api.getChannel(19).name !== data) {
			data += ` (${this.api.getChannel(19).name})`
		}

		this.CHOICES_CHANNELS.push({ id: 19, label: data })
		this.CHOICES_CHANNELS_IMU.push({ id: 19, label: data })
		this.CHOICES_CHANNELS_M.push({ id: 19, label: data })

		this.CHOICES_CHANNELS_IMU.push({ id: 20, label: 'Unassigned' })
	}

	/**
	 * Set up the fields used in actions and feedbacks
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	setupFields() {
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
	}

	/**
	 * Inform module of Action Recorder state change
	 *
	 * @access public
	 * @since 2.2.0
	 * @param {boolean} isRecording - the state of the action recorder
	 */

	handleStartStopRecordActions(isRecording) {
		this.isRecordingActions = isRecording
	}
	/**
	 * Record Action if Action Recorder is engaged
	 *
	 * @since 2.2.0
	 * @param {string} action - actionId
	 * @param {object} actionOptions - action options
	 * @param {string} uid - unique id for recorded action
	 */
	recordScmAction(action, actionOptions, uid) {
		if (this.isRecordingActions) {
			this.recordAction(
				{
					actionId: action,
					options: actionOptions,
				},
				uid
			)
		}
	}
}

runEntrypoint(ShureScm820Instance, [CreateConvertToBooleanFeedbackUpgradeScript(BooleanFeedbackUpgradeMap)])
