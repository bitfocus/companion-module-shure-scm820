import { combineRgb } from '@companion-module/base'
import { Fields } from './setup.js'

/**
 * INTERNAL: initialize feedbacks.
 *
 * @access protected
 * @since 1.0.0
 */
export function updateFeedbacks() {
	this.setFeedbackDefinitions({
		input_levels: {
			type: 'advanced',
			name: 'Input Levels Display',
			description: 'Provide a visual display of the input levels.',
			options: [],
			callback: (event) => {
				let out = {
					alignment: 'center:top',
					imageBuffers: [{ buffer: this.api.getInputLevelsIcon(event.image) }],
					size: '8',
					text: 'IN: 123456789',
				}

				return out
			},
		},
		output_levels: {
			type: 'advanced',
			name: 'Output Levels Display',
			description: 'Provide a visual display of the output levels.',
			options: [],
			callback: (event) => {
				let out = {
					alignment: 'center:top',
					imageBuffers: [{ buffer: this.api.getOutputLevelsIcon(event.image) }],
					size: '8',
					text: 'OUT: 12345678',
				}

				return out
			},
		},
		mixer_levels: {
			type: 'advanced',
			name: 'Mixer Levels Display',
			description: 'Provide a visual display of the mixer levels.',
			options: [],
			callback: (event) => {
				let out = {
					alignment: 'center:top',
					imageBuffers: [{ buffer: this.api.getMixerLevelsIcon(event.image) }],
					size: '8',
					text: 'MIX  A   B  OUT\\n\\n LIM              LIM',
				}

				return out
			},
		},
		channel_status: {
			type: 'advanced',
			name: 'Channel Status Display',
			description: "Provide a visual display of the channel's status.",
			options: [this.CHANNELS_FIELD('IA')],
			callback: (event) => {
				let opt = event.options
				let channel = this.api.getChannel(parseInt(opt.channel))
				let out = {
					alignment: 'left:top',
					imageBuffers: [{ buffer: this.api.getChannelIcon(parseInt(opt.channel), event.image) }],
					size: '8',
					text: '',
				}

				out.text += '  ' + channel.name + '\\n'
				out.text += '  ' + channel.audioGain2 + '\\n'
				out.text += parseInt(opt.channel) == 9 ? '' : '          A     B\\n  ON'

				return out
			},
		},
		mixer_status: {
			type: 'advanced',
			name: 'Mix Status Display',
			description: "Provide a visual display of the mix's status.",
			options: [this.CHANNELS_FIELD('M')],
			callback: (event) => {
				let opt = event.options
				let channel = this.api.getChannel(parseInt(opt.channel))
				let out = {
					alignment: 'left:top',
					imageBuffers: [{ buffer: this.api.getMixerIcon(parseInt(opt.channel), event.image) }],
					size: '8',
					text: '',
				}

				out.text += channel.name + '\\n'
				out.text += (channel.intellimixMode == 'CUSTOM_PRESET' ? 'PRESET' : channel.intellimixMode) + '\\n'
				out.text += channel.audioGain2 + '\\n'
				out.text += '               LIM'

				return out
			},
		},
		audio_mute: {
			type: 'boolean',
			name: 'Channel Mute',
			description: 'Change color if the selected channel is muted.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [this.CHANNELS_FIELD(), Fields.OnOff],
			callback: ({ options }) => {
				return this.api.getChannel(parseInt(options.channel)).audioMute == options.choice
			},
		},
		audio_gain: {
			type: 'boolean',
			name: 'Channel Gain',
			description: 'Change color if the channel gain it set to a level.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [this.CHANNELS_FIELD(), Fields.GainSet],
			callback: ({ options }) => {
				return this.api.getChannel(parseInt(options.channel)).audioGain == options.gain
			},
		},
		always_on_enable: {
			type: 'boolean',
			name: 'Channel Always On in Mix',
			description: 'Change color if the channel is set always on in the mix.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [Fields.Mixer, this.CHANNELS_FIELD('I')],
			callback: ({ options }) => {
				return (
					(options.mix == 'A' && this.api.getChannel(parseInt(options.channel)).alwaysOnA == 'ON') ||
					(options.mix == 'B' && this.api.getChannel(parseInt(options.channel)).alwaysOnB == 'ON')
				)
			},
		},
		intellimix_mode: {
			type: 'boolean',
			name: 'IntelliMix Mode',
			description: "Change color if the mixer's IntelliMix mode is selected.",
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [this.CHANNELS_FIELD('M'), Fields.IntellimixMode],
			callback: ({ options }) => {
				return this.api.getChannel(parseInt(options.channel)).intellimixMode == options.choice
			},
		},
		dfr_assigned_chan: {
			type: 'boolean',
			name: 'DFR Assigned Channel',
			description: 'Change color if the selected channel is assigned to the DFR.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [Fields.Dfr, this.CHANNELS_FIELD('IMU')],
			callback: ({ options }) => {
				return this.api.getDfr(parseInt(options.dfr)).assignedChan == options.channel
			},
		},
		dfr_bypass: {
			type: 'boolean',
			name: 'DFR Bypassed',
			description: 'Change color if the selected DFR is set to bypass.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [Fields.Dfr],
			callback: ({ options }) => {
				return this.api.getDfr(parseInt(options.dfr)).bypass == 'ON'
			},
		},
		dfr_freeze: {
			type: 'boolean',
			name: 'DFR Frozen',
			description: 'Change color if the selected DFR is frozen.',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			options: [Fields.Dfr],
			callback: ({ options }) => {
				return this.api.getDfr(parseInt(options.dfr)).frozen == 'ON'
			},
		},
		auto_link_mode: {
			type: 'boolean',
			name: 'Auto Link Mode Enabled',
			description: 'Change color if auto link mode is enabled.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [],
			callback: () => {
				return this.api.getMixer().autoLinkMode == 'ON'
			},
		},
	})
}
