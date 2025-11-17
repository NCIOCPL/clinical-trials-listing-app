import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFilters, FilterActionTypes } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './StageFilter.scss';

import ComboBox from '../ComboBox/ComboBox';

import { useStageSearch } from '../../../../hooks/ctsApiSupport/useStageSearch';
import { useNavigate, useLocation } from 'react-router-dom';
import { URL_PARAM_MAPPING } from '../../constants/urlParams';

const StageFilter = ({ disabled = false, onFocus, dispatch: dispatchFromProps }) => {
	const { state, dispatch: dispatchFromContext } = useFilters();
	// Use dispatch from props if provided (for invalid query handling), otherwise use context dispatch
	const dispatch = dispatchFromProps || dispatchFromContext;
	const { filters } = state;
	const isHandlingChangeRef = useRef(false);
	const hasValidatedUrlParamRef = useRef(false);
	const navigate = useNavigate();
	const location = useLocation();

	// Get the selected maintype code from filters
	const maintypeCode = filters.maintype && filters.maintype.length > 0 ? filters.maintype[0] : null;

	const { options, isLoading } = useStageSearch(maintypeCode);
	const formattedOptions = useMemo(() => {
		return options.map((option) => ({
			value: option.value || option.id || '',
			label: option.label || '',
		}));
	}, [options]);

	// Initialize value as empty array if not already set
	const value = Array.isArray(filters.stage) ? filters.stage : [];

	// Detect if we need to load stage data for concept codes from URL
	const conceptCodeFromUrl = React.useMemo(() => {
		if (Array.isArray(filters.stage) && filters.stage.length > 0) {
			return filters.stage[0];
		}
		return null;
	}, [filters.stage]);

	// Effect to update filter when stage data loads from URL
	// Note: This effect only sets isInvalidQuery to true when invalid params are detected.
	// It does NOT set isInvalidQuery to false - that is handled by FilterContext
	// to avoid race conditions where one valid component clears the error set by another invalid component.
	React.useEffect(() => {
		const matchingStage = formattedOptions.find((option) => option.value && option.value.includes(conceptCodeFromUrl));
		if (conceptCodeFromUrl) {
			if (formattedOptions.length > 0 && maintypeCode) {
				// Find the stage with matching concept code
				if (!isLoading && !matchingStage) {
					// If invalid query param then set isInvalidQuery to true
					dispatch({ type: FilterActionTypes.SET_INVALID_QUERY, payload: true });
					// If invalid query param then clear out all the filters
					dispatch({
						type: 'CLEAR_FILTERS',
					});
				}
			} else if (!maintypeCode) {
				// If invalid query param then set isInvalidQuery to true
				dispatch({ type: FilterActionTypes.SET_INVALID_QUERY, payload: true });
				// If invalid query param then clear out all the filters
				dispatch({
					type: 'CLEAR_FILTERS',
				});
			}
		}
	}, [conceptCodeFromUrl, formattedOptions, isLoading, dispatch]);

	// Validate stage c-code from URL once options are loaded
	React.useEffect(() => {
		// Only validate once when options are loaded and we have a stage value and maintype
		if (formattedOptions.length > 0 && value.length > 0 && maintypeCode && !hasValidatedUrlParamRef.current) {
			hasValidatedUrlParamRef.current = true;

			const stageCode = value[0];
			// Check if the stage code exists in the available options for this maintype
			const isValidCode = formattedOptions.some((option) => option.value === stageCode);

			if (!isValidCode) {
				// Strip ALL filter parameters from URL when stage is invalid
				const params = new URLSearchParams(location.search);
				params.delete(URL_PARAM_MAPPING.stage.shortCode);
				params.delete(URL_PARAM_MAPPING.maintype.shortCode);
				params.delete(URL_PARAM_MAPPING.subtype.shortCode);
				params.delete(URL_PARAM_MAPPING.age.shortCode);
				params.delete(URL_PARAM_MAPPING.drugIntervention.shortCode);
				params.delete(URL_PARAM_MAPPING.zipCode.shortCode);
				params.delete(URL_PARAM_MAPPING.radius.shortCode);
				const newSearch = params.toString();
				const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
				navigate(newUrl, { replace: true, state: { invalidParamsRemoved: true } });

				// Invalid c-code detected - set invalid query state and clear filters
				dispatch({ type: FilterActionTypes.CLEAR_FILTERS });
				dispatch({ type: FilterActionTypes.SET_INVALID_QUERY, payload: true });
			}
		}
	}, [formattedOptions, value, maintypeCode, dispatch, navigate, location]);

	const handleChange = (selectedValue) => {
		// Prevent recursive onChange calls
		if (isHandlingChangeRef.current) {
			return;
		}

		// Guard against ComboBox calling onChange with undefined during initialization
		if (selectedValue === undefined) {
			return;
		}

		// Set flag to prevent recursive calls
		isHandlingChangeRef.current = true;

		const newValue = selectedValue ? [selectedValue] : [];

		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'stage',
				value: newValue,
			},
		});

		// Do we want this on a clear? Maybe instead: (onFocus && selectedValue) onFocus();
		if (onFocus) onFocus();

		// Note: Individual filter change tracking removed - FilterApply event covers all changes

		// Reset flag after a short delay to allow state updates to complete
		setTimeout(() => {
			isHandlingChangeRef.current = false;
		}, 100);
	};

	// Determine if the component should be disabled
	const isStageDisabled = disabled || isLoading || !maintypeCode;

	return (
		<FilterGroup title={FILTER_CONFIG.stage.title} helpText={FILTER_CONFIG.stage.helpText}>
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
	dispatch: PropTypes.func,
};
export default StageFilter;
