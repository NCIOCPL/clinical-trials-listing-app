import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useZipConversion } from '../../hooks/useZipConversion';
import { getFiltersFromURL } from '../../../../utils/url';
import { PAGE_FILTER_CONFIGS } from '../../config/pageFilterConfigs';
import { URL_PARAM_MAPPING } from '../../constants/urlParams';

export const FilterActionTypes = {
	SET_FILTER: 'SET_FILTER',
	APPLY_FILTERS: 'APPLY_FILTERS',
	CLEAR_FILTERS: 'CLEAR_FILTERS',
	REMOVE_FILTER: 'REMOVE_FILTER',
	SET_BASE_FILTERS: 'SET_BASE_FILTERS',
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

		case FilterActionTypes.APPLY_FILTERS:
			isNewPageLoad = action.payload?.isNewPageLoad;
			preservedParams = action.payload?.preservedParams;

			paramPairs = (preservedParams || '').split('&').filter(Boolean);
			orderedParams = new Map();
			paramPairs.forEach((pair) => {
				const [key, value] = pair.split('=');
				if (key) orderedParams.set(key, value);
			});

			pageNumber = isNewPageLoad ? orderedParams.get('pn') || '1' : '1';

			return {
				...state,
				appliedFilters: { ...state.filters },
				isDirty: false,
				shouldSearch: true,
				isInitialLoad: isNewPageLoad || false,
				preservedParams: preservedParams || '',
				currentPage: pageNumber || '1',
				paramOrder: Array.from(orderedParams.keys()),
			};

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

	const [zipCoords, setZipCoords] = useState(null);
	const [hasInvalidZip, setHasInvalidZip] = useState(false);

	const updateZipState = (key, value) => {
		if (key === 'zipCoords') {
			setZipCoords(value);
		} else if (key === 'hasInvalidZip') {
			setHasInvalidZip(value);
		}
	};

	const [{ getZipCoords }] = useZipConversion(updateZipState);

	useEffect(() => {
		if (state.appliedFilters?.location?.zipCode) {
			getZipCoords(state.appliedFilters.location.zipCode);
		} else {
			setZipCoords(null);
			setHasInvalidZip(false);
		}
	}, [state.appliedFilters?.location?.zipCode]);

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
				if (state.appliedFilters.age?.toString().trim()) {
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

	const getLocationFilters = (location) => {
		if (!location?.zipCode || !location?.radius || !zipCoords || hasInvalidZip) {
			return {};
		}

		if (!zipCoords.lat || !zipCoords.long) {
			console.error('Invalid coordinate structure:', zipCoords);
			return {};
		}

		const lat = String(zipCoords.lat);
		const lon = String(zipCoords.long);

		if (!lat || !lon) {
			console.error('Invalid coordinate values after conversion:', { lat, lon });
			return {};
		}

		return {
			'sites.org_coordinates_lat': lat,
			'sites.org_coordinates_lon': lon,
			'sites.org_coordinates_dist': `${location.radius}mi`,
			'sites.recruitment_status': ['active', 'approved', 'enrolling_by_invitation', 'in_review', 'temporarily_closed_to_accrual'],
		};
	};

	const transformFiltersToApi = (filters) => {
		let apiFilters = {};

		if (filters.age?.toString().trim()) {
			apiFilters['eligibility.structured.min_age_in_years_lte'] = filters.age;
			apiFilters['eligibility.structured.max_age_in_years_gte'] = filters.age;
		}

		return {
			...apiFilters,
			...getLocationFilters(filters.location),
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
		hasInvalidZip,
		enabledFilters: filterConfig.enabledFilters,
		pageType,
		zipCoords,
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

	const { state, dispatch, getCurrentFilters, isApplyingFilters, setIsApplyingFilters, hasInvalidZip, enabledFilters, zipCoords, pageType } = context;

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
		hasInvalidZip,
		enabledFilters,
		pageType,
		zipCoords,
	};
}
