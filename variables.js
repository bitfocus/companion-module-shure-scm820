module.exports = {
	/**
	 * INTERNAL: initialize variables.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initVariables() {
		// variable_set
		var variables = []

		for (let i = 1; i <= 19; i++) {
			let prefix = this.api.getChannel(i).prefix
			let label =
				i >= 1 && i <= 8
					? `Channel ${i} `
					: i == 9
					? `Aux In `
					: i >= 10 && i <= 17
					? ` Output ${i - 9} `
					: i == 18
					? 'Mix A '
					: 'Mix B '

			variables.push({ name: prefix + 'name', label: label + 'Name' })

			if (i <= 8) {
				variables.push({ name: prefix + 'audio_gain', label: label + 'Gain' })
				variables.push({ name: prefix + 'audio_mute', label: label + 'Mute' })
				variables.push({ name: prefix + 'always_on_enable_a', label: label + 'Always On Enable A' })
				variables.push({ name: prefix + 'always_on_enable_b', label: label + 'Always On Enable B' })
				variables.push({ name: prefix + 'input_audio_gate_a', label: label + 'Input Gate A' })
				variables.push({ name: prefix + 'input_audio_gate_b', label: label + 'Input Gate B' })
			} else if (i == 9) {
				variables.push({ name: prefix + 'audio_gain', label: label + 'Gain' })
				variables.push({ name: prefix + 'audio_mute', label: label + 'Mute' })
			} else if (i >= 18) {
				variables.push({ name: prefix + 'audio_gain', label: label + 'Gain' })
				variables.push({ name: prefix + 'audio_mute', label: label + 'Mute' })
				variables.push({ name: prefix + 'intellimix_mode', label: label + 'IntelliMix Mode' })
				variables.push({ name: prefix + 'limiter_engaged', label: label + 'Limited Engaged' })
			}

			variables.push({ name: prefix + 'clip_indicator', label: label + 'Clip Indicator' })
		}

		for (let i = 1; i <= 2; i++) {
			variables.push({ name: `dfr${i}_assigned_chan`, label: `DFR ${i} Assigned Channel` })
			variables.push({ name: `dfr${i}_bypass`, label: `DFR ${i} Bypass` })
			variables.push({ name: `dfr${i}_freeze`, label: `DFR ${i} Freeze` })
		}

		variables.push({ name: 'device_id', label: 'Device ID' })
		variables.push({ name: 'auto_link_mode', label: 'Auto Link Mode' })
		variables.push({ name: 'meter_rate', label: 'Meter Rate' })

		this.setVariableDefinitions(variables)
	},
}
