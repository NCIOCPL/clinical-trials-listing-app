/**
 * @file This file defines the AgeFilter component, which provides a numeric input
 * field for users to filter clinical trials based on participant age. It integrates
 * with the FilterContext to manage the age filter state.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';

/**
 * Renders a numeric input field for filtering by age.
 * Handles input validation (numeric, range, leading zeros) and updates
 * the global filter state via FilterContext.
 *
 * @param {object} props - The component props.
 * @param {string|number} props.value - The current value of the age filter (unused directly, reads from context).
 * @param {Function} props.onChange - Callback function when the value changes (unused directly, uses context dispatch).
 * @param {Function} props.onFocus - Callback function when the input gains focus.
 * @param {boolean} props.disabled - Whether the input field should be disabled.
 * @returns {JSX.Element} The rendered AgeFilter component.
 */
const AgeFilter = ({ onFocus, disabled }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;

	/**
	 * Handles changes to the age input field.
	 * Validates the input value (must be numeric, within range, no leading zeros)
	 * and dispatches an action to update the 'age' filter in the FilterContext.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
	 */
	const handleAgeChange = (e) => {
		// Get the raw input value
		const inputValue = e.target.value;

		// If the input is empty, clear the filter by dispatching an empty value
		if (inputValue === '') {
			dispatch({
				type: 'SET_FILTER',
				payload: {
					filterType: 'age',
					value: '',
				},
			});
			return; // Exit early
		}

		// Attempt to parse the input as an integer
		const numericValue = parseInt(inputValue, 10);

		// If parsing fails (input is not a number), do nothing
		if (isNaN(numericValue)) {
			return; // Exit early for non-numeric input
		}

		// Prevent inputs with leading zeros (e.g., "01", "007") unless it's just "0"
		const hasLeadingZeros = inputValue.length > 1 && inputValue[0] === '0';
		if (hasLeadingZeros) {
			return; // Exit early for leading zeros
		}

		// Check if the numeric value is outside the allowed range defined in config
		if (numericValue < FILTER_CONFIG.age.min || numericValue > FILTER_CONFIG.age.max) {
			return; // Exit early if value is out of range
		}

		// Final check: Ensure the original input string matches the parsed number string.
		// This prevents partial inputs like "1." or inputs with non-numeric characters
		// that might somehow pass initial checks. Only dispatch if the input is a clean number.
		if (numericValue.toString() === inputValue) {
			dispatch({
				type: 'SET_FILTER',
				payload: {
					filterType: 'age',
					value: numericValue, // Dispatch the validated numeric value
				},
			});
		}
	};

	return (
		<FilterGroup title="Age">
			<input
				id="age-filter-input"
				name="age-filter"
				aria-label="Enter participant age"
				type="number" // Use type="number" for better mobile keyboards and semantics
				className="usa-input form-control"
				value={filters.age || ''} // Display the age from context, default to empty string
				onChange={handleAgeChange} // Handle changes with validation logic
				onFocus={onFocus} // Pass through the onFocus handler
				min={FILTER_CONFIG.age.min} // Set min attribute from config
				max={FILTER_CONFIG.age.max} // Set max attribute from config
				pattern="[0-9]*" // Allow only digits (helps with validation)
				inputMode="numeric" // Hint for numeric keyboard on mobile devices
				disabled={disabled} // Set disabled state based on prop
			/>
		</FilterGroup>
	);
};

AgeFilter.propTypes = {
	onFocus: PropTypes.func,
	disabled: PropTypes.bool,
};

export default AgeFilter;
