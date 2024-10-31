// src/features/filters/context/FilterContext/FilterContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';

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

	// Only add parameters if they create meaningful restrictions
	const filters = {};

	// If not starting from 0, add minimum age
	if (minAge > 0) {
		filters['eligibility.structured.min_age_in_years_gte'] = minAge;
	}

	// If not extending to infinity, add maximum age
	if (maxAge < 999) {
		filters['eligibility.structured.max_age_in_years_lte'] = maxAge;
	}
	//
	// console.log(getAgeRangeFilters(['child']));
	// // Output: { max_age_islte: 17 }
	//
	// console.log(getAgeRangeFilters(['adult']));
	// // Output: { minage_is_gte: 18, max_age_islte: 64 }
	//
	// console.log(getAgeRangeFilters(['older_adult']));
	// // Output: { minage_is_gte: 65 }
	//
	// console.log(getAgeRangeFilters(['child', 'adult']));
	// // Output: { max_age_islte: 64 }
	//
	// console.log(getAgeRangeFilters(['adult', 'older_adult']));
	// // Output: { minage_is_gte: 18 }
	//
	// console.log(getAgeRangeFilters(['child', 'adult', 'older_adult']));
	// Output: {} (no restrictions)

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

// URL handling utilities
const getFiltersFromURL = (search) => {
	const params = new URLSearchParams(search);
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

// const updateURLWithFilters = (filters) => {
// 	const params = new URLSearchParams();
//
// 	// Add age params
// 	if (filters.age?.length) {
// 		filters.age.forEach((age) => params.append('age', age));
// 	}
//
// 	// Add location params
// 	if (filters.location?.zipCode) {
// 		params.set('zip', filters.location.zipCode);
// 	}
// 	if (filters.location?.radius) {
// 		params.set('radius', filters.location.radius.toString());
// 	}
//
// 	return params.toString();
// };

// src/utils/url.js
export const updateURLWithFilters = (filters, existingSearch) => {
	// Start with existing params
	const params = new URLSearchParams(existingSearch);

	// Clear any existing filter params
	params.delete('age');
	// Add other filter param deletions here as needed

	// Add new filter params
	if (filters.age?.length) {
		filters.age.forEach((age) => params.append('age', age));
	}

	// Add location params if they exist
	if (filters.location?.zipCode) {
		params.set('zip', filters.location.zipCode);
	}
	if (filters.location?.radius) {
		params.set('radius', filters.location.radius.toString());
	}

	// Return the full query string
	return params.toString();
};

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

	// Sync with URL on mount
	useEffect(() => {
		const filtersFromUrl = getFiltersFromURL(location.search);
		if (Object.keys(filtersFromUrl).length > 0) {
			Object.entries(filtersFromUrl).forEach(([filterType, value]) => {
				dispatch({
					type: FilterActionTypes.SET_FILTER,
					payload: { filterType, value },
				});
			});
			dispatch({ type: FilterActionTypes.APPLY_FILTERS });
		}
	}, []);

	// Update URL when filters change
	useEffect(() => {
		if (state.appliedFilters && Object.keys(state.appliedFilters).length > 0) {
			// Get current URL params
			const currentParams = new URLSearchParams(location.search);
			// Add or update filter params
			const queryString = updateURLWithFilters(state.appliedFilters, currentParams.toString());

			navigate(
				{
					// Preserve existing path and add/update search params
					pathname: location.pathname,
					search: queryString ? `?${queryString}` : '',
				},
				{ replace: true }
			);
		}
	}, [state.appliedFilters]);

	// Get current API filters including base filters
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

	// Convenience methods
	const setFilter = (filterType, value) => dispatch({ type: FilterActionTypes.SET_FILTER, payload: { filterType, value } });

	const applyFilters = () => dispatch({ type: FilterActionTypes.APPLY_FILTERS });

	const clearFilters = () => dispatch({ type: FilterActionTypes.CLEAR_FILTERS });

	const removeFilter = (filterType, value) => dispatch({ type: FilterActionTypes.REMOVE_FILTER, payload: { filterType, value } });

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
