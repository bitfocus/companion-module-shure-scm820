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
			callback: (feedback, bank, info) => {
				let out = {
					alignment: 'center:top',
					img64: this.api.getInputLevelsIcon(info),
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
			callback: (feedback, bank, info) => {
				let out = {
					alignment: 'center:top',
					img64: this.api.getOutputLevelsIcon(info),
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
			callback: (feedback, bank, info) => {
				let out = {
					alignment: 'center:top',
					img64: this.api.getMixerLevelsIcon(info),
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
			callback: (feedback, bank, info) => {
				let opt = feedback.options
				let channel = this.api.getChannel(parseInt(opt.channel))
				let out = {
					alignment: 'left:top',
					img64: this.api.getChannelIcon(parseInt(opt.channel), info),
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
			callback: (feedback, bank, info) => {
				let opt = feedback.options
				let channel = this.api.getChannel(parseInt(opt.channel))
				let out = {
					alignment: 'left:top',
					img64: this.api.getMixerIcon(parseInt(opt.channel), info),
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
			type: 'boolean',
			label: 'Channel Mute',
			description: 'Change color if the selected channel is muted.',
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 255, 0),
			},
			options: [this.CHANNELS_FIELD(), this.ONOFF_FIELD],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).audioMute == options.choice) {
					return true
				} else {
					return false
				}
			},
		}
		feedbacks['audio_gain'] = {
			type: 'boolean',
			label: 'Channel Gain',
			description: 'Change color if the channel gain it set to a level.',
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 255, 0),
			},
			options: [this.CHANNELS_FIELD(), this.GAIN_SET_FIELD],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).audioGain == options.gain) {
					return true
				} else {
					return false
				}
			},
		}

		feedbacks['always_on_enable'] = {
			type: 'boolean',
			label: 'Channel Always On in Mix',
			description: 'Change color if the channel is set always on in the mix.',
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 255, 0),
			},
			options: [this.MIXER_FIELD, this.CHANNELS_FIELD('I')],
			callback: ({ options }) => {
				if (
					(options.mix == 'A' && this.api.getChannel(parseInt(options.channel)).alwaysOnA == 'ON') ||
					(options.mix == 'B' && this.api.getChannel(parseInt(options.channel)).alwaysOnB == 'ON')
				) {
					return true
				} else {
					return false
				}
			},
		}

		feedbacks['intellimix_mode'] = {
			type: 'boolean',
			label: 'IntelliMix Mode',
			description: "Change color if the mixer's IntelliMix mode is selected.",
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 255, 0),
			},
			options: [this.CHANNELS_FIELD('M'), this.INTELLIMIX_MODE_FIELD],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).intellimixMode == options.choice) {
					return true
				} else {
					return false
				}
			},
		}

		feedbacks['dfr_assigned_chan'] = {
			type: 'boolean',
			label: 'DFR Assigned Channel',
			description: 'Change color if the selected channel is assigned to the DFR.',
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 255, 0),
			},
			options: [this.DFR_FIELD, this.CHANNELS_FIELD('IMU')],
			callback: ({ options }) => {
				if (this.api.getDfr(parseInt(options.dfr)).assignedChan == options.channel) {
					return true
				} else {
					return false
				}
			},
		}
		feedbacks['dfr_bypass'] = {
			type: 'boolean',
			label: 'DFR Bypassed',
			description: 'Change color if the selected DFR is set to bypass.',
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 255, 0),
			},
			options: [this.DFR_FIELD],
			callback: ({ options }) => {
				if (this.api.getDfr(parseInt(options.dfr)).bypass == 'ON') {
					return true
				} else {
					return false
				}
			},
		}
		feedbacks['dfr_freeze'] = {
			type: 'boolean',
			label: 'DFR Frozen',
			description: 'Change color if the selected DFR is frozen.',
			style: {
				color: this.rgb(255, 255, 255),
				bgcolor: this.rgb(0, 0, 255),
			},
			options: [this.DFR_FIELD],
			callback: ({ options }) => {
				if (this.api.getDfr(parseInt(options.dfr)).frozen == 'ON') {
					return true
				} else {
					return false
				}
			},
		}

		feedbacks['auto_link_mode'] = {
			type: 'boolean',
			label: 'Auto Link Mode Enabled',
			description: 'Change color if auto link mode is enabled.',
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 255, 0),
			},
			options: [],
			callback: ({ options }) => {
				if (this.api.getMixer().autoLinkMode == 'ON') {
					return true
				} else {
					return false
				}
			},
		}

		this.setFeedbackDefinitions(feedbacks)
	},
}
