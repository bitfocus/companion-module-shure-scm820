module.exports = {
	/**
	 * INTERNAL: Get the available actions.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	getActions() {
		var actions = {}

		actions['chan_name'] = {
			label: 'Set channel name',
			options: [this.CHANNELS_FIELD(), this.NAME_FIELD],
			callback: ({ options }) => {
				let cmd = `SET ${options.channel} CHAN_NAME {${options.name}}`
				this.sendCommand(cmd)
			},
		}

		actions['audio_mute'] = {
			label: 'Mute or unmute channel',
			options: [this.CHANNELS_FIELD(), this.MUTE_FIELD],
			callback: ({ options }) => {
				let cmd = `SET ${options.channel} AUDIO_MUTE ${options.choice}`
				this.sendCommand(cmd)
			},
		}

		actions['audio_gain'] = {
			label: 'Set audio gain of channel',
			options: [this.CHANNELS_FIELD(), this.GAIN_SET_FIELD],
			callback: ({ options }) => {
				let value = (options.gain + 110) * 10
				let cmd = `SET ${options.channel} AUDIO_GAIN_HI_RES ${value}`
				this.sendCommand(cmd)
			},
		}
		actions['audio_gain_inc'] = {
			label: 'Increase audio gain of channel',
			options: [this.CHANNELS_FIELD(), this.GAIN_INC_FIELD],
			callback: ({ options }) => {
				let value = options.gain * 10
				let cmd = `SET ${options.channel} AUDIO_GAIN_HI_RES INC ${value}`
				this.sendCommand(cmd)
			},
		}
		actions['audio_gain_dec'] = {
			label: 'Decrease audio gain of channel',
			options: [this.CHANNELS_FIELD(), this.GAIN_INC_FIELD],
			callback: ({ options }) => {
				let value = options.gain * 10
				let cmd = `SET ${options.channel} AUDIO_GAIN_HI_RES DEC ${value}`
				this.sendCommand(cmd)
			},
		}

		actions['always_on_enable'] = {
			label: 'Set channel always on in audiomix',
			options: [this.MIXER_FIELD, this.CHANNELS_FIELD('I'), this.ONOFFTOGGLE_FIELD],
			callback: ({ options }) => {
				let cmd = `SET ${options.channel} ALWAYS_ON_ENABLE_${options.mix} ${options.choice}`
				this.sendCommand(cmd)
			},
		}

		actions['intellimix_mode'] = {
			label: 'Set IntelliMix Mode',
			options: [this.CHANNELS_FIELD('M'), this.INTELLIMIX_MODE_FIELD],
			callback: ({ options }) => {
				let cmd = `SET ${options.channel} INTELLIMIX_MODE ${options.choice}`
				this.sendCommand(cmd)
			},
		}

		actions['dfr_assigned_chan'] = {
			label: 'Set Assign DFR',
			options: [this.DFR_FIELD, this.CHANNELS_FIELD('IMU')],
			callback: ({ options }) => {
				let cmd = `SET DFR${options.dfr}_ASSIGN_CHAN ${options.channel}`
				this.sendCommand(cmd)
			},
		}
		actions['dfr_bypass'] = {
			label: 'Set DFR Bypass',
			options: [this.DFR_FIELD, this.ONOFF_FIELD],
			callback: ({ options }) => {
				let cmd = `SET DFR${options.dfr}_BYPASS ${options.choice}`
				this.sendCommand(cmd)
			},
		}
		actions['dfr_clear'] = {
			label: 'Clear DFR Filters',
			options: [this.DFR_FIELD],
			callback: ({ options }) => {
				let cmd = `SET DFR${options.dfr}_CLEAR_ALL_FILTERS ON`
				this.sendCommand(cmd)
			},
		}
		actions['dfr_freeze'] = {
			label: 'Set DFR Freeze',
			options: [this.DFR_FIELD, this.ONOFF_FIELD],
			callback: ({ options }) => {
				let cmd = `SET DFR${options.dfr}_FREEZE ${options.choice}`
				this.sendCommand(cmd)
			},
		}

		actions['auto_link_mode'] = {
			label: 'Set auto link mode',
			options: [this.ONOFF_FIELD],
			callback: ({ options }) => {
				let cmd = `SET AUTO_LINK_MODE ${options.choice}`
				this.sendCommand(cmd)
			},
		}
		actions['flash_lights'] = {
			label: 'Flash lights on the mixer',
			tooltip: 'It will automatically turn off after 30 seconds',
			options: [],
			callback: (action) => {
				let cmd = `SET FLASH ON`
				this.sendCommand(cmd)
			},
		}

		return actions
	},
}
