/**
 * @file This file defines the CheckboxFilter component, a reusable component
 * for rendering a group of checkboxes based on provided options. It manages
 * the selection state through the `selectedValues` prop and `onChange` callback.
 */
import React from 'react';
import PropTypes from 'prop-types';
// Note: Tracking functionality is currently commented out.
// import { useTracking } from 'react-tracking';
import './CheckboxFilter.scss';

/**
 * Renders a group of checkboxes based on the provided options.
 * Allows users to select multiple options.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.options - An array of option objects, each with 'value' and 'label'.
 * @param {Array<string>} props.selectedValues - An array of the currently selected option values.
 * @param {Function} props.onChange - Callback function invoked when the selection changes, passing the new array of selected values.
 * @param {boolean} [props.disabled=false] - Whether the checkboxes should be disabled.
 * @returns {JSX.Element} The rendered CheckboxFilter component.
 */
const CheckboxFilter = ({ options, selectedValues, onChange, disabled = false }) => {
	// const tracking = useTracking(); // Tracking hook initialization (commented out)

	/**
	 * Handles the change event for an individual checkbox.
	 * Updates the list of selected values based on whether the checkbox is checked or unchecked.
	 * Calls the `onChange` prop with the new list of selected values.
	 *
	 * @param {string} value - The value of the checkbox that changed.
	 * @param {boolean} checked - The new checked state of the checkbox.
	 */
	const handleChange = (value, checked) => {
		// Determine the new array of selected values
		const newValues = checked
			? [...selectedValues, value] // Add value if checked
			: selectedValues.filter((v) => v !== value); // Remove value if unchecked

		// Call the parent component's onChange handler with the updated values
		onChange(newValues);

		// Commented-out tracking logic:
		// tracking.trackEvent({
		// 	type: 'Other',
		// 	event: 'TrialListingApp:Filter:Checkbox',
		// 	linkName: 'TrialListingApp:Filter:Checkbox',
		// 	filterName: name, // 'name' prop is not passed to this component currently
		// 	value,
		// 	action: checked ? 'select' : 'deselect',
		// });
	};

	return (
		<div className="checkbox-filter" role="group">
			{/* Map over the options array to render each checkbox */}
			{options.map((option) => (
				<label key={option.value} className="checkbox-filter__item">
					<input
						type="checkbox"
						className="checkbox-filter__input"
						// Check if the current option's value is in the selectedValues array
						checked={selectedValues.includes(option.value)}
						// Call handleChange when the checkbox state changes
						onChange={(e) => handleChange(option.value, e.target.checked)}
						disabled={disabled} // Set disabled state based on prop
						value={option.value} // Set the value attribute
						aria-label={option.label} // Use label for accessibility
					/>
					{/* Display the label text */}
					<span className="checkbox-filter__label">{option.label}</span>
				</label>
			))}
		</div>
	);
};

// Define PropTypes for type checking and documentation
CheckboxFilter.propTypes = {
	/** Array of options to display as checkboxes. Each object needs 'value' and 'label'. */
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	/** Array of strings representing the values of the currently selected checkboxes. */
	selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
	/** Callback function triggered when the selection changes. Receives the new array of selected values. */
	onChange: PropTypes.func.isRequired,
	/** Optional flag to disable all checkboxes in the group. */
	disabled: PropTypes.bool,
	// 'name' prop removed as it's not currently used.
	// name: PropTypes.string.isRequired,
};

export default CheckboxFilter;
