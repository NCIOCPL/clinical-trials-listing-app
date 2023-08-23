/**
 * @file This file defines the FilterContext, which provides a centralized state management
 * system for all filter-related functionality in the application. It handles filter state,
 * URL synchronization, ZIP code validation and geocoding, and transforming filters to API parameters.
 */
import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useStateValue } from '../../../../store/store.jsx';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFiltersFromURL } from '../../../../utils/url';
import { PAGE_FILTER_CONFIGS } from '../../config/pageFilterConfigs';
import { URL_PARAM_MAPPING } from '../../constants/urlParams';
import { getLocationFilters } from '../../utils/locationUtils';
import { isValidZipFormat } from '../../utils/locationUtils';

/**
 * Action types for the filter reducer.
 * These define all possible actions that can be dispatched to modify filter state.
 */
export const FilterActionTypes = {
	SET_FILTER: 'SET_FILTER', // Set a specific filter value
	APPLY_FILTERS: 'APPLY_FILTERS', // Apply current filter values (marks them as "applied")
	CLEAR_FILTERS: 'CLEAR_FILTERS', // Reset all filters to initial state
	REMOVE_FILTER: 'REMOVE_FILTER', // Remove a specific filter value
	SET_BASE_FILTERS: 'SET_BASE_FILTERS', // Set base filters (e.g., disease, intervention)
	SET_ZIP_COORDINATES: 'SET_ZIP_COORDINATES', // Set coordinates for ZIP code
};

/**
 * Initial state for the filter reducer.
 * Defines the default structure and values for the filter state.
 */
const initialState = {
	filters: {
		age: '',
		location: {
			zipCode: '',
			radius: null,
		},
	},
	appliedFilters: [], // Filters that have been applied (after clicking "Apply")
	baseFilters: {}, // Base filters that are always applied (e.g., disease type)
	isDirty: false, // Whether filters have been modified but not applied
	shouldSearch: true, // Whether a search should be triggered
	isInitialLoad: true, // Whether this is the initial page load
	currentPage: null, // Current page number
	paramOrder: [], // Order of URL parameters
	preservedParams: '', // URL parameters to preserve
	zipCoords: null, // Coordinates for the current ZIP code
	appliedZipCoords: null, // Coordinates for the applied ZIP code
};

/**
 * Reducer function for managing filter state.
 * Handles all actions defined in FilterActionTypes.
 *
 * @param {object} state - Current filter state
 * @param {object} action - Action object with type and payload
 * @returns {object} New filter state
 */
function filterReducer(state, action) {
	const { enabledFilters } = PAGE_FILTER_CONFIGS[state.pageType];
	const clearedFilters = {};
	let isNewPageLoad = null;
	let preservedParams = null;
	let pageNumber = null;
	let paramPairs = null;
	let orderedParams = null;
	switch (action.type) {
		case FilterActionTypes.SET_FILTER:
			// Ignore if filter type is not enabled for this page
			if (!enabledFilters.includes(action.payload.filterType)) {
				return state;
			}
			return {
				...state,
				filters: {
					...state.filters,
					[action.payload.filterType]: action.payload.value,
				},
				isDirty: true, // Mark as dirty since filter was changed
			};

		case FilterActionTypes.APPLY_FILTERS: {
			isNewPageLoad = action.payload?.isNewPageLoad;
			preservedParams = action.payload?.preservedParams;

			// Process preserved URL parameters
			paramPairs = (preservedParams || '').split('&').filter(Boolean);
			orderedParams = new Map();
			paramPairs.forEach((pair) => {
				const [key, value] = pair.split('=');
				if (key) orderedParams.set(key, value);
			});

			pageNumber = isNewPageLoad ? orderedParams.get('pn') || '1' : '1';

			// Handle ZIP coordinates
			let newAppliedZipCoords = null;

			// Only apply coordinates if we have both a ZIP code and coordinates
			if (state.filters.location?.zipCode && state.zipCoords) {
				newAppliedZipCoords = state.zipCoords;
			}

			return {
				...state,
				appliedFilters: { ...state.filters }, // Copy current filters to applied filters
				isDirty: false, // No longer dirty after applying
				shouldSearch: true, // Should trigger a search
				isInitialLoad: isNewPageLoad || false,
				preservedParams: preservedParams || '',
				currentPage: pageNumber || '1',
				paramOrder: Array.from(orderedParams.keys()),
				appliedZipCoords: newAppliedZipCoords,
			};
		}

		case FilterActionTypes.CLEAR_FILTERS:
			// Reset all enabled filters to their initial state
			enabledFilters.forEach((filterType) => {
				clearedFilters[filterType] = initialState.filters[filterType];
			});

			return {
				...state,
				filters: clearedFilters,
				appliedFilters: [],
				isDirty: false,
				shouldSearch: true,
				appliedZipCoords: null,
			};

		case FilterActionTypes.REMOVE_FILTER: {
			const { filterType, value } = action.payload;
			const updatedFilters = { ...state.filters };

			// Handle array filters (remove specific value)
			if (Array.isArray(updatedFilters[filterType])) {
				updatedFilters[filterType] = updatedFilters[filterType].filter((v) => v !== value);
			}
			// Handle location filter (reset both ZIP and radius)
			else if (filterType === 'location') {
				updatedFilters.location = {
					zipCode: '',
					radius: null,
				};
			}

			return {
				...state,
				filters: updatedFilters,
				isDirty: true,
			};
		}

		case FilterActionTypes.SET_BASE_FILTERS:
			return {
				...state,
				baseFilters: action.payload,
			};

		case FilterActionTypes.SET_ZIP_COORDINATES:
			return {
				...state,
				zipCoords: action.payload,
			};

		default:
			return state;
	}
}

