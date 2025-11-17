import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFilters, FilterActionTypes } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './Subtype.scss';

import { useSubTypeSearch } from '../../../../hooks/ctsApiSupport/useSubTypeSearch';
import ComboBox from '../ComboBox/ComboBox';
import { useNavigate, useLocation } from 'react-router-dom';
import { URL_PARAM_MAPPING } from '../../constants/urlParams';

const Subtype = ({ disabled = false, onFocus, dispatch: dispatchFromProps }) => {
	const { state, dispatch: dispatchFromContext } = useFilters();
	// Use dispatch from props if provided (for invalid query handling), otherwise use context dispatch
	const dispatch = dispatchFromProps || dispatchFromContext;
	const { filters } = state;
	const hasValidatedUrlParamRef = useRef(false);
	const navigate = useNavigate();
	const location = useLocation();

	// Get the selected maintype code from filters
	const maintypeCode = filters.maintype && filters.maintype.length > 0 ? filters.maintype[0] : null;

	// Use our custom React Query hook with the maintype code
	const { options, isLoading } = useSubTypeSearch(maintypeCode);
	// console.log(options);
	// Ensure each option has required properties for the ComboBox
	const formattedOptions = useMemo(() => {
		return options.map((option) => ({
			value: option.value || option.id || '',
			label: option.label || '',
		}));
	}, [options]);

	// Initialize value as empty array if not already set
	const value = Array.isArray(filters.subtype) ? filters.subtype : [];

	// Detect if we need to load subtype data for concept codes from URL
	const conceptCodeFromUrl = React.useMemo(() => {
		if (Array.isArray(filters.subtype) && filters.subtype.length > 0) {
			return filters.subtype[0];
		}
		return null;
	}, [filters.subtype]);

	// Effect to update filter when subtype data loads from URL
	// Note: This effect only sets isInvalidQuery to true when invalid params are detected.
	// It does NOT set isInvalidQuery to false - that is handled by FilterContext
	// to avoid race conditions where one valid component clears the error set by another invalid component.
	React.useEffect(() => {
		const matchingSubtype = formattedOptions.find((option) => option.value && option.value.includes(conceptCodeFromUrl));
		if (conceptCodeFromUrl) {
			if (formattedOptions.length > 0 && maintypeCode) {
				// Find the subtype with matching concept code
				if (!isLoading && !matchingSubtype) {
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

	// Validate subtype c-code from URL once options are loaded
	React.useEffect(() => {
		// Only validate once when options are loaded and we have a subtype value and maintype
		if (formattedOptions.length > 0 && value.length > 0 && maintypeCode && !hasValidatedUrlParamRef.current) {
			hasValidatedUrlParamRef.current = true;

			const subtypeCode = value[0];
			// Check if the subtype code exists in the available options for this maintype
			const isValidCode = formattedOptions.some((option) => option.value === subtypeCode);

			if (!isValidCode) {
				// Strip all filter parameters from URL when subtype is invalid
				const params = new URLSearchParams(location.search);
				params.delete(URL_PARAM_MAPPING.subtype.shortCode);
				params.delete(URL_PARAM_MAPPING.maintype.shortCode);
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
				dispatch({ type: FilterActionTypes.SET_INVALID_QUERY, payload: true });
			}
		}
	}, [formattedOptions, value, maintypeCode, dispatch, navigate, location]);

	const handleChange = (selectedValue) => {
		// Guard against ComboBox calling onChange with undefined during initialization
		if (selectedValue === undefined) {
			return;
		}

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

		// Note: Individual filter change tracking removed - FilterApply event covers all changes
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
	dispatch: PropTypes.func,
};

export default Subtype;
