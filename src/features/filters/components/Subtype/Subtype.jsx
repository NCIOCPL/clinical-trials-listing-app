import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './Subtype.scss';

import { useTracking } from 'react-tracking';
import { useSubTypeSearch } from '../../../../hooks/ctsApiSupport/useSubTypeSearch';
import ComboBox from '../ComboBox/ComboBox';

const Subtype = ({ disabled = false, onFocus }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;
	const tracking = useTracking();

	// Get the selected maintype code from filters
	const maintypeCode = filters.maintype && filters.maintype.length > 0 ? filters.maintype[0] : null;

	// Use our custom React Query hook with the maintype code
	const { options, isLoading } = useSubTypeSearch(maintypeCode);
	console.log(options);
	// Ensure each option has required properties for the ComboBox
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
	const isSubtypeDisabled = disabled || isLoading || !maintypeCode;

	return (
		<FilterGroup title={FILTER_CONFIG.subtype.title} helpText={FILTER_CONFIG.subtype.helpText}>
			<label id="subtype-filter-label" className="usa-label usa-sr-only" htmlFor="subtype-filter">
				Subtype
			</label>
			<ComboBox id="subtype-filter" name="subtype-filter" options={formattedOptions} defaultValue={value.length > 0 ? value[0] : ''} disabled={isSubtypeDisabled} onChange={handleChange} onFocus={onFocus} noResults="No subtypes found" />
		</FilterGroup>
	);
};

Subtype.propTypes = {
	disabled: PropTypes.bool,
	onFocus: PropTypes.func,
};

export default Subtype;
