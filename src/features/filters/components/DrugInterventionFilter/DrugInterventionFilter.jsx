import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './DrugInterventionFilter.scss';

import { useTracking } from 'react-tracking';
//import { useSubTypeSearch } from '../../../../hooks/ctsApiSupport/useSubTypeSearch';
import ComboBox from '../ComboBox/ComboBox';
import { useMainTypeSearch } from '../../../../hooks/ctsApiSupport/useMainTypeSearch';

const DrugInterventionFilter = ({ onFocus, disabled = false }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;
	const tracking = useTracking();

	// Get the selected drug/intervention code from filters
	//const drugInterventionCode = filters.drugIntervention && filters.drugIntervention.length > 0 ? filters.drugIntervention[0] : null;

	// Use our custom React Query hook with the maintype code
	const { options, isLoading, error } = useMainTypeSearch();

	// Ensure each option has required properties for the ComboBox
	const formattedOptions = useMemo(() => {
		return options.map((option) => ({
			value: option.value || option.id || '',
			label: option.label || '',
		}));
	}, [options]);

	// Initialize value as empty array if not already set
	const value = Array.isArray(filters.drugIntervention) ? filters.drugIntervention : [];

	const handleChange = (selectedValue) => {
		const newValue = selectedValue ? [selectedValue] : [];

		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'drugIntervention',
				value: newValue,
			},
		});

		// Do we want this on a clear? Maybe instead: (onFocus && selectedValue) onFocus();
		if (onFocus && selectedValue) onFocus();

		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Change',
			filterType: 'drugIntervention',
			filterValue: selectedValue || '',
			action: selectedValue ? 'select' : 'clear',
		});
	};

	return (
		<FilterGroup title={FILTER_CONFIG.drugIntervention.title}>
			{error ? (
				<div>Unable to load drug/drug family types. Please try again later.</div>
			) : (
				<div className="filter-content">
					<label id="drugIntervention-filter-label" className="usa-label usa-sr-only" htmlFor="drugIntervention-filter">
						Drug/Drug Family
					</label>
					<ComboBox id="drugIntervention-filter" name="drugIntervention-filter" options={formattedOptions} defaultValue={value.length > 0 ? value[0] : ''} disabled={disabled || isLoading} onChange={handleChange} onFocus={onFocus} />
				</div>
			)}
		</FilterGroup>
	);
};

DrugInterventionFilter.propTypes = {
	disabled: PropTypes.bool,
	onFocus: PropTypes.func,
};

export default DrugInterventionFilter;
