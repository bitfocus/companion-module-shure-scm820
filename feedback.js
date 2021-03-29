module.exports = {
	/**
	 * INTERNAL: initialize feedbacks.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initFeedbacks() {
		// feedbacks
		let feedbacks = {}

		feedbacks['input_levels'] = {
			label: 'Input Levels Display',
			description: 'Provide a visual display of the input levels.',
			options: [],
			callback: (feedback, bank) => {
				let out = {
					alignment: 'center:top',
					img64: this.api.getInputLevelsIcon(),
					size: '7',
					text: 'I:123456789',
				}

				return out
			},
		}
		feedbacks['output_levels'] = {
			label: 'Output Levels Display',
			description: 'Provide a visual display of the output levels.',
			options: [],
			callback: (feedback, bank) => {
				let out = {
					alignment: 'center:top',
					img64: this.api.getOutputLevelsIcon(),
					size: '7',
					text: 'O:12345678',
				}

				return out
			},
		}
		feedbacks['mixer_levels'] = {
			label: 'Mixer Levels Display',
			description: 'Provide a visual display of the mixer levels.',
			options: [],
			callback: (feedback, bank) => {
				let out = {
					alignment: 'center:top',
					img64: this.api.getMixerLevelsIcon(),
					size: '7',
					text: 'MIX A B OUT\\n\\nLIM      LIM',
				}

				return out
			},
		}

		feedbacks['channel_status'] = {
			label: 'Channel Status Display',
			description: "Provide a visual display of the channel's status.",
			options: [this.CHANNELS_FIELD('IA')],
			callback: (feedback, bank) => {
				let opt = feedback.options
				let channel = this.api.getChannel(parseInt(opt.channel))
				let out = {
					alignment: 'left:top',
					img64: this.api.getChannelIcon(parseInt(opt.channel)),
					size: '7',
					text: '',
				}

				out.text += channel.name + '\\n'
				out.text += channel.audioGain2 + '\\n'
				out.text += parseInt(opt.channel) == 9 ? '' : '     A  B\\nON'

				return out
			},
		}

		feedbacks['mixer_status'] = {
			label: 'Mix Status Display',
			description: "Provide a visual display of the mix's status.",
			options: [this.CHANNELS_FIELD('M')],
			callback: (feedback, bank) => {
				let opt = feedback.options
				let channel = this.api.getChannel(parseInt(opt.channel))
				let out = {
					alignment: 'left:top',
					img64: this.api.getMixerIcon(parseInt(opt.channel)),
					size: '7',
					text: '',
				}

				out.text += channel.name + '\\n'
				out.text += (channel.intellimixMode == 'CUSTOM_PRESET' ? 'PRESET' : channel.intellimixMode) + '\\n'
				out.text += channel.audioGain2 + '\\n'
				out.text += '       LIM'

				return out
			},
		}

		feedbacks['audio_mute'] = {
			label: 'Channel Mute',
			description: 'Change color if the selected channel is muted.',
			options: [
				this.BG_COLOR_FIELD(this.rgb(255, 255, 0)),
				this.FG_COLOR_FIELD(this.rgb(0, 0, 0)),
				this.CHANNELS_FIELD(),
				this.ONOFF_FIELD,
			],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).audioMute == options.choice) {
					return {
						color: options.fg,
						bgcolor: options.bg,
					}
				}
			},
		}
		feedbacks['audio_gain'] = {
			label: 'Channel Gain',
			description: 'Change color if the channel gain it set to a level.',
			options: [
				this.BG_COLOR_FIELD(this.rgb(255, 255, 0)),
				this.FG_COLOR_FIELD(this.rgb(0, 0, 0)),
				this.CHANNELS_FIELD(),
				this.GAIN_SET_FIELD,
			],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).audioGain == options.gain) {
					return {
						color: options.fg,
						bgcolor: options.bg,
					}
				}
			},
		}

		feedbacks['always_on_enable'] = {
			label: 'Channel Always On in Mix',
			description: 'Change color if the channel is set always on in the mix.',
			options: [
				this.BG_COLOR_FIELD(this.rgb(255, 255, 0)),
				this.FG_COLOR_FIELD(this.rgb(0, 0, 0)),
				this.MIXER_FIELD,
				this.CHANNELS_FIELD('I'),
			],
			callback: ({ options }) => {
				if (
					(options.mix == 'A' && this.api.getChannel(parseInt(options.channel)).alwaysOnA == 'ON') ||
					(options.mix == 'B' && this.api.getChannel(parseInt(options.channel)).alwaysOnB == 'ON')
				) {
					return {
						color: options.fg,
						bgcolor: options.bg,
					}
				}
			},
		}

		feedbacks['intellimix_mode'] = {
			label: 'IntelliMix Mode',
			description: "Change color if the mixer's IntelliMix mode is selected.",
			options: [
				this.BG_COLOR_FIELD(this.rgb(255, 255, 0)),
				this.FG_COLOR_FIELD(this.rgb(0, 0, 0)),
				this.CHANNELS_FIELD('M'),
				this.INTELLIMIX_MODE_FIELD,
			],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).intellimixMode == options.choice) {
					return {
						color: options.fg,
						bgcolor: options.bg,
					}
				}
			},
		}

		feedbacks['dfr_assigned_chan'] = {
			label: 'DFR Assigned Channel',
			description: 'Change color if the selected channel is assigned to the DFR.',
			options: [
				this.BG_COLOR_FIELD(this.rgb(255, 255, 0)),
				this.FG_COLOR_FIELD(this.rgb(0, 0, 0)),
				this.DFR_FIELD,
				this.CHANNELS_FIELD('IMU'),
			],
			callback: ({ options }) => {
				if (this.api.getDfr(parseInt(options.dfr)).assignedChan == options.channel) {
					return {
						color: options.fg,
						bgcolor: options.bg,
					}
				}
			},
		}
		feedbacks['dfr_bypass'] = {
			label: 'DFR Bypassed',
			description: 'Change color if the selected DFR is set to bypass.',
			options: [this.BG_COLOR_FIELD(this.rgb(255, 255, 0)), this.FG_COLOR_FIELD(this.rgb(0, 0, 0)), this.DFR_FIELD],
			callback: ({ options }) => {
				if (this.api.getDfr(parseInt(options.dfr)).bypass == 'ON') {
					return {
						color: options.fg,
						bgcolor: options.bg,
					}
				}
			},
		}
		feedbacks['dfr_freeze'] = {
			label: 'DFR Frozen',
			description: 'Change color if the selected DFR is frozen.',
			options: [this.BG_COLOR_FIELD(this.rgb(0, 0, 255)), this.FG_COLOR_FIELD(this.rgb(255, 255, 255)), this.DFR_FIELD],
			callback: ({ options }) => {
				if (this.api.getDfr(parseInt(options.dfr)).frozen == 'ON') {
					return {
						color: options.fg,
						bgcolor: options.bg,
					}
				}
			},
		}

		feedbacks['auto_link_mode'] = {
			label: 'Auto Link Mode Enabled',
			description: 'Change color if auto link mode is enabled.',
			options: [this.BG_COLOR_FIELD(this.rgb(255, 255, 0)), this.FG_COLOR_FIELD(this.rgb(0, 0, 0))],
			callback: ({ options }) => {
				if (this.api.getReceiver().autoLinkMode == 'ON') {
					return {
						color: options.fg,
						bgcolor: options.bg,
					}
				}
			},
		}

		this.setFeedbackDefinitions(feedbacks)
	},
}
