import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './StageFilter.scss';

import { useTracking } from 'react-tracking';
import ComboBox from '../ComboBox/ComboBox';

import { useSubTypeSearch } from '../../../../hooks/ctsApiSupport/useSubTypeSearch';

const StageFilter = ({ disabled = false, onFocus }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;
	const tracking = useTracking();

	// Get the selected maintype code from filters
	const maintypeCode = filters.maintype && filters.maintype.length > 0 ? filters.maintype[0] : null;

	const { options, isLoading } = useSubTypeSearch(maintypeCode);

	const formattedOptions = useMemo(() => {
		return options.map((option) => ({
			value: option.value || option.id || '',
			label: option.label || '',
		}));
	}, [options]);

	// Initialize value as empty array if not already set
	const value = Array.isArray(filters.subtype) ? filters.subtype : [];

	const handleChange = (selectedValue) => {
		const newValue = selectedValue ? [selectedValue] : [];

		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'subtype',
				value: newValue,
			},
		});

		// Do we want this on a clear? Maybe instead: (onFocus && selectedValue) onFocus();
		if (onFocus) onFocus();

		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Change',
			filterType: 'subtype',
			filterValue: selectedValue || '',
			action: selectedValue ? 'select' : 'clear',
		});
	};

	// Determine if the component should be disabled
	const isStageDisabled = disabled || isLoading || !maintypeCode;

	return (
		<FilterGroup title={FILTER_CONFIG.stage.title}>
			<label id="stage-filter-label" className="usa-label usa-sr-only" htmlFor="stage-filter">
				Stage
			</label>
			<ComboBox id="stage-filter" name="stage-filter" options={formattedOptions} defaultValue={value.length > 0 ? value[0] : ''} disabled={isStageDisabled} onChange={handleChange} onFocus={onFocus} noResults="No stages found" />
		</FilterGroup>
	);
};

StageFilter.propTypes = {
	disabled: PropTypes.bool,
	onFocus: PropTypes.func,
};
export default StageFilter;
