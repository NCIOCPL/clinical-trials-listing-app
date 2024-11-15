import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Fieldset, TextInput } from '../../atomic';
import { useAppSettings } from '../../../store/store.js';

const TrialId = ({ handleUpdate }) => {
	const trialId = useSelector((store) => store.form.trialId);

	const [{ helpUrl }] = useAppSettings();

	return (
		<Fieldset id="trialid" legend="Trial ID" helpUrl={helpUrl + '#trialid'}>
			<TextInput
				action={(e) => handleUpdate(e.target.id, e.target.value)}
				value={trialId}
				id="trialId"
				type="text"
				label="Trial ID"
				labelHidden
				inputHelpText="Separate multiple IDs with commas."
			/>
		</Fieldset>
	);
};

TrialId.propTypes = {
	handleUpdate: PropTypes.func,
};

export default TrialId;
