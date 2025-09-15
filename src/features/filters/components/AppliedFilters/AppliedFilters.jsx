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
	const { filters } = state; // Get the list of applied filters from context

	// If there are no applied filters, don't render anything
	if (!filters || Object.keys(filters).length === 0) {
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
	 * Handles clearing all applied filters.
	 * Dispatches the 'CLEAR_FILTERS' action to reset the filter state.
	 */
	const handleClearAll = () => {
		dispatch({ type: 'CLEAR_FILTERS' });
	};

	let maintypeSelectedText = document.querySelector('#maintype-filter--list .usa-combo-box__list-option--selected');
	// let maintypeText = maintypeSelectedText?.innerText;
	let subtypeSelectedText = document.querySelector('#subtype-filter--list .usa-combo-box__list-option--selected');
	// let subtypeText = subtypeSelectedText?.innerText;
	let stageSelectedText = document.querySelector('#stage-filter--list .usa-combo-box__list-option--selected');
	//let stageText = subtypeSelectedText?.innerText;

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
			case 'maintype':
				return {
					label: [maintypeSelectedText?.innerText],
					displayType: 'Maintype',
				};
			case 'subtype':
				// Format subtype labels (replace underscores, capitalize words)
				return {
					label: [subtypeSelectedText?.innerText],
					displayType: 'Subtype',
				};
			case 'stage':
				// Format stage labels (e.g., "Stage IV")
				return {
					label: [stageSelectedText?.innerText],
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

	// const filtersArray = Object.entries(filters).map(([type, values]) => ({
	// 	type,
	// 	values
	//   }));

	// Displays filter tags in the correct order
	const orderedFilterTypes = PAGE_FILTER_CONFIGS[pageType]?.order || [];

	const filtersArray = orderedFilterTypes
		.filter((type) => filters[type] !== undefined && filters[type] !== null)
		.map((type) => ({
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

					const { label } = formatFilterLabel(filter);
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
			<div className="ctla-sidebar__actions">
				<button className="applied-filters__clear-all usa-button ctla-sidebar__button--clear" onClick={handleClearAll}>
					Clear Filters
				</button>
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
