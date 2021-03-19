module.exports = {
	/**
	 * INTERNAL: initialize feedbacks.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initFeedbacks() {
		// feedbacks
		var feedbacks = {}

		feedbacks['input_levels'] = {
			label: 'Input Levels Display',
			description: 'Provide a visual display of the input levels.',
			options: [],
			callback: (feedback, bank) => {
				var out = {
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
				var out = {
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
				var out = {
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
				var opt = feedback.options
				var channel = this.api.getChannel(parseInt(opt.channel))
				var out = {
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
				var opt = feedback.options
				var channel = this.api.getChannel(parseInt(opt.channel))
				var out = {
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
				if (this.api.getDfr(options.dfr).assignedChan == options.channel) {
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
				if (this.api.getDfr(options.dfr).bypass == 'ON') {
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
				if (this.api.getDfr(options.dfr).frozen == 'ON') {
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
