/**
 * INTERNAL: initialize variables.
 *
 * @access protected
 * @since 1.0.0
 */
export function updateVariables() {
	// variable_set
	var variables = []

	for (let i = 1; i <= 19; i++) {
		let prefix = this.api.getChannel(i).prefix
		let label =
			i >= 1 && i <= 8
				? `Channel ${i}`
				: i == 9
				? `Aux In`
				: i >= 10 && i <= 17
				? ` Output ${i - 9}`
				: i == 18
				? 'Mix A'
				: 'Mix B'

		variables.push({ variableId: `${prefix}_name`, name: `${label} Name` })

		if (i <= 8) {
			variables.push({ variableId: `${prefix}_audio_gain`, name: `${label} Gain` })
			variables.push({ variableId: `${prefix}_audio_mute`, name: `${label} Mute` })
			variables.push({ variableId: `${prefix}_always_on_enable_a`, name: `${label} Always On Enable A` })
			variables.push({ variableId: `${prefix}_always_on_enable_b`, name: `${label} Always On Enable B` })
			variables.push({ variableId: `${prefix}_input_audio_gate_a`, name: `${label} Input Gate A` })
			variables.push({ variableId: `${prefix}_input_audio_gate_b`, name: `${label} Input Gate B` })
		} else if (i == 9) {
			variables.push({ variableId: `${prefix}_audio_gain`, name: `${label} Gain` })
			variables.push({ variableId: `${prefix}_audio_mute`, name: `${label} Mute` })
		} else if (i >= 18) {
			variables.push({ variableId: `${prefix}_audio_gain`, name: `${label} Gain` })
			variables.push({ variableId: `${prefix}_audio_mute`, name: `${label} Mute` })
			variables.push({ variableId: `${prefix}_intellimix_mode`, name: `${label} IntelliMix Mode` })
			variables.push({ variableId: `${prefix}_limiter_engaged`, name: `${label} Limited Engaged` })
		}

		variables.push({ variableId: `${prefix}_clip_indicator`, name: `${label} Clip Indicator` })
	}

	for (let i = 1; i <= 2; i++) {
		variables.push({ variableId: `dfr${i}_assigned_chan`, name: `DFR ${i} Assigned Channel` })
		variables.push({ variableId: `dfr${i}_bypass`, name: `DFR ${i} Bypass` })
		variables.push({ variableId: `dfr${i}_freeze`, name: `DFR ${i} Freeze` })
	}

	variables.push({ variableId: 'device_id', name: 'Device ID' })
	variables.push({ variableId: 'auto_link_mode', name: 'Auto Link Mode' })
	variables.push({ variableId: 'meter_rate', name: 'Meter Rate' })

	this.setVariableDefinitions(variables)
}
