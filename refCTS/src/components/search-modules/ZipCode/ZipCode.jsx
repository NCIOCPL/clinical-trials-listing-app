import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Fieldset, TextInput } from '../../atomic';
import { useZipConversion } from '../../../hooks';
import { INVALID_ZIP_TEXT } from '../../../constants';
import { useAppSettings } from '../../../store/store.js';

const ZipCode = ({ handleUpdate }) => {
	const { zip, hasInvalidZip } = useSelector((store) => store.form);
	const [inputtedZip, setInputtedZip] = useState('');
	const [{ getZipCoords }] = useZipConversion(handleUpdate);
	const [{ helpUrl }] = useAppSettings();

	useEffect(() => {
		if (inputtedZip.length === 5) {
			getZipCoords(inputtedZip);
			validateZip();
		} else if (inputtedZip === '') {
			clearZip();
		}
	}, [inputtedZip]);

	const handleZipUpdate = (e) => {
		setInputtedZip(e.target.value);
	};

	const clearZip = () => {
		handleUpdate('zip', '');
		handleUpdate('zipCoords', { lat: '', long: '' });
		handleUpdate('hasInvalidZip', false);
	};

	const validateZip = () => {
		if (inputtedZip.length === 5) {
			// test that all characters are numbers
			if (isNaN(inputtedZip)) {
				handleUpdate('hasInvalidZip', true);
			} else {
				handleUpdate('zip', inputtedZip);
				handleUpdate('location', 'search-location-zip');
			}
		} else if (inputtedZip.length === 0) {
			// empty treat as blank
			clearZip();
		} else {
			handleUpdate('hasInvalidZip', true);
		}
	};

	return (
		<Fieldset
			id="zip"
			legend="U.S. ZIP Code"
			helpUrl={
				helpUrl + '#how-to-find-clinical-trials-using-the-basic-search-form'
			}>
			<TextInput
				action={handleZipUpdate}
				id="zip"
				label="zip code"
				labelHidden
				errorMessage={hasInvalidZip ? INVALID_ZIP_TEXT : ''}
				inputHelpText="Show trials near this U.S. ZIP code."
				maxLength={5}
				value={zip}
				onBlur={validateZip}
			/>
		</Fieldset>
	);
};
ZipCode.propTypes = {
	handleUpdate: PropTypes.func,
};
export default ZipCode;