/**
 * Context for providing filter state and actions throughout the application.
 */
export const FilterContext = createContext();

/**
 * Provider component for the FilterContext.
 * Manages filter state, URL synchronization, and filter application.
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {object} [props.baseFilters={}] - Base filters to always apply
 * @param {string} [props.pageType='Disease'] - Type of page (e.g., 'Disease', 'Intervention')
 * @returns {JSX.Element} FilterContext.Provider component
 */
export function FilterProvider({ children, baseFilters = {}, pageType = 'Disease' }) {
	const filterConfig = PAGE_FILTER_CONFIGS[pageType];
	const [state, dispatch] = useReducer(filterReducer, {
		...initialState,
		baseFilters,
		pageType,
	});

	const [isApplyingFilters, setIsApplyingFilters] = useState(false);
	const [{ zipConversionEndpoint }] = useStateValue();

	const location = useLocation();
	const navigate = useNavigate();

	/**
	 * Effect to initialize filters from URL parameters when the path changes.
	 * Extracts filter values from URL and dispatches actions to set them.
	 */
	useEffect(() => {
		let params = new URLSearchParams(location.search);
		let filtersFromUrl = getFiltersFromURL(params);
		let isNewPageLoad = true;

		// Preserve non-filter URL parameters
		let paramOrder = Array.from(params.keys());
		let filterParams = [URL_PARAM_MAPPING.age.shortCode, URL_PARAM_MAPPING.zipCode.shortCode, URL_PARAM_MAPPING.radius.shortCode];
		let preservedParamsMap = new Map();

		for (const key of paramOrder) {
			if (!filterParams.includes(key)) {
				preservedParamsMap.set(key, params.get(key));
			}
		}

		const preservedParams = Array.from(preservedParamsMap.entries())
			.map(([key, value]) => `${key}=${value}`)
			.join('&');

		// Set filters from URL if they exist
		if (Object.keys(filtersFromUrl).length > 0) {
			Object.entries(filtersFromUrl).forEach(([filterType, value]) => {
				dispatch({
					type: FilterActionTypes.SET_FILTER,
					payload: { filterType, value, isNewPageLoad },
				});
			});
			dispatch({
				type: FilterActionTypes.APPLY_FILTERS,
				payload: { isNewPageLoad, preservedParams: preservedParams.toString() },
			});
		} else {
			// Just apply empty filters if no URL parameters
			dispatch({
				type: FilterActionTypes.APPLY_FILTERS,
				payload: { isNewPageLoad, preservedParams: preservedParams.toString() },
			});
		}
	}, [location.pathname]);

	/**
	 * Helper function to validate ZIP code and apply filters.
	 * Memoized to prevent infinite loops in useEffect dependencies.
	 *
	 * @param {string} zipCode - ZIP code to validate
	 * @param {string} radius - Search radius in miles
	 */
	const validateZipcodeAndApplyFilters = useCallback(
		async (zipCode, radius) => {
			// Set the filter values first (this won't trigger a search yet)
			dispatch({
				type: FilterActionTypes.SET_FILTER,
				payload: {
					filterType: 'location',
					value: {
						zipCode: zipCode,
						radius: radius || '100',
					},
				},
			});

			// Validate the zipcode via API if format is valid
			if (isValidZipFormat(zipCode)) {
				try {
					// Get the zipcode conversion endpoint from the component state
					const zipBase = zipConversionEndpoint || 'https://clinicaltrialsapi.cancer.gov/api/v2/zip_coords';
					const url = `${zipBase}/${zipCode}`;

					// Call the API directly
					const response = await axios.get(url);

					// Only if we get valid coordinates...
					if (response.data && !response.data.message) {
						// Set the coordinates
						dispatch({
							type: FilterActionTypes.SET_ZIP_COORDINATES,
							payload: response.data,
						});

						// THEN apply filters
						dispatch({ type: FilterActionTypes.APPLY_FILTERS });
					} else {
						// Don't apply filters with invalid zipcode
						// Invalid ZIP code - silently handle
					}
				} catch (error) {
					// Don't apply filters if validation fails
					// Error validating ZIP - silently handle
				}
			} else {
				// Invalid format - just apply filters normally
				// (The filter won't be used since we need coordinates)
				dispatch({ type: FilterActionTypes.APPLY_FILTERS });
			}
		},
		[zipConversionEndpoint, dispatch]
	);

	/**
	 * Effect to handle ZIP code validation when URL parameters change.
	 * Extracts ZIP and radius from URL and validates if present.
	 */
	useEffect(() => {
		// Get ZIP and radius from URL parameters
		const params = new URLSearchParams(location.search);
		const zipParam = params.get(URL_PARAM_MAPPING.zipCode.shortCode);
		const radiusParam = params.get(URL_PARAM_MAPPING.radius.shortCode);

		// If we have a ZIP code from URL parameters, handle it specially
		if (zipParam) {
			validateZipcodeAndApplyFilters(zipParam, radiusParam);
		}
	}, [location.pathname, location.search, zipConversionEndpoint, validateZipcodeAndApplyFilters]);

	/**
	 * Effect to update URL parameters when filters are applied.
	 * Synchronizes the URL with the current filter state.
	 */
	useEffect(() => {
		if (!state.isDirty && state.shouldSearch) {
			let params = new URLSearchParams(window.location.search);
			let isInitialLoad = state.isInitialLoad;
			const originalPn = params.get('pn');

			// Preserve non-filter URL parameters
			let paramOrder = Array.from(params.keys());
			let filterParams = [URL_PARAM_MAPPING.age.shortCode, URL_PARAM_MAPPING.zipCode.shortCode, URL_PARAM_MAPPING.radius.shortCode];
			let updatedParams = new Map();

			// Handle non-filter parameters
			for (const key of paramOrder) {
				if (!filterParams.includes(key)) {
					if (key === 'pn' && isInitialLoad) {
						updatedParams.set(key, originalPn);
					} else if (key === 'redirect') {
						// Set the redirect param on the initial loads but ignore otherwise
						if (isInitialLoad) {
							updatedParams.set(key, params.get(key));
						}
						// When filters are applied (not initial load), we don't include redirect=true
					} else {
						updatedParams.set(key, params.get(key));
					}
				}
			}

			// Add filter parameters if they exist
			if (Object.keys(state.appliedFilters).length > 0) {
				// Handle age parameter
				if (state.appliedFilters.age?.toString().trim() !== '') {
					const ageIndex = paramOrder.indexOf(URL_PARAM_MAPPING.age.shortCode);
					if (ageIndex >= 0) {
						// Preserve parameter order if age already exists in URL
						const temp = new Map();
						for (const [key, value] of updatedParams.entries()) {
							if (paramOrder.indexOf(key) < ageIndex) {
								temp.set(key, value);
							}
						}
						temp.set(URL_PARAM_MAPPING.age.shortCode, state.appliedFilters.age);
						for (const [key, value] of updatedParams.entries()) {
							if (paramOrder.indexOf(key) > ageIndex) {
								temp.set(key, value);
							}
						}
						updatedParams = temp;
					} else {
						updatedParams.set(URL_PARAM_MAPPING.age.shortCode, state.appliedFilters.age);
					}
				}

				// Handle location parameters
				if (state.appliedFilters.location?.zipCode) {
					updatedParams.set(URL_PARAM_MAPPING.zipCode.shortCode, state.appliedFilters.location.zipCode);
					if (state.appliedFilters.location.radius) {
						updatedParams.set(URL_PARAM_MAPPING.radius.shortCode, state.appliedFilters.location.radius.toString());
					}
				}
			}

			// Handle pagination parameter
			const pnValue = isInitialLoad || !state.isDirty ? originalPn || '1' : '1';
			const pnIndex = paramOrder.indexOf('pn');
			if (pnIndex >= 0) {
				// Preserve parameter order if 'pn' already exists
				const temp = new Map();
				for (const [key, value] of updatedParams.entries()) {
					if (paramOrder.indexOf(key) < pnIndex) {
						temp.set(key, value);
					}
				}
				temp.set('pn', pnValue);
				for (const [key, value] of updatedParams.entries()) {
					if (paramOrder.indexOf(key) > pnIndex) {
						temp.set(key, value);
					}
				}
				updatedParams = temp;
			} else {
				updatedParams.set('pn', pnValue);
			}
			// Construct the final query string
			const queryString = Array.from(updatedParams.entries())
				.filter(([, value]) => {
					// Check if value is null or undefined before calling toString()
					return value !== null && value !== undefined && value.toString().trim() !== '';
				})
				.map(([key, value]) => `${key}=${value}`)
				.join('&');

			// Update the URL without adding to browser history
			navigate(
				{
					pathname: location.pathname,
					search: queryString ? `?${queryString}` : '',
				},
				{ replace: true }
			);
		}
	}, [state.appliedFilters, state.isDirty, state.shouldSearch, location.pathname, navigate]);

	/**
	 * Transforms the applied filter state into the format expected by the API.
	 *
	 * @param {object} filters - The applied filter state object.
	 * @returns {object} Filters formatted for the API request.
	 */
	const transformFiltersToApi = (filters) => {
		let apiFilters = {};

		// Transform age filter
		if (filters.age?.toString().trim() !== '') {
			apiFilters['eligibility.structured.min_age_in_years_lte'] = filters.age;
			apiFilters['eligibility.structured.max_age_in_years_gte'] = filters.age;
		}

		// Transform location filter using utility function
		const locationFilters = getLocationFilters(filters.location, state.appliedZipCoords);

		return {
			...apiFilters,
			...locationFilters,
		};
	};

	/**
	 * Gets the current filters (base filters + applied filters) formatted for the API.
	 *
	 * @returns {object} Current filters ready for API request.
	 */
	const getCurrentFilters = () => ({
		...state.baseFilters,
		...transformFiltersToApi(state.appliedFilters),
	});

	// Value provided by the context
	const value = {
		state,
		dispatch,
		getCurrentFilters,
		isApplyingFilters,
		setIsApplyingFilters,
		enabledFilters: filterConfig.enabledFilters,
		pageType,
		zipCoords: state.zipCoords,
		appliedZipCoords: state.appliedZipCoords,
		listingInfo: {
			diseaseName: pageType === 'Disease' ? baseFilters.diseaseName : null,
			interventionName: pageType === 'Intervention' ? baseFilters.interventionName : null,
			trialType: baseFilters.trialType,
			pageTitle: baseFilters.pageTitle,
		},
	};

	return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

// PropTypes for the FilterProvider component
FilterProvider.propTypes = {
	children: PropTypes.node.isRequired,
	baseFilters: PropTypes.object,
	pageType: PropTypes.string,
};

/**
 * Custom hook for accessing the FilterContext.
 * Provides convenient access to state and action dispatchers.
 *
 * @returns {object} Filter context values (state, dispatch, actions, etc.)
 */
export function useFilters() {
	const context = useContext(FilterContext);
	if (!context) {
		throw new Error('useFilters must be used within a FilterProvider');
	}

	const { state, dispatch, getCurrentFilters, isApplyingFilters, setIsApplyingFilters, enabledFilters, zipCoords, appliedZipCoords, pageType } = context;

	/**
	 * Dispatches an action to set a specific filter value.
	 * @param {string} filterType - The type of filter to set.
	 * @param {*} value - The value to set for the filter.
	 */
	const setFilter = (filterType, value) =>
		dispatch({
			type: FilterActionTypes.SET_FILTER,
			payload: { filterType, value },
		});

	/**
	 * Dispatches an action to apply the current filter state.
	 * Includes a small delay for visual feedback.
	 */
	const applyFilters = async () => {
		setIsApplyingFilters(true);
		dispatch({ type: FilterActionTypes.APPLY_FILTERS });
		// Artificial delay for visual feedback (optional)
		await new Promise((resolve) => setTimeout(resolve, 300));
		setIsApplyingFilters(false);
	};

	/**
	 * Dispatches an action to clear all filters.
	 */
	const clearFilters = () => dispatch({ type: FilterActionTypes.CLEAR_FILTERS });

	/**
	 * Dispatches an action to remove a specific filter value.
	 * @param {string} filterType - The type of filter to remove from.
	 * @param {*} value - The specific value to remove.
	 */
	const removeFilter = (filterType, value) =>
		dispatch({
			type: FilterActionTypes.REMOVE_FILTER,
			payload: { filterType, value },
		});

	// Return context values and action functions
	return {
		state,
		dispatch,
		getCurrentFilters,
		setFilter,
		applyFilters,
		clearFilters,
		removeFilter,
		isApplyingFilters,
		enabledFilters,
		pageType,
		zipCoords,
		appliedZipCoords,
	};
}
