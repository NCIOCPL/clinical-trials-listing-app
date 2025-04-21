/**
 * @file This file defines the CheckboxGroup component, which renders a group of checkboxes
 * based on configuration defined in `FILTER_CONFIG`. It's used for filters where options
 * are predefined (e.g., Trial Phase, Trial Type). It interacts with parent components
 * via `selectedValues` and `onChange` props to manage the filter state.
 */
import React from 'react';
import PropTypes from 'prop-types';
// Note: Tracking functionality is currently commented out.
// import { useTracking } from 'react-tracking';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './CheckboxGroup.scss';

/**
 * Renders a group of checkboxes based on options derived from FILTER_CONFIG using the 'name' prop.
 * Manages selection state via props.
 *
 * @param {object} props - The component props.
 * @param {Array<string>} [props.selectedValues=[]] - An array of the currently selected option values. Defaults to an empty array.
 * @param {Function} props.onChange - Callback function invoked when the selection changes, passing the new array of selected values.
 * @param {string} props.name - The key corresponding to the filter configuration in FILTER_CONFIG (e.g., 'trialType', 'phase').
 * @param {boolean} [props.disabled=false] - Whether the checkboxes should be disabled.
 * @returns {JSX.Element} The rendered CheckboxGroup component.
 */
const CheckboxGroup = ({ selectedValues = [], onChange, name, disabled = false }) => {
	// const tracking = useTracking(); // Tracking hook initialization (commented out)

	// Retrieve the specific configuration for this filter group based on the 'name' prop
	const filterConfig = FILTER_CONFIG[name];

	/**
	 * Handles the change event for an individual checkbox within the group.
	 * Updates the list of selected values based on the checkbox's new state.
	 * Calls the `onChange` prop with the updated list.
	 *
	 * @param {string} value - The value of the checkbox that changed.
	 * @param {boolean} checked - The new checked state of the checkbox.
	 */
	const handleChange = (value, checked) => {
		// Determine the new array of selected values
		const newValues = checked
			? [...selectedValues, value] // Add value if checked
			: selectedValues.filter((v) => v !== value); // Remove value if unchecked

		// Call the parent component's onChange handler
		onChange(newValues);

		// Commented-out tracking logic:
		// tracking.trackEvent({
		// 	type: 'Other',
		// 	event: 'TrialListingApp:Filter:Change',
		// 	linkName: 'TrialListingApp:Filter:Change',
		// 	filterType: name,
		// 	filterValue: value,
		// 	action: checked ? 'select' : 'deselect',
		// });
	};

	// Render nothing if filterConfig is somehow not found (safety check)
	if (!filterConfig) {
		// eslint-disable-next-line no-console
		console.error(`CheckboxGroup: No filter configuration found for name "${name}"`);
		return null;
	}

	return (
		<div className="checkbox-group" role="group" aria-label={filterConfig.title}>
			{/* Map over the options defined in the filter configuration */}
			{filterConfig.options.map((option) => (
				<div className="usa-checkbox checkbox-group__item" key={option.id || option.value}>
					{' '}
					{/* Use id or value as key */}
					<input
						className="usa-checkbox__input checkbox-group__input"
						id={option.value} // Use value for id and htmlFor
						type="checkbox"
						value={option.value}
						// Check if the current option's value is in the selectedValues array
						checked={selectedValues.includes(option.value)}
						// Call handleChange on change
						onChange={(e) => handleChange(option.value, e.target.checked)}
						aria-label={option.label} // Use label for accessibility
						disabled={disabled} // Set disabled state
					/>
					<label className="usa-checkbox__label checkbox-group__label" htmlFor={option.value}>
						{option.label} {/* Display the option label */}
					</label>
				</div>
			))}
		</div>
	);
};

// Define PropTypes for type checking and documentation
CheckboxGroup.propTypes = {
	/** Array of strings representing the values of the currently selected checkboxes. */
	selectedValues: PropTypes.arrayOf(PropTypes.string),
	/** Callback function triggered when the selection changes. Receives the new array of selected values. */
	onChange: PropTypes.func.isRequired,
	/** The name of the filter, used as a key to look up configuration in FILTER_CONFIG. */
	name: PropTypes.oneOf(Object.keys(FILTER_CONFIG)).isRequired,
	/** Optional flag to disable all checkboxes in the group. */
	disabled: PropTypes.bool,
};

export default CheckboxGroup;
