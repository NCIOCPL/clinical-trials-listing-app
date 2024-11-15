import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Fieldset, Checkbox } from '../../atomic';
import { useAppSettings } from '../../../store/store.js';
import './TrialPhase.scss';

const TrialPhase = ({ handleUpdate }) => {
	const { trialPhases } = useSelector((store) => store.form);
	const [phases, setPhases] = useState(trialPhases);

	const [{ helpUrl }] = useAppSettings();

	useEffect(() => {
		updateStore();
	}, [phases]);

	const updateStore = () => {
		handleUpdate('trialPhases', [...phases]);
	};

	const handleSelectAll = () => {
		setPhases(
			phases.map((phase) => ({
				...phase,
				checked: false,
			}))
		);
	};

	const handleCheckPhase = (e) => {
		const filtered = phases.map((phase) => {
			if (phase.value === e.target.value) {
				return {
					...phase,
					checked: e.target.checked,
				};
			} else {
				return phase;
			}
		});
		setPhases(filtered);
	};

	return (
		<Fieldset
			id="trialphase"
			classes="trial-phase"
			legend="Trial Phase"
			helpUrl={helpUrl + '#trialphase'}>
			<p>
				Select the trial phases for your search. You may check more than one box
				or select &quot;All&quot;.
			</p>
			<div className="select-all">
				<Checkbox
					value=""
					name="tp"
					id="tp_all"
					label="All"
					classes="tp-all"
					checked={phases.every((phase) => !phase.checked)}
					onChange={handleSelectAll}
				/>
			</div>
			<div className="group-phases">
				{phases.map((field) => (
					<Checkbox
						id={'tp_' + field.value}
						key={'tp_' + field.value}
						name="tp"
						value={field.value}
						label={field.label}
						onChange={handleCheckPhase}
						checked={field.checked}
					/>
				))}
			</div>
		</Fieldset>
	);
};

TrialPhase.propTypes = {
	phaseFields: PropTypes.array,
	handleUpdate: PropTypes.func,
};

export default TrialPhase;
