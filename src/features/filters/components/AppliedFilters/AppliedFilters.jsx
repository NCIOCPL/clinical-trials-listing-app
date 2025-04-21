/**
 * @file This file defines the AppliedFilters component, which displays the currently
 * active filters selected by the user. It allows users to see their selections
 * at a glance and remove individual filters or clear all filters. It interacts
 * with the FilterContext to get the applied filters and dispatch actions for removal.
 */
import React from 'react';
import { useFilters } from '../../context/FilterContext/FilterContext';
import './AppliedFilters.scss';

/**
 * Renders a section displaying the currently applied filters as tags.
 * Each tag shows the filter type and value, with a button to remove it.
 * Also includes a "Clear All" button to remove all active filters.
 * Returns null if no filters are currently applied.
 *
 * @returns {JSX.Element|null} The rendered AppliedFilters component or null.
 */
const AppliedFilters = () => {
	const { state, dispatch } = useFilters();
	const { appliedFilters } = state; // Get the list of applied filters from context

	// If there are no applied filters, don't render anything
	if (appliedFilters.length === 0) {
		return null;
	}

	/**
	 * Handles the removal of a single filter tag.
	 * Dispatches the 'REMOVE_FILTER' action with the specific filter type and value,
	 * and then dispatches 'APPLY_FILTERS' to update the results based on the remaining filters.
	 *
	 * @param {string} filterType - The type of the filter to remove (e.g., 'age', 'subtype').
	 * @param {string|number|object} value - The specific value of the filter to remove.
	 */
	const handleRemoveFilter = (filterType, value) => {
		dispatch({
			type: 'REMOVE_FILTER',
			payload: { filterType, value },
		});
		// Re-apply filters after removing one to update the list/results
		dispatch({ type: 'APPLY_FILTERS' });
	};

	/**
	 * Handles clearing all applied filters.
	 * Dispatches the 'CLEAR_FILTERS' action to reset the filter state.
	 */
	const handleClearAll = () => {
		dispatch({ type: 'CLEAR_FILTERS' });
	};

	/**
	 * Formats the filter data into a user-friendly label and display type for the tag.
	 * Handles specific formatting for different filter types like 'subtype', 'stage', 'age', 'location'.
	 *
	 * @param {object} filter - The filter object from the appliedFilters array.
	 * @param {string} filter.type - The type of the filter.
	 * @param {Array<string|number|object>|string|number|object} filter.values - The value(s) of the filter.
	 * @returns {{label: Array<string>, displayType: string}} An object containing the formatted label array and display type.
	 */
	const formatFilterLabel = (filter) => {
		switch (filter.type) {
			case 'subtype':
				// Format subtype labels (replace underscores, capitalize words)
				return {
					label: filter.values.map((value) => value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())),
					displayType: 'Subtype',
				};
			case 'stage':
				// Format stage labels (e.g., "Stage IV")
				return {
					label: filter.values.map((value) => `Stage ${value.split('_')[1].toUpperCase()}`),
					displayType: 'Stage',
				};
			case 'drugIntervention':
				// Use values directly for drug/intervention
				return {
					label: filter.values,
					displayType: 'Drug/Intervention',
				};
			case 'age':
				// Format age label
				return {
					label: [`Age: ${filter.values}`], // Age value is singular
					displayType: 'Age',
				};
			case 'location':
				// Format location label using zip and radius
				return {
					label: [`Within ${filter.values.radius} miles of ${filter.values.zipCode}`],
					displayType: 'Location',
				};
			default:
				// Default formatting for other types
				return {
					label: filter.values,
					displayType: filter.type,
				};
		}
	};

	return (
		<div className="applied-filters">
			<div className="applied-filters__header">
				<h3>Applied Filters</h3>
				<button className="applied-filters__clear-all" onClick={handleClearAll}>
					Clear All
				</button>
			</div>
			<div className="applied-filters__content">
				{/* Map through each applied filter group */}
				{appliedFilters.map((filter) => {
					const { label, displayType } = formatFilterLabel(filter);
					// Map through each value within the filter group (most have one, some like subtype can have multiple)
					return label.map((value, index) => (
						<div key={`${filter.type}-${value}-${index}`} className="applied-filters__tag">
							<span className="applied-filters__tag-type">{displayType}:</span>
							<span className="applied-filters__tag-value">{value}</span>
							{/* Button to remove this specific filter value */}
							<button onClick={() => handleRemoveFilter(filter.type, filter.values[index])} className="applied-filters__tag-remove" aria-label={`Remove ${value} filter`}></button>
						</div>
					));
				})}
			</div>
		</div>
	);
};

export default AppliedFilters;
