import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import { useMainTypeSearch } from '../../../../hooks/ctsApiSupport/useMainTypeSearch';
import ComboBox from '../ComboBox/ComboBox';
import './MainTypeFilter.scss';

const MainTypeFilter = ({ onFocus, disabled = false }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;
	const isHandlingChangeRef = useRef(false);
	const isInitializedRef = useRef(false);

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

	// Ensure we have a proper default value for the ComboBox
	const defaultValue = value.length > 0 ? value[0] : '';

	// Mark as initialized once we have options loaded
	React.useEffect(() => {
		if (formattedOptions.length > 0 && !isInitializedRef.current) {
			// console.log('MainTypeFilter - Marking as initialized with options');
			isInitializedRef.current = true;
		}
	}, [formattedOptions.length]);

	// // Debug logging
	// console.log('MainTypeFilter - render - filters:', filters);
	// console.log('MainTypeFilter - render - value:', value);
	// console.log('MainTypeFilter - render - defaultValue for ComboBox:', defaultValue);
	// console.log('MainTypeFilter - render - options length:', formattedOptions.length);
	// console.log('MainTypeFilter - render - isLoading:', isLoading);
	// console.log('MainTypeFilter - render - error:', error);
	// console.log('MainTypeFilter - render - disabled:', disabled);
	// console.log('MainTypeFilter - render - isInitialized:', isInitializedRef.current);

	const handleChange = (selectedValue) => {
		// console.log('MainTypeFilter - handleChange called with:', selectedValue, 'isInitialized:', isInitializedRef.current);

		// Prevent recursive onChange calls
		if (isHandlingChangeRef.current) {
			// console.log('MainTypeFilter - Ignoring recursive onChange call');
			return;
		}

		// Guard against ComboBox calling onChange with undefined during initialization
		// Only process actual user selections (string values) or explicit clears (empty string)
		if (selectedValue === undefined) {
			// console.log('MainTypeFilter - Ignoring undefined value from ComboBox initialization');
			return;
		}

		// Ignore empty string calls during initialization
		if (!isInitializedRef.current && selectedValue === '') {
			// console.log('MainTypeFilter - Ignoring empty string during initialization');
			return;
		}

		// Check if this is actually a change from the current value
		const currentValue = value.length > 0 ? value[0] : '';
		if (selectedValue === currentValue) {
			// console.log('MainTypeFilter - Ignoring onChange with same value as current:', selectedValue);
			return;
		}

		// Set flag to prevent recursive calls
		isHandlingChangeRef.current = true;

		const newValue = selectedValue ? [selectedValue] : [];
		console.log('MainTypeFilter - newValue:', newValue);

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

		// Note: Individual filter change tracking removed - FilterApply event covers all changes

		// Reset flag after a short delay to allow state updates to complete
		setTimeout(() => {
			isHandlingChangeRef.current = false;
		}, 100);
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
					<ComboBox id="maintype-filter" name="maintype-filter" options={formattedOptions} defaultValue={defaultValue} disabled={disabled || isLoading} onChange={handleChange} noResults="No cancer types found" />
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
