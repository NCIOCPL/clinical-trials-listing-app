import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import { useTracking } from 'react-tracking';
import { useMainTypeSearch } from '../../../../hooks/ctsApiSupport/useMainTypeSearch';
import ComboBox from '../ComboBox/ComboBox';
import './MainTypeFilter.scss';

const MainTypeFilter = ({ onFocus, disabled = false }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;
	const tracking = useTracking();

	// Use our custom React Query hook
	const { options, isLoading, error } = useMainTypeSearch();

	// Ensure each option has required properties for the ComboBox
	const formattedOptions = useMemo(() => {
		return options.map((option) => ({
			value: option.value || option.id || '',
			label: option.label || '',
		}));
	}, [options]);

	// Initialize value as empty array if not already set
	const value = Array.isArray(filters.maintype) ? filters.maintype : [];

	const handleChange = (selectedValue) => {
		const newValue = selectedValue ? [selectedValue] : [];

		// Dispatch the action to update the filter state
		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'maintype',
				value: newValue,
			},
		});

		// Manually trigger a focus event to ensure the tracker fires
		if (onFocus) onFocus();

		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Change',
			filterType: 'maintype',
			filterValue: selectedValue || '',
			action: selectedValue ? 'select' : 'clear',
		});
	};

	return (
		<FilterGroup title="Primary Cancer Type/Condition" helpText={FILTER_CONFIG.maintype.helpText}>
			{error ? (
				<div className="error-message">Unable to load cancer types. Please try again later.</div>
			) : (
				<div className="filter-content">
					<label className="usa-label usa-sr-only" htmlFor="maintype-filter">
						Select a cancer type
					</label>
					<ComboBox id="maintype-filter" name="maintype-filter" options={formattedOptions} defaultValue={value.length > 0 ? value[0] : ''} disabled={disabled || isLoading} onChange={handleChange} noResults="No cancer types found" />
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
