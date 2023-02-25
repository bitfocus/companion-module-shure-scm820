import { Fields } from './setup.js'

/**
 * INTERNAL: Get the available actions.
 *
 * @access public
 * @since 1.0.0
 */
export function updateActions() {
	this.setupChannelChoices()

	this.setActionDefinitions({
		chan_name: {
			name: 'Set channel name',
			options: [this.CHANNELS_FIELD(), Fields.Name],
			callback: ({ options }) => {
				let cmd = `SET ${options.channel} CHAN_NAME {${options.name}}`
				this.sendCommand(cmd)
			},
		},
		audio_mute: {
			name: 'Set channel mute',
			options: [this.CHANNELS_FIELD(), Fields.Mute],
			callback: ({ options }) => {
				let cmd = `SET ${options.channel} AUDIO_MUTE ${options.choice}`
				this.sendCommand(cmd)
			},
		},
		audio_gain: {
			name: 'Set audio gain of channel',
			options: [this.CHANNELS_FIELD(), Fields.GainSet],
			callback: ({ options }) => {
				let value = (options.gain + 110) * 10
				let cmd = `SET ${options.channel} AUDIO_GAIN_HI_RES ${value}`
				this.sendCommand(cmd)
			},
		},
		audio_gain_inc: {
			name: 'Increase audio gain of channel',
			options: [this.CHANNELS_FIELD(), Fields.GainInc],
			callback: ({ options }) => {
				let value = options.gain * 10
				let cmd = `SET ${options.channel} AUDIO_GAIN_HI_RES INC ${value}`
				this.sendCommand(cmd)
			},
		},
		audio_gain_dec: {
			name: 'Decrease audio gain of channel',
			options: [this.CHANNELS_FIELD(), Fields.GainInc],
			callback: ({ options }) => {
				let value = options.gain * 10
				let cmd = `SET ${options.channel} AUDIO_GAIN_HI_RES DEC ${value}`
				this.sendCommand(cmd)
			},
		},
		always_on_enable: {
			name: 'Set channel always on in mix',
			options: [Fields.Mixer, this.CHANNELS_FIELD('I'), Fields.OnOffToggle],
			callback: ({ options }) => {
				let cmd = `SET ${options.channel} ALWAYS_ON_ENABLE_${options.mix} ${options.choice}`
				this.sendCommand(cmd)
			},
		},
		intellimix_mode: {
			name: 'Set IntelliMix Mode',
			options: [this.CHANNELS_FIELD('M'), Fields.IntellimixMode],
			callback: ({ options }) => {
				let cmd = `SET ${options.channel} INTELLIMIX_MODE ${options.choice}`
				this.sendCommand(cmd)
			},
		},
		dfr_assigned_chan: {
			name: 'Set DFR assigned channel',
			options: [Fields.Dfr, this.CHANNELS_FIELD('IMU')],
			callback: ({ options }) => {
				let cmd = `SET DFR${options.dfr}_ASSIGN_CHAN ${options.channel}`
				this.sendCommand(cmd)
			},
		},
		dfr_bypass: {
			name: 'Set DFR bypass',
			options: [Fields.Dfr, Fields.OnOff],
			callback: ({ options }) => {
				let cmd = `SET DFR${options.dfr}_BYPASS ${options.choice}`
				this.sendCommand(cmd)
			},
		},
		dfr_clear: {
			name: 'Clear DFR filters',
			options: [Fields.Dfr],
			callback: ({ options }) => {
				let cmd = `SET DFR${options.dfr}_CLEAR_ALL_FILTERS ON`
				this.sendCommand(cmd)
			},
		},
		dfr_freeze: {
			name: 'Set DFR freeze',
			options: [Fields.Dfr, Fields.OnOff],
			callback: ({ options }) => {
				let cmd = `SET DFR${options.dfr}_FREEZE ${options.choice}`
				this.sendCommand(cmd)
			},
		},
		auto_link_mode: {
			name: 'Set auto link mode',
			options: [Fields.OnOff],
			callback: ({ options }) => {
				let cmd = `SET AUTO_LINK_MODE ${options.choice}`
				this.sendCommand(cmd)
			},
		},
		flash_lights: {
			name: 'Flash lights on the mixer',
			tooltip: 'It will automatically turn off after 30 seconds',
			options: [],
			callback: () => {
				let cmd = `SET FLASH ON`
				this.sendCommand(cmd)
			},
		},
	})
}
