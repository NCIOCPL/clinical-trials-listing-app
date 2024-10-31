/* eslint-disable */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';

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
	shouldSearch: false,
};

const getAgeRangeFilters = (ageFilters) => {
	if (!ageFilters?.length) return {};

	const ageRanges = {
		child: { min: 0, max: 17 },
		adult: { min: 18, max: 64 },
		older_adult: { min: 65, max: null },
	};

	const selectedRanges = ageFilters.map((age) => ageRanges[age]).filter(Boolean);

	if (!selectedRanges.length) return {};

	const minAge = Math.min(...selectedRanges.map((r) => r.min));
	const maxAge = Math.max(...selectedRanges.map((r) => r.max || 999));

	const filters = {};

	if (minAge > 0) {
		filters['eligibility.structured.min_age_in_years_gte'] = minAge;
	}

	if (maxAge < 999) {
		filters['eligibility.structured.max_age_in_years_lte'] = maxAge;
	}

	return filters;
};

const getLocationFilters = (location) => {
	if (!location?.zipCode || !location?.radius) return {};

	return {
		'sites.org_coordinates': {
			zipCode: location.zipCode,
			radius: location.radius,
		},
	};
};

const transformFiltersToApi = (filters) => {
	return {
		...getAgeRangeFilters(filters.age),
		...getLocationFilters(filters.location),
	};
};

const getFiltersFromURL = (params) => {
	const filters = {};

	// Handle age filter params
	const ageValues = params.getAll('age');
	if (ageValues.length) {
		filters.age = ageValues;
	}

	// Handle location params
	const zipCode = params.get('zip');
	const radius = params.get('radius');
	if (zipCode || radius) {
		filters.location = {
			zipCode: zipCode || '',
			radius: radius ? parseInt(radius, 10) : null,
		};
	}

	return filters;
};

// Modify updateURLWithFilters to handle pn correctly
const updateURLWithFilters = (filters, existingSearch, isInitialLoad = false) => {
	// Start with empty params
	const params = new URLSearchParams();

	// First, copy all existing non-filter params
	const existingParams = new URLSearchParams(existingSearch);
	for (const [key, value] of existingParams.entries()) {
		if (!['age', 'zip', 'radius'].includes(key)) {
			params.set(key, value);
		}
	}

	// Set pn=1 only for non-initial loads
	if (!isInitialLoad) {
		params.set('pn', '1');
	}

	// Add filter params
	if (filters.age?.length) {
		filters.age.forEach((age) => params.append('age', age));
	}

	if (filters.location?.zipCode) {
		params.set('zip', filters.location.zipCode);
		if (filters.location.radius) {
			params.set('radius', filters.location.radius.toString());
		}
	}

	return params.toString();
};

function filterReducer(state, action) {
	switch (action.type) {
		case FilterActionTypes.SET_FILTER:
			return {
				...state,
				filters: {
					...state.filters,
					[action.payload.filterType]: action.payload.value,
				},
				isDirty: true,
			};

		case FilterActionTypes.APPLY_FILTERS:
			return {
				...state,
				appliedFilters: { ...state.filters },
				isDirty: false,
				shouldSearch: true,
			};

		case FilterActionTypes.CLEAR_FILTERS:
			return {
				...state,
				filters: {
					age: [],
					location: {
						zipCode: '',
						radius: null,
					},
				},
				appliedFilters: [],
				isDirty: false,
				shouldSearch: true,
			};

		case FilterActionTypes.REMOVE_FILTER:
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

export function FilterProvider({ children, baseFilters = {} }) {
	const [state, dispatch] = useReducer(filterReducer, {
		...initialState,
		baseFilters,
	});

	const location = useLocation();
	const navigate = useNavigate();

	// Effect to sync URL params to filter state on mount
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const filtersFromUrl = getFiltersFromURL(params);

		if (Object.keys(filtersFromUrl).length > 0) {
			Object.entries(filtersFromUrl).forEach(([filterType, value]) => {
				dispatch({
					type: FilterActionTypes.SET_FILTER,
					payload: { filterType, value },
				});
			});
			dispatch({
				type: FilterActionTypes.APPLY_FILTERS,
				payload: { isInitialLoad: true },
			});
		}
	}, []);

	useEffect(() => {
		if (!state.isDirty && state.shouldSearch) {
			const params = new URLSearchParams(window.location.search);

			// Handle filter updates
			if (Object.keys(state.appliedFilters).length > 0) {
				// Reset page to 1 when filters actively change
				params.set('pn', '1');

				// Clear and re-add filter params
				['age', 'zip', 'radius'].forEach((param) => params.delete(param));

				// Add age filters
				if (state.appliedFilters.age?.length) {
					state.appliedFilters.age.forEach((age) => params.append('age', age));
				}

				// Add location filters
				if (state.appliedFilters.location?.zipCode) {
					params.set('zip', state.appliedFilters.location.zipCode);
					if (state.appliedFilters.location.radius) {
						params.set('radius', state.appliedFilters.location.radius.toString());
					}
				}

				navigate(
					{
						pathname: location.pathname,
						search: `?${params.toString()}`,
					},
					{ replace: true }
				);
			}
		}
	}, [state.appliedFilters, state.isDirty, state.shouldSearch, location.pathname, navigate]);

	const getCurrentFilters = () => ({
		...state.baseFilters,
		...transformFiltersToApi(state.appliedFilters),
	});

	const value = {
		state,
		dispatch,
		getCurrentFilters,
	};

	return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

FilterProvider.propTypes = {
	children: PropTypes.node.isRequired,
	baseFilters: PropTypes.object,
};
export function useFilters() {
	const context = useContext(FilterContext);
	if (!context) {
		throw new Error('useFilters must be used within a FilterProvider');
	}

	const { state, dispatch, getCurrentFilters } = context;

	const setFilter = (filterType, value) =>
		dispatch({
			type: FilterActionTypes.SET_FILTER,
			payload: { filterType, value },
		});

	const applyFilters = () => {
		dispatch({ type: FilterActionTypes.APPLY_FILTERS });
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
	};
}
