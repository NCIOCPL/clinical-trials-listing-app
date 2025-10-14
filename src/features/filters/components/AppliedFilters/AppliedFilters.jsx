/**
 * @file This file defines the AppliedFilters component, which displays the currently
 * active filters selected by the user. It allows users to see their selections
 * at a glance and remove individual filters or clear all filters. It interacts
 * with the FilterContext to get the applied filters and dispatch actions for removal.
 */
import React from 'react';
import { useFilters } from '../../context/FilterContext/FilterContext';
import './AppliedFilters.scss';
import { PAGE_FILTER_CONFIGS } from '../../config/pageFilterConfigs';
import PropTypes from 'prop-types';
import { useMainTypeSearch } from '../../../../hooks/ctsApiSupport/useMainTypeSearch';
import { useSubTypeSearch } from '../../../../hooks/ctsApiSupport/useSubTypeSearch';
import { useStageSearch } from '../../../../hooks/ctsApiSupport/useStageSearch';
//import img from '@nciocpl/ncids-css/uswds-img/sprite.svg';

/**
 * Renders a section displaying the currently applied filters as tags.
 * Each tag shows the filter type and value, with a button to remove it.
 * Also includes a "Clear All" button to remove all active filters.
 * Returns null if no filters are currently applied.
 *
 * @returns {JSX.Element|null} The rendered AppliedFilters component or null.
 */
