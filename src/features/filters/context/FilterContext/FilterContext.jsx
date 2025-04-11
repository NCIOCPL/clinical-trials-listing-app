import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFiltersFromURL } from '../../../../utils/url';
import { PAGE_FILTER_CONFIGS } from '../../config/pageFilterConfigs';
import { URL_PARAM_MAPPING } from '../../constants/urlParams';
import { getLocationFilters } from '../../utils/locationUtils';
import { isValidZipFormat } from '../../utils/locationUtils';

export const FilterActionTypes = {
	SET_FILTER: 'SET_FILTER',
	APPLY_FILTERS: 'APPLY_FILTERS',
	CLEAR_FILTERS: 'CLEAR_FILTERS',
	REMOVE_FILTER: 'REMOVE_FILTER',
	SET_BASE_FILTERS: 'SET_BASE_FILTERS',
	SET_ZIP_COORDINATES: 'SET_ZIP_COORDINATES',
};

const initialState = {
	filters: {
		age: [],
		location: {
			zipCode: '',
			radius: null,
		},
	},
	appliedFilters: [],
	baseFilters: {},
	isDirty: false,
	shouldSearch: true,
	isInitialLoad: true,
	currentPage: null,
	paramOrder: [],
	preservedParams: '',
	zipCoords: null,
	appliedZipCoords: null,
};

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
			if (!enabledFilters.includes(action.payload.filterType)) {
				return state;
			}
			return {
				...state,
				filters: {
					...state.filters,
					[action.payload.filterType]: action.payload.value,
				},
				isDirty: true,
			};

		case FilterActionTypes.APPLY_FILTERS: {
			isNewPageLoad = action.payload?.isNewPageLoad;
			preservedParams = action.payload?.preservedParams;

			paramPairs = (preservedParams || '').split('&').filter(Boolean);
			orderedParams = new Map();
			paramPairs.forEach((pair) => {
				const [key, value] = pair.split('=');
				if (key) orderedParams.set(key, value);
			});

			pageNumber = isNewPageLoad ? orderedParams.get('pn') || '1' : '1';

			// Improved ZIP coordinates handling
			let newAppliedZipCoords = null;

			// Only apply coordinates if we have both a ZIP code and coordinates
			if (state.filters.location?.zipCode && state.zipCoords) {
				newAppliedZipCoords = state.zipCoords;
			} else if (state.filters.location?.zipCode && !state.zipCoords) {
				// Log warning when ZIP exists but coordinates don't
				console.warn('ZIP code exists but coordinates not found');
			}

			return {
				...state,
				appliedFilters: { ...state.filters },
				isDirty: false,
				shouldSearch: true,
				isInitialLoad: isNewPageLoad || false,
				preservedParams: preservedParams || '',
				currentPage: pageNumber || '1',
				paramOrder: Array.from(orderedParams.keys()),
				appliedZipCoords: newAppliedZipCoords,
			};
		}

		case FilterActionTypes.CLEAR_FILTERS:
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
			if (Array.isArray(updatedFilters[filterType])) {
				updatedFilters[filterType] = updatedFilters[filterType].filter((v) => v !== value);
			} else if (filterType === 'location') {
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

export const FilterContext = createContext();

export function FilterProvider({ children, baseFilters = {}, pageType = 'Disease' }) {
	const filterConfig = PAGE_FILTER_CONFIGS[pageType];
	const [state, dispatch] = useReducer(filterReducer, {
		...initialState,
		baseFilters,
		pageType,
	});

	const [isApplyingFilters, setIsApplyingFilters] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		let params = new URLSearchParams(location.search);
		let filtersFromUrl = getFiltersFromURL(params);
		let isNewPageLoad = true;

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
			dispatch({
				type: FilterActionTypes.APPLY_FILTERS,
				payload: { isNewPageLoad, preservedParams: preservedParams.toString() },
			});
		}
	}, [location.pathname]);

	// Add a useEffect to handle URL parameters for ZIP codes
	useEffect(() => {
		// Get ZIP and radius from URL parameters
		const params = new URLSearchParams(location.search);
		const zipParam = params.get(URL_PARAM_MAPPING.zipCode.shortCode);
		const radiusParam = params.get(URL_PARAM_MAPPING.radius.shortCode);

		// If we have a ZIP code from URL parameters
		if (zipParam && isValidZipFormat(zipParam)) {
			// Set the filter values
			dispatch({
				type: FilterActionTypes.SET_FILTER,
				payload: {
					filterType: 'location',
					value: {
						zipCode: zipParam,
						radius: radiusParam || '100',
					},
				},
			});

			// This will trigger the ZIP validation in ZipCodeFilter
			dispatch({ type: FilterActionTypes.APPLY_FILTERS });
		}
	}, [location.pathname]);

	useEffect(() => {
		if (!state.isDirty && state.shouldSearch) {
			let params = new URLSearchParams(window.location.search);
			let isInitialLoad = state.isInitialLoad;
			const originalPn = params.get('pn');

			let paramOrder = Array.from(params.keys());
			let filterParams = [URL_PARAM_MAPPING.age.shortCode, URL_PARAM_MAPPING.zipCode.shortCode, URL_PARAM_MAPPING.radius.shortCode];
			let updatedParams = new Map();

			for (const key of paramOrder) {
				if (!filterParams.includes(key)) {
					if (key === 'pn' && isInitialLoad) {
						updatedParams.set(key, originalPn);
					} else if (key === 'redirect') {
						// Set the rediret param on the initial loads but ignore otherwise
						if (isInitialLoad) {
							updatedParams.set(key, params.get(key));
						}
						// When filters are applied (not initial load), we don't include redirect=true
					} else {
						updatedParams.set(key, params.get(key));
					}
				}
			}

			if (Object.keys(state.appliedFilters).length > 0) {
				if (state.appliedFilters.age?.toString().trim() !== '') {
					const ageIndex = paramOrder.indexOf(URL_PARAM_MAPPING.age.shortCode);
					if (ageIndex >= 0) {
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

				if (state.appliedFilters.location?.zipCode) {
					updatedParams.set(URL_PARAM_MAPPING.zipCode.shortCode, state.appliedFilters.location.zipCode);
					if (state.appliedFilters.location.radius) {
						updatedParams.set(URL_PARAM_MAPPING.radius.shortCode, state.appliedFilters.location.radius.toString());
					}
				}
			}

			const pnValue = isInitialLoad || !state.isDirty ? originalPn || '1' : '1';
			const pnIndex = paramOrder.indexOf('pn');
			if (pnIndex >= 0) {
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

			const queryString = Array.from(updatedParams.entries())
				.filter(([, value]) => value.toString().trim() !== '')
				.map(([key, value]) => `${key}=${value}`)
				.join('&');

			navigate(
				{
					pathname: location.pathname,
					search: queryString ? `?${queryString}` : '',
				},
				{ replace: true }
			);
		}
	}, [state.appliedFilters, state.isDirty, state.shouldSearch, location.pathname, navigate]);

	const transformFiltersToApi = (filters) => {
		let apiFilters = {};

		if (filters.age?.toString().trim() !== '') {
			apiFilters['eligibility.structured.min_age_in_years_lte'] = filters.age;
			apiFilters['eligibility.structured.max_age_in_years_gte'] = filters.age;
		}

		const locationFilters = getLocationFilters(filters.location, state.appliedZipCoords);

		return {
			...apiFilters,
			...locationFilters,
		};
	};

	const getCurrentFilters = () => ({
		...state.baseFilters,
		...transformFiltersToApi(state.appliedFilters),
	});

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

FilterProvider.propTypes = {
	children: PropTypes.node.isRequired,
	baseFilters: PropTypes.object,
	pageType: PropTypes.string,
};

export function useFilters() {
	const context = useContext(FilterContext);
	if (!context) {
		throw new Error('useFilters must be used within a FilterProvider');
	}

	const { state, dispatch, getCurrentFilters, isApplyingFilters, setIsApplyingFilters, enabledFilters, zipCoords, appliedZipCoords, pageType } = context;

	const setFilter = (filterType, value) =>
		dispatch({
			type: FilterActionTypes.SET_FILTER,
			payload: { filterType, value },
		});

	const applyFilters = async () => {
		setIsApplyingFilters(true);
		dispatch({ type: FilterActionTypes.APPLY_FILTERS });
		await new Promise((resolve) => setTimeout(resolve, 300));
		setIsApplyingFilters(false);
	};

	const clearFilters = () => dispatch({ type: FilterActionTypes.CLEAR_FILTERS });

	const removeFilter = (filterType, value) =>
		dispatch({
			type: FilterActionTypes.REMOVE_FILTER,
			payload: { filterType, value },
		});

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
