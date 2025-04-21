/**
 * @file This file defines the ZipCodeFilter component, which provides a location-based
 * filtering mechanism using US ZIP codes. It includes validation of ZIP code format,
 * geocoding to coordinates, radius selection, and error handling.
 */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { FILTER_CONFIG } from '../../config/filterConfig';
import FilterGroup from '../FilterGroup';
// import { useTracking } from 'react-tracking';
import { useZipConversion } from '../../hooks/useZipConversion';
import { isValidZipFormat } from '../../utils/locationUtils';
import './ZipCodeFilter.scss';

/**
 * Renders a ZIP code filter with validation and radius selection.
 * Handles ZIP code validation (format and existence), geocoding to coordinates,
 * and communicates validation status to parent components.
 *
 * @param {object} props - The component props.
 * @param {string} props.zipCode - The current ZIP code value.
 * @param {string} props.radius - The current radius value in miles.
 * @param {Function} props.onZipCodeChange - Callback when ZIP code changes.
 * @param {Function} props.onRadiusChange - Callback when radius changes.
 * @param {Function} props.onValidationChange - Callback to communicate validation status to parent.
 * @param {Function} props.onFocus - Callback when either input gains focus.
 * @param {boolean} props.disabled - Whether the inputs should be disabled.
 * @returns {JSX.Element} The rendered ZipCodeFilter component.
 */
const ZipCodeFilter = ({ zipCode, radius, onZipCodeChange, onRadiusChange, onValidationChange, onFocus, disabled }) => {
	// State for tracking validation status and errors
	const [formatError, setFormatError] = useState('');
	const [, setIsValidating] = useState(false);
	const [hasInvalidZip, setHasInvalidZip] = useState(false);
	const [validCoordinates, setValidCoordinates] = useState(null);
	// const tracking = useTracking();

	// Custom hook for ZIP code to coordinates conversion
	const [{ getZipCoords, validationStatus }] = useZipConversion();

	/**
	 * Updates component state based on validation status changes from the useZipConversion hook.
	 * Sets coordinates if valid, or marks ZIP as invalid if not.
	 */
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

	/**
	 * Returns the current validation status for the parent component.
	 * Called by parent when Apply button is clicked.
	 *
	 * @returns {object} Object containing isValid flag and coordinates if valid.
	 */
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

	/**
	 * Provides the parent component with access to the getValidationStatus function.
	 */
	useEffect(() => {
		if (onValidationChange) {
			onValidationChange(getValidationStatus);
		}
	}, [onValidationChange]);

	/**
	 * Validates the ZIP code format using the isValidZipFormat utility.
	 * Sets error state if format is invalid.
	 *
	 * @param {string} value - The ZIP code to validate.
	 * @returns {boolean} Whether the format is valid.
	 */
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

	/**
	 * Handles changes to the ZIP code input.
	 * Validates format, resets error states, and calls the parent callback.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
	 */
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

	/**
	 * Triggers ZIP code validation when a complete, valid ZIP is entered.
	 * Resets states when ZIP is cleared.
	 */
	useEffect(() => {
		if (zipCode && zipCode.length === 5 && isValidZipFormat(zipCode)) {
			// Set validating state to true when starting validation
			setIsValidating(true);

			// Call directly since getZipCoords now handles all validation internally
			getZipCoords(zipCode).catch(() => {
				// Log error but don't display to user - UI will show invalid ZIP message
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

	/**
	 * Notifies parent component when validation status changes.
	 * Used for initial validation from URL parameters and subsequent validations.
	 */
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

	// Determine error message to display
	const error = formatError || (hasInvalidZip ? 'Please enter a valid U.S. ZIP code' : '');

	return (
		<>
			{/* ZIP Code Input Field */}
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

			{/* Radius Selection Dropdown */}
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

// PropTypes for type checking and documentation
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