const AppliedFilters = ({ pageType = 'Disease' }) => {
	const { state, dispatch } = useFilters();
	const filters = state.appliedFilters; // Get the list of applied filters from context

	// Get the API data for filter options to display proper names
	const { options: maintypeOptions } = useMainTypeSearch();

	// Get maintype value to use for subtype and stage searches
	const maintypeValue = filters.maintype?.[0];
	const { options: subtypeOptions } = useSubTypeSearch(maintypeValue);
	const { options: stageOptions } = useStageSearch(maintypeValue);

	// console.log('[AppliedFilters] pageType:', pageType, 'appliedFilters:', filters);

	// Helper function to check if there are any meaningful applied filters
	const hasAppliedFilters = (filters) => {
		if (!filters) return false;

		for (const [key, value] of Object.entries(filters)) {
			if (key === 'location') {
				// For location, check if zipCode has a value
				if (value && value.zipCode && value.zipCode.trim() !== '') {
					return true;
				}
			} else if (Array.isArray(value)) {
				// For arrays, check if they have items
				if (value.length > 0) {
					return true;
				}
			} else if (typeof value === 'string') {
				// For strings, check if they're not empty
				if (value.trim() !== '') {
					return true;
				}
			} else if (value != null && value !== '') {
				// For other types, check if they have a truthy value
				return true;
			}
		}
		return false;
	};

	// If there are no applied filters, don't render anything
	if (!hasAppliedFilters(filters)) {
		// console.log('[AppliedFilters] No meaningful filters, returning null');
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
		// dispatch({ type: 'APPLY_FILTERS' });
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
			case 'maintype': {
				// Get display name from API data instead of DOM
				const conceptId = Array.isArray(filter.values) ? filter.values[0] : filter.values;
				const option = maintypeOptions.find((opt) => opt.value === conceptId || opt.id === conceptId);
				const displayText = option?.label;

				// Only show if we have proper display text from API
				if (!displayText) {
					return null;
				}
				return {
					label: [displayText],
					displayType: 'Primary Cancer Type',
				};
			}
			case 'subtype': {
				// Get display name from API data instead of DOM
				const conceptId = Array.isArray(filter.values) ? filter.values[0] : filter.values;
				const option = subtypeOptions.find((opt) => opt.value === conceptId || opt.id === conceptId);
				const displayText = option?.label;

				// Only show if we have proper display text from API
				if (!displayText) {
					return null;
				}
				return {
					label: [displayText],
					displayType: 'Subtype',
				};
			}
			case 'stage': {
				// Get display name from API data instead of DOM
				const conceptId = Array.isArray(filter.values) ? filter.values[0] : filter.values;
				const option = stageOptions.find((opt) => opt.value === conceptId || opt.id === conceptId);
				const displayText = option?.label;

				// Only show if we have proper display text from API
				if (!displayText) {
					return null;
				}
				return {
					label: [displayText],
					displayType: 'Stage',
				};
			}
			case 'drugIntervention':
				// Show loading state while drug name is being fetched
				if (Array.isArray(filter.values) && filter.values.length > 0) {
					const drug = filter.values[0];
					if (drug && typeof drug === 'object' && drug.name) {
						// Full drug object with name
						return {
							label: [drug.name],
							displayType: 'Drug / Drug Family',
						};
					} else if (typeof drug === 'string') {
						// Concept code - show "Loading..." while API fetches the name
						return {
							label: ['Loading...'],
							displayType: 'Drug / Drug Family',
						};
					}
				}
				// Don't show if no data at all
				return null;
			case 'age':
				// Format age label
				return {
					label: [`Age: ${filter.values}`], // Age value is singular
					displayType: 'Age',
				};
			case 'location':
				// Format location label using zip and radius
				return {
					label: [`within ${filter.values.radius} miles of ${filter.values.zipCode}`],
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

	// const filtersArray = Object.entries(filters).map(([type, values]) => ({
	// 	type,
	// 	values
	//   }));

	// Displays filter tags in the correct order
	// First get the configured order for this page type
	const orderedFilterTypes = PAGE_FILTER_CONFIGS[pageType]?.order || [];

	// Get all filters that are currently applied
	const appliedFilterTypes = Object.keys(filters).filter((type) => filters[type] !== undefined && filters[type] !== null);

	// Start with ordered filters, then add any that aren't in the order list
	const allFilterTypes = [...orderedFilterTypes.filter((type) => appliedFilterTypes.includes(type)), ...appliedFilterTypes.filter((type) => !orderedFilterTypes.includes(type))];

	const filtersArray = allFilterTypes.map((type) => ({
		type,
		values: filters[type],
	}));

	return (
		<div className="applied-filters">
			<div className="applied-filters__header">
				<h3>Applied Filters:</h3>
			</div>
			<div className="applied-filters__content">
				{/* Map through each applied filter group */}
				{filtersArray.map((filter) => {
					let emptyFilter = filter.values == null || filter.values == null || filter.values.length === 0 || (filter.type == 'location' && (filter.values.radius == null || filter.values.radius == undefined));
					if (emptyFilter) {
						return null;
					}

					const formattedFilter = formatFilterLabel(filter);
					// console.log('[AppliedFilters] formatFilterLabel returned:', formattedFilter);
					// Skip if formatFilterLabel returns null (e.g., incomplete drugIntervention data)
					if (!formattedFilter) {
						// console.log('[AppliedFilters] formattedFilter is null, skipping');
						return null;
					}

					const { label } = formattedFilter;
					// Map through each value within the filter group (most have one, some like subtype can have multiple)
					return label.map((value, index) => (
						<div key={`${filter.type}-${value}-${index}`} className="applied-filters__tag usa-tag">
							<span className="applied-filters__tag-value">{value}</span>
							{/* Button to remove this specific filter value */}
							<button onClick={() => handleRemoveFilter(filter.type, filter.values[index])} className="applied-filters__tag-remove" aria-label={`Remove ${value} filter`}>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14 14" fill="none">
									<path fillRule="evenodd" clipRule="evenodd" d="M13.4167 1.87575L12.1242 0.583252L7.00001 5.70742L1.87584 0.583252L0.583344 1.87575L5.70751 6.99992L0.583344 12.1241L1.87584 13.4166L7.00001 8.29242L12.1242 13.4166L13.4167 12.1241L8.29251 6.99992L13.4167 1.87575Z" fill="white" />
								</svg>
							</button>
						</div>
					));
				})}
			</div>
		</div>
	);
};

// Define PropTypes for type checking and documentation
AppliedFilters.propTypes = {
	/** The type of page, determining which filters are shown (e.g., 'Disease', 'Intervention'). Defaults to 'Disease'. */
	pageType: PropTypes.string,
};

export default AppliedFilters;
