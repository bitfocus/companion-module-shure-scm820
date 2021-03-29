const DEFAULT_LABELS = {
	1: 'Channel 1',
	2: 'Channel 2',
	3: 'Channel 3',
	4: 'Channel 4',
	5: 'Channel 5',
	6: 'Channel 6',
	7: 'Channel 7',
	8: 'Channel 8',
	9: 'Aux In',
	10: 'Direct Out 1',
	11: 'Direct Out 2',
	12: 'Direct Out 3',
	13: 'Direct Out 4',
	14: 'Direct Out 5',
	15: 'Direct Out 6',
	16: 'Direct Out 7',
	17: 'Direct Out 8',
	18: 'Mix A',
	19: 'Mix B',
}

/**
 * Companion instance API class for Shure SCM820.
 * Utilized to track the state of the receiver and channels.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class instance_api {
	/**
	 * Create an instance of a Shure API module.
	 *
	 * @param {instance} instance - the parent instance
	 * @since 1.0.0
	 */
	constructor(instance) {
		this.instance = instance

		let instance_icons = require('./icons')
		this.icons = new instance_icons(instance)

		this.mixer = {
			deviceId: '', // DEVICE_NAME 31 (GS)
			// FLASH ON|OFF (S)
			autoLinkMode: 'Unknown', // AUTO_LINK_MODE ON|OFF (GS)
			meterRate: 0, // METER_RATE 0=disabled, 100+ms (GS)
		}

		this.channels = []
		this.dfrs = []
	}

	/**
	 * Returns the desired channel state object.
	 *
	 * @param {number} id - the channel to fetch
	 * @returns {Object} the desired channel object
	 * @access public
	 * @since 1.0.0
	 */
	getChannel(id) {
		if (this.channels[id] === undefined) {
			this.channels[id] = {
				prefix:
					id >= 1 && id <= 9 ? `in_${id}_` : id >= 10 && id <= 17 ? `out_${id - 9}_` : id == 18 ? 'mix_a_' : 'mix_b_',
				name: DEFAULT_LABELS[id], // CHAN_NAME 31 (GS)
				audioGain: 0, // AUDIO_GAIN_HI_RES 0-1280, -1100 (-inf - +18 dB)
				audioGain2: '+0 dB', // Text representation of audioGain
				audioMute: 'OFF', // AUDIO_MUTE ON|OFF|TOGGLE (GS)
				alwaysOnA: 'Unknown', // ALWAYS_ON_ENABLE_A ON|OFF|TOGGLE (GS)
				alwaysOnB: 'Unknown', // ALWAYS_ON_ENABLE_B ON|OFF|TOGGLE (GS)
				intellimixMode: 'Unknown', // INTELLIMIX_MODE CLASSIC|SMOOTH|EXTREME|CUSTOM|MANUAL|CUSTOM_PRESET (GS)
				audioGateA: 'Unknown', // INPUT_AUDIO_GATE_A ON|OFF (G)
				audioGateB: 'Unknown', // INPUT_AUDIO_GATE_B ON|OFF (G)
				limiterEngaged: 'OFF', // LIMITER_ENGAGED ON|OFF (G)
				audioClip: 'OFF', // AUDIO_IN_CLIP_INDICATOR|AUDIO_OUT_CLIP_INDICATOR ON|OFF (G)
				audioLevel: 0, // SAMPLE 0-120, -120 dB
				audioBitmap: 0, // AUDIO_LEVEL (derived) 0-7, 10-17 w/clip
			}
		}

		return this.channels[id]
	}

	/**
	 * Returns the desired channel status icon.
	 *
	 * @param {number} id - the channel to fetch
	 * @returns {String} the icon
	 * @access public
	 * @since 1.0.0
	 */
	getChannelIcon(id) {
		let chIn = this.getChannel(id)
		let chOut = this.getChannel(id + 9)
		let audioIn, audioOut, aOn, bOn, mute, dfr

		audioIn = chIn.audioBitmap
		audioOut = id == 9 ? null : chOut.audioBitmap
		aOn = id == 9 ? null : chIn.audioGateA == 'OFF' ? 'ON' : 'OFF'
		bOn = id == 9 ? null : chIn.audioGateB == 'OFF' ? 'ON' : 'OFF'
		mute = chIn.audioMute
		dfr = id == 9 ? null : this.getDfr(1).assignedChan == id ? 1 : this.getDfr(2).assignedChan == id ? 2 : 0

		return this.icons.getChannelStatus(audioIn, audioOut, aOn, bOn, mute, dfr)
	}

	/**
	 * Returns the desired dfr state object.
	 *
	 * @param {number} id - the dfr to fetch
	 * @returns {Object} the desired dfr object
	 * @access public
	 * @since 1.0.0
	 */
	getDfr(id) {
		if (this.dfrs[id] === undefined) {
			this.dfrs[id] = {
				assignedChan: 20, // DFRx_ASSIGNED_CHAN 1-8, 18-19, 20=unassigned (GS)
				bypass: 'Unknown', //DFRx_BYPASS ON|OFF (GS)
				//DFRx_CLEAR_ALL_FILTERS ON (S)
				freeze: 'Unknown', //DFRx_FREEZE ON|OFF (GS)
			}
		}

		return this.dfrs[id]
	}

	/**
	 * Returns the input levels icon.
	 *
	 * @returns {String} the icon
	 * @access public
	 * @since 1.0.0
	 */
	getInputLevelsIcon() {
		return this.icons.getInputLevels(
			this.getChannel(1).audioBitmap,
			this.getChannel(2).audioBitmap,
			this.getChannel(3).audioBitmap,
			this.getChannel(4).audioBitmap,
			this.getChannel(5).audioBitmap,
			this.getChannel(6).audioBitmap,
			this.getChannel(7).audioBitmap,
			this.getChannel(8).audioBitmap,
			this.getChannel(9).audioBitmap
		)
	}

	/**
	 * Return the audio bitmap index
	 *
	 * @param {number} audioLevel - the level in dB
	 * @param {string} clip - clip ON|OFF
	 * @returns {number} the bitmap index
	 */
	getLevelBitmap(audioLevel, clip) {
		let out

		if (audioLevel >= -6) {
			out = 17
		} else if (audioLevel >= -9) {
			out = 7
		} else if (audioLevel >= -12) {
			out = 6
		} else if (audioLevel >= -18) {
			out = 5
		} else if (audioLevel >= -24) {
			out = 4
		} else if (audioLevel >= -36) {
			out = 3
		} else if (audioLevel >= -48) {
			out = 2
		} else if (audioLevel >= -60) {
			out = 1
		} else {
			out = 0
		}

		if (clip == 'ON' && out < 10) {
			out += 10
		}

		return out
	}

	/**
	 * Returns the mixer state object.
	 *
	 * @returns {Object} the mixer state object
	 * @access public
	 * @since 1.0.0
	 */
	getMixer() {
		return this.receiver
	}

	/**
	 * Returns the desired channel status icon.
	 *
	 * @param {number} id - the channel to fetch
	 * @returns {String} the icon
	 * @access public
	 * @since 1.0.0
	 */
	getMixerIcon(id) {
		let ch = this.getChannel(id)

		return this.icons.getMixStatus(ch.audioBitmap, ch.limiterEngaged, ch.audioMute)
	}

	/**
	 * Returns the mixer levels icon.
	 *
	 * @returns {String} the icon
	 * @access public
	 * @since 1.0.0
	 */
	getMixerLevelsIcon() {
		return this.icons.getMixLevels(
			this.getChannel(18).audioBitmap,
			this.getChannel(19).audioBitmap,
			this.getChannel(18).limiterEngaged,
			this.getChannel(19).limiterEngaged,
			this.getChannel(18).audioMute,
			this.getChannel(19).audioMute
		)
	}

	/**
	 * Returns the output levels icon.
	 *
	 * @returns {String} the icon
	 * @access public
	 * @since 1.0.0
	 */
	getOutputLevelsIcon() {
		return this.icons.getOutputLevels(
			this.getChannel(10).audioBitmap,
			this.getChannel(11).audioBitmap,
			this.getChannel(12).audioBitmap,
			this.getChannel(13).audioBitmap,
			this.getChannel(14).audioBitmap,
			this.getChannel(15).audioBitmap,
			this.getChannel(16).audioBitmap,
			this.getChannel(17).audioBitmap
		)
	}

	/**
	 * Parse sample data.
	 *
	 * @param {String} data - the sample data
	 * @access public
	 * @since 1.0.0
	 */
	parseSample(data) {
		if (Array.isArray(data)) {
			for (let i in data) {
				this.updateChannel(i + 1, 'AUDIO_LEVEL', data[i])
			}
		}

		this.instance.checkFeedbacks('input_levels')
		this.instance.checkFeedbacks('output_levels')
		this.instance.checkFeedbacks('mixer_levels')
		this.instance.checkFeedbacks('channel_status')
	}

	/**
	 * Update a channel property.
	 *
	 * @param {number} id - the channel id
	 * @param {String} key - the command id
	 * @param {String} value - the new value
	 * @access public
	 * @since 1.0.0
	 */
	updateChannel(id, key, value) {
		let channel = this.getChannel(id)
		let prefix = channel.prefix
		let variable

		if (value == 'UNKN' || value == 'UNKNOWN') {
			value = 'Unknown'
		}

		if (key.match(/AUDIO_GAIN/)) {
			channel.audioGain = (parseInt(value) - 1100) / 10
			channel.audioGain2 =
				(channel.audioGain == -1100 ? '-INF' : (channel.audioGain > 0 ? '+' : '-') + channel.audioGain.toString()) +
				' dB'
			this.instance.setVariable(prefix + 'audio_gain', channel.audioGain2)
			this.instance.checkFeedbacks('input_levels')
			this.instance.checkFeedbacks('output_levels')
			this.instance.checkFeedbacks('mixer_levels')
			this.instance.checkFeedbacks('channel_status')
			this.instance.checkFeedbacks('mixer_status')
			this.instance.checkFeedbacks('audio_gain')
		} else if (key == 'AUDIO_LEVEL') {
			channel.audioLevel = parseInt(value) - 120
			variable = channel.audioLevel.toString() + ' dB'
			channel.audioBitmap = this.getLevelBitmap(channel.audioLevel, channel.audioClip)
			this.instance.checkFeedbacks('input_levels')
			this.instance.checkFeedbacks('output_levels')
			this.instance.checkFeedbacks('mixer_levels')
			this.instance.checkFeedbacks('channel_status')
			this.instance.checkFeedbacks('mixer_status')
		} else if (key == 'AUDIO_MUTE') {
			channel.audioMute = value
			this.instance.setVariable(prefix + 'audio_mute', value)
			this.instance.checkFeedbacks('channel_status')
			this.instance.checkFeedbacks('mixer_status')
			this.instance.checkFeedbacks('audio_mute')
		} else if (key == 'ALWAYS_ON_ENABLE_A') {
			channel.alwaysOnA = value
			this.instance.setVariable(prefix + 'always_on_enable_a', value)
			this.instance.checkFeedbacks('always_on_enable')
		} else if (key == 'ALWAYS_ON_ENABLE_B') {
			channel.alwaysOnB = value
			this.instance.setVariable(prefix + 'always_on_enable_b', value)
			this.instance.checkFeedbacks('always_on_enable')
		} else if (key == 'CHAN_NAME') {
			channel.name = value.replace('{', '').replace('}', '').trim()
			this.instance.setVariable(prefix + 'name', channel.name)
			if (this.initDone === true) {
				this.instance.initActions()
				this.instance.initFeedbacks()
			}
		} else if (key == 'INTELLIMIX_MODE') {
			channel.intellimixMode = value
			this.instance.setVariable(prefix + 'intellimix_mode', value)
			this.instance.checkFeedbacks('mixer_status')
			this.instance.checkFeedbacks('intellimix_mode')
		} else if (key == 'INPUT_AUDIO_GATE_A') {
			channel.audioGateA = value
			this.instance.setVariable(prefix + 'input_audio_gate_a', value)
		} else if (key == 'INPUT_AUDIO_GATE_B') {
			channel.audioGateB = value
			this.instance.setVariable(prefix + 'input_audio_gate_b', value)
		} else if (key == 'LIMITER_ENGAGED') {
			channel.limiterEngaged = value
			this.instance.setVariable(prefix + 'limiter_engaged', value)
			this.instance.checkFeedbacks('mixer_levels')
			this.instance.checkFeedbacks('mixer_status')
		} else if (key.match(/_CLIP_INDICATOR/)) {
			channel.audioClip = value
			this.instance.setVariable(prefix + 'clip_indicator', value)
			this.instance.checkFeedbacks('input_levels')
			this.instance.checkFeedbacks('output_levels')
			this.instance.checkFeedbacks('mixer_levels')
			this.instance.checkFeedbacks('channel_status')
			this.instance.checkFeedbacks('mixer_status')
		}
	}

	/**
	 * Update a dfr property.
	 *
	 * @param {number} id - the dfr id
	 * @param {String} key - the command id
	 * @param {String} value - the new value
	 * @access public
	 * @since 1.0.0
	 */
	updateDfr(id, key, value) {
		let dfr = this.getDfr(id)
		let prefix = `dfr${id}_`
		let variable

		if (value == 'UNKN' || value == 'UNKNOWN') {
			value = 'Unknown'
		}

		if (key.match(/_ASSIGNED_CHAN/)) {
			dfr.assignedChan = parseInt(value)
			this.instance.setVariable(prefix + 'assigned_chan', dfr.assignedChan)
			this.instance.checkFeedbacks('dfr_assigned_chan')
		} else if (key.match(/_BYPASS/)) {
			dfr.bypass = value
			this.instance.setVariable(prefix + 'bypass', dfr.bypass)
			this.instance.checkFeedbacks('dfr_bypass')
		} else if (key.match(/_FREEZE/)) {
			dfr.freeze = value
			this.instance.setVariable(prefix + 'freeze', dfr.freeze)
			this.instance.checkFeedbacks('dfr_freeze')
		}
	}

	/**
	 * Update a mixer property.
	 *
	 * @param {String} key - the command id
	 * @param {String} value - the new value
	 * @access public
	 * @since 1.0.0
	 */
	updateMixer(key, value) {
		if (value == 'UNKN' || value == 'UNKNOWN') {
			value = 'Unknown'
		}

		if (key == 'DEVICE_ID') {
			this.receiver.deviceId = value.replace('{', '').replace('}', '').trim()
			this.instance.setVariable('device_id', this.receiver.deviceId)
		} else if (key == 'AUTO_LINK_MODE') {
			this.receiver.autoLinkMode = value
			this.instance.setVariable('auto_link_mode', this.receiver.autoLinkMode)
			this.instance.checkFeedbacks('auto_link_mode')
		} else if (key == 'METER_RATE') {
			this.receiver.meterRate = parseInt(value)
			this.instance.setVariable('meter_rate', this.receiver.meterRate.toString() + ' ms')
		}
	}
}

exports = module.exports = instance_api
