/* eslint-disable */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import { useTracking } from 'react-tracking';
import { useMainTypeSearch } from '../../../../hooks/useMainTypeSearch';
// Import the NCIDS ComboBox component auto-initializer
import '@nciocpl/ncids-js/usa-combo-box/auto-init';

const MainTypeFilter = ({ onFocus, disabled = false }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;
	const tracking = useTracking();

	// Use our custom React Query hook
	const { options, isLoading, error } = useMainTypeSearch();

	// Ensure each option has required properties for the ComboBox
	const formattedOptions = options.map(option => ({
		value: option.value || option.id || '',
		label: option.label || '',
		count: option.count || 0
	}));

	// Initialize value as empty array if not already set
	const value = Array.isArray(filters.maintype) ? filters.maintype : [];

	// Reference to the combo box container
	const comboBoxRef = useRef(null);

	// Initialize USWDS combobox when component mounts
	useEffect(() => {
		// NCIDS/USWDS JS should automatically initialize based on the classes
		// The import should ensure the auto-init runs

		// ComponentDidMount equivalent - nothing more needed as the auto-init
		// should take care of enhancing all elements with class usa-combo-box
	}, []);

	const handleChange = (event) => {
		const selectedValue = event.target.value;
		const newValue = selectedValue ? [selectedValue] : [];

		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'maintype',
				value: newValue,
			},
		});

		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Change',
			filterType: 'maintype',
			filterValue: selectedValue,
			action: 'select',
		});
	};

	return (
		<FilterGroup title="Primary Cancer Type/Condition">
			{error ? (
				<div className="error-message">
					Unable to load cancer types. Please try again later.
				</div>
			) : (
				<div className="filter-content">
					<label className="usa-label" htmlFor="maintype-filter">Primary Cancer Type</label>
					{FILTER_CONFIG.maintype.helpText && (
						<div className="usa-hint">{FILTER_CONFIG.maintype.helpText}</div>
					)}
					<div className="usa-combo-box" ref={comboBoxRef}>
						<select
							className="usa-select"
							name="maintype-filter"
							id="maintype-filter"
							onChange={handleChange}
							value={value.length > 0 ? value[0] : ''}
							disabled={disabled || isLoading}
						>
							<option value="">{FILTER_CONFIG.maintype.placeholder || 'Select a cancer type'}</option>
							{formattedOptions.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>
			)}
		</FilterGroup>
	);
};

MainTypeFilter.propTypes = {
	onFocus: PropTypes.func,
	disabled: PropTypes.bool,
};

export default MainTypeFilter;
