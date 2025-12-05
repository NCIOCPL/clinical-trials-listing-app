import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFilters, FilterActionTypes } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import { useMainTypeSearch } from '../../../../hooks/ctsApiSupport/useMainTypeSearch';
import ComboBox from '../ComboBox/ComboBox';
import { useNavigate, useLocation } from 'react-router-dom';
import { URL_PARAM_MAPPING } from '../../constants/urlParams';
import './MainTypeFilter.scss';

const MainTypeFilter = ({ onFocus, disabled = false, dispatch: dispatchFromProps }) => {
	const { state, dispatch: dispatchFromContext } = useFilters();
	// Use dispatch from props if provided (for invalid query handling), otherwise use context dispatch
	const dispatch = dispatchFromProps || dispatchFromContext;
	const { filters } = state;
	const isHandlingChangeRef = useRef(false);
	const isInitializedRef = useRef(false);
	const hasValidatedUrlParamRef = useRef(false);
	const navigate = useNavigate();
	const location = useLocation();

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

	// Detect if we need to load maintype data for concept codes from URL
	const conceptCodeFromUrl = React.useMemo(() => {
		if (Array.isArray(filters.maintype) && filters.maintype.length > 0) {
			return filters.maintype[0];
		}
		return null;
	}, [filters.maintype]);

	// Effect to update filter when maintype data loads from URL
	// Note: This effect only sets isInvalidQuery to true when invalid params are detected.
	// It does NOT set isInvalidQuery to false - that is handled by FilterContext
	// to avoid race conditions where one valid component clears the error set by another invalid component.
	React.useEffect(() => {
		const matchingMaintype = formattedOptions.find((option) => option.value && option.value.includes(conceptCodeFromUrl));
		if (conceptCodeFromUrl) {
			if (formattedOptions.length > 0) {
				// Find the maintype with matching concept code
				if (!isLoading && !matchingMaintype) {
					// If invalid query param then set isInvalidQuery to true
					dispatch({ type: FilterActionTypes.SET_INVALID_QUERY, payload: { isInvalid: true, invalidParams: { [URL_PARAM_MAPPING.maintype.shortCode]: conceptCodeFromUrl } } });
					// If invalid query param then clear out all the filters
					dispatch({
						type: 'CLEAR_FILTERS',
					});
				}
			}
		}
	}, [conceptCodeFromUrl, formattedOptions, isLoading, dispatch]);

	// Validate maintype c-code from URL once options are loaded
	React.useEffect(() => {
		// Only validate once when options are loaded and we have a maintype value
		if (formattedOptions.length > 0 && value.length > 0 && !hasValidatedUrlParamRef.current) {
			hasValidatedUrlParamRef.current = true;

			const maintypeCode = value[0];
			// Check if the maintype code exists in the available options
			const isValidCode = formattedOptions.some((option) => option.value === maintypeCode);

			if (!isValidCode) {
				// Strip ALL filter parameters from URL when maintype is invalid
				const params = new URLSearchParams(location.search);
				params.delete(URL_PARAM_MAPPING.maintype.shortCode);
				params.delete(URL_PARAM_MAPPING.subtype.shortCode);
				params.delete(URL_PARAM_MAPPING.stage.shortCode);
				params.delete(URL_PARAM_MAPPING.age.shortCode);
				params.delete(URL_PARAM_MAPPING.drugIntervention.shortCode);
				params.delete(URL_PARAM_MAPPING.zipCode.shortCode);
				params.delete(URL_PARAM_MAPPING.radius.shortCode);
				const newSearch = params.toString();
				const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
				navigate(newUrl, { replace: true, state: { invalidParamsRemoved: true } });

				// Invalid c-code detected - set invalid query state and clear filters
				dispatch({ type: FilterActionTypes.CLEAR_FILTERS });
				dispatch({ type: FilterActionTypes.SET_INVALID_QUERY, payload: { isInvalid: true, invalidParams: { [URL_PARAM_MAPPING.maintype.shortCode]: maintypeCode } } });
			}

			// Signal that maintype validation is complete (whether valid or invalid)
			dispatch({ type: FilterActionTypes.SET_VALIDATION_COMPLETE, payload: 'maintype' });
		}
	}, [formattedOptions, value, dispatch, navigate, location]);

	// Signal validation complete when options load but no maintype param to validate
	React.useEffect(() => {
		if (formattedOptions.length > 0 && !isLoading && value.length === 0) {
			dispatch({ type: FilterActionTypes.SET_VALIDATION_COMPLETE, payload: 'maintype' });
		}
	}, [formattedOptions.length, isLoading, value.length, dispatch]);

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
	dispatch: PropTypes.func,
};

export default MainTypeFilter;
