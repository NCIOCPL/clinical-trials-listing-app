import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { FILTER_CONFIG } from '../../config/filterConfig';
import FilterGroup from '../FilterGroup';
// import { useTracking } from 'react-tracking';
import { useZipConversion } from '../../hooks/useZipConversion';
import { isValidZipFormat } from '../../utils/locationUtils';
import './ZipCodeFilter.scss';

const ZipCodeFilter = ({ zipCode, radius, onZipCodeChange, onRadiusChange, onValidationChange, onFocus, disabled }) => {
	const [formatError, setFormatError] = useState('');
	const [, setIsValidating] = useState(false);
	const [hasInvalidZip, setHasInvalidZip] = useState(false);
	const [validCoordinates, setValidCoordinates] = useState(null);
	// const tracking = useTracking();

	const [{ getZipCoords, validationStatus }] = useZipConversion();

	// Update component state based on validation status changes
	useEffect(() => {
		if (!validationStatus) return;

		setIsValidating(false); // End validation when we have a result

		if (validationStatus.isValid) {
			// Valid coordinates received
			setHasInvalidZip(false);
			setValidCoordinates(validationStatus.coordinates);
		} else {
			// Invalid zipcode
			setHasInvalidZip(true);
			setValidCoordinates(null);
		}
	}, [validationStatus]);

	// Called by parent when Apply button is clicked
	const getValidationStatus = () => {
		// Return current validation state
		if (!zipCode) {
			return { isValid: true, coordinates: null };
		}

		if (formatError || hasInvalidZip) {
			return { isValid: false, coordinates: null };
		}

		return { isValid: !!validCoordinates, coordinates: validCoordinates };
	};

	useEffect(() => {
		if (onValidationChange) {
			onValidationChange(getValidationStatus);
		}
	}, [onValidationChange]);

	// Validate the format
	const validateFormat = (value) => {
		const isFormatValid = !value || isValidZipFormat(value);
		if (!isFormatValid) {
			setFormatError('Please enter a valid U.S. ZIP code');
			// Clear coordinates if format is invalid
			setValidCoordinates(null);
			return false;
		}
		setFormatError('');
		return true;
	};

	// Handle zipcode change
	const handleZipCodeChange = (e) => {
		const value = e.target.value;
		const isFormatValid = validateFormat(value);

		// Always reset invalid zip state when the input changes
		setHasInvalidZip(false);

		// Track complete, valid zipcodes (optional analytics)
		if (value && value.length === 5 && isFormatValid) {
			// tracking.trackEvent({
			// 	type: 'Other',
			// 	event: 'TrialListingApp:Filter:ZipCode',
			// 	value,
			// });
		} else if (!value) {
			// Empty zipcode is valid
			setHasInvalidZip(false);
			setValidCoordinates(null);
		}

		// This will trigger the useEffect that handles validation
		onZipCodeChange(value);
	};

	useEffect(() => {
		if (zipCode && zipCode.length === 5 && isValidZipFormat(zipCode)) {
			// Set validating state to true when starting validation
			setIsValidating(true);

			// Call directly since getZipCoords now handles all validation internally
			getZipCoords(zipCode).catch((err) => {
				console.error('Error fetching ZIP coordinates:', err);
				setIsValidating(false); // Ensure we reset state even if there's an error
			});
		} else if (!zipCode) {
			// Reset all error states when zipCode is cleared (e.g. by clear filters button)
			setFormatError('');
			setHasInvalidZip(false);
			setValidCoordinates(null);
			setIsValidating(false);
		}
	}, [zipCode, getZipCoords]);

	// When validCoordinates change and we have a zipCode from URL, notify parent
	useEffect(() => {
		if (validCoordinates && !hasInvalidZip && onValidationChange) {
			// For URL parameters, pass the validation result directly
			onValidationChange({
				isValid: true,
				coordinates: validCoordinates,
			});
		} else if (hasInvalidZip && onValidationChange) {
			// Explicitly communicate invalid ZIP
			onValidationChange({
				isValid: false,
				coordinates: null,
			});
		}
	}, [validCoordinates, hasInvalidZip, zipCode, onValidationChange]);

	// Determine error message
	const error = formatError || (hasInvalidZip ? 'Please enter a valid U.S. ZIP code' : '');

	return (
		<>
			<FilterGroup title="Location by ZIP Code">
				<div className={`usa-form-group ${error ? 'usa-form-group--error' : ''}`}>
					{error && (
						<span className="usa-error-message" id="zip-error" role="alert">
							{error}
						</span>
					)}
					<input id="zip-code-filter" name="zip-code" aria-label="Enter ZIP code" type="text" className={`usa-input form-control ${error ? 'usa-input--error' : ''}`} placeholder="Enter U.S. ZIP Code" value={zipCode} onChange={handleZipCodeChange} onFocus={onFocus} maxLength={5} disabled={disabled} aria-describedby={error ? 'zip-error' : undefined} />
				</div>
			</FilterGroup>

			<FilterGroup title={FILTER_CONFIG.radius.title}>
				<div className="usa-combo-box">
					<select id="radius-filter" name="radius" aria-label="Select search radius" className="usa-select usa-combo-box__select form-control" value={radius || (zipCode ? '100' : '')} onChange={onRadiusChange} onFocus={onFocus} disabled={disabled || !zipCode || error}>
						<option value="">Select</option>
						{FILTER_CONFIG.radius.options.map((option) => (
							<option key={option.id} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</FilterGroup>
		</>
	);
};

ZipCodeFilter.propTypes = {
	zipCode: PropTypes.string.isRequired,
	radius: PropTypes.string,
	onZipCodeChange: PropTypes.func.isRequired,
	onRadiusChange: PropTypes.func.isRequired,
	onValidationChange: PropTypes.func,
	onFocus: PropTypes.func,
	disabled: PropTypes.bool,
};

export default ZipCodeFilter;
