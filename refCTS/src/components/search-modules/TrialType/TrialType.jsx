import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox, Fieldset, Toggle } from '../../atomic';
import { useAppSettings } from '../../../store/store.js';
import './TrialType.scss';

const TrialType = ({ handleUpdate }) => {
	//store vals
	const { trialTypes, healthyVolunteers } = useSelector((store) => store.form);
	const [trials, setTrials] = useState(trialTypes);
	const [hvToggle, setHvToggle] = useState(healthyVolunteers);
	const [{ helpUrl }] = useAppSettings();

	useEffect(() => {
		updateStore();
	}, [trials, hvToggle]);

	const updateStore = () => {
		handleUpdate('trialTypes', [...trials]);
		handleUpdate('healthyVolunteers', hvToggle);
	};

	const handleToggle = () => {
		setHvToggle(!hvToggle);
	};

	const handleSelectAll = () => {
		setTrials(
			trials.map((type) => ({
				...type,
				checked: false,
			}))
		);
	};

	const handleCheckType = (e) => {
		const filtered = trialTypes.map((type) => {
			if (type.value === e.target.value) {
				return {
					...type,
					checked: e.target.checked,
				};
			} else {
				return type;
			}
		});
		setTrials(filtered);
	};

	return (
		<Fieldset
			id="trialtype"
			legend="Trial Type"
			classes="trial-type"
			helpUrl={helpUrl + '#trialtype'}>
			<p>
				Select the type of trial for your search. You may check more than one
				box or select &quot;All&quot;. You may choose to limit results to trials
				accepting healthy volunteers.
			</p>

			<div className="data-toggle-block">
				<Toggle
					id="hv"
					checked={hvToggle}
					label="Limit results to Veterans Affairs facilities"
					onClick={handleToggle}
					onChange={() => {}}
				/>
				Limit results to trials accepting healthy volunteers
			</div>
			<div className="select-all">
				<Checkbox
					value=""
					id="tt_all"
					label="All"
					classes="tt-all"
					checked={trialTypes.every((type) => !type.checked)}
					onChange={handleSelectAll}
				/>
			</div>
			<div className="group-trial-types">
				{trialTypes.map((trialType, idx) => (
					<Checkbox
						key={idx}
						id={`tt_${trialType.value}`}
						value={trialType.value}
						label={trialType.label}
						onChange={handleCheckType}
						checked={trialType.checked}
					/>
				))}
			</div>
		</Fieldset>
	);
};

TrialType.propTypes = {
	trialTypeFields: PropTypes.array,
	handleUpdate: PropTypes.func,
};

export default TrialType;
