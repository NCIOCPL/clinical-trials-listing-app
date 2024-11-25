import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useZipConversion } from '../../hooks/useZipConversion';
import { getFiltersFromURL } from '../../../../utils/url';

export const FilterActionTypes = {
	SET_FILTER: 'SET_FILTER',
	APPLY_FILTERS: 'APPLY_FILTERS',
	CLEAR_FILTERS: 'CLEAR_FILTERS',
	REMOVE_FILTER: 'REMOVE_FILTER',
	SET_BASE_FILTERS: 'SET_BASE_FILTERS',
};
// 'diseases.nci_thesaurus_concept_id': ['C4872'],

// const baseParams = {
// 	current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
// 	include: ['brief_summary', 'brief_title', 'current_trial_status', 'nci_id', 'nct_id', 'sites.org_name', 'sites.org_country', 'sites.org_state_or_province', 'sites.org_city', 'sites.recruitment_status'],
// };

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
	isInitialLoad: true,
};

// const getAgeRangeFilters = (ageFilters) => {
// 	if (!ageFilters?.length) return {};
//
// 	const ageRanges = {
// 		child: { min: 0, max: 17 },
// 		adult: { min: 18, max: 64 },
// 		older_adult: { min: 65, max: null },
// 	};
//
// 	const selectedRanges = ageFilters.map((age) => ageRanges[age]).filter(Boolean);
//
// 	if (!selectedRanges.length) return {};
//
// 	const minAge = Math.min(...selectedRanges.map((r) => r.min));
// 	const maxAge = Math.max(...selectedRanges.map((r) => r.max || 999));
//
// 	const filters = {};
//
// 	if (minAge > 0) {
// 		filters['eligibility.structured.min_age_in_years_gte'] = minAge;
// 	}
//
// 	if (maxAge < 999) {
// 		filters['eligibility.structured.max_age_in_years_lte'] = maxAge;
// 	}
//
// 	return filters;
// };

// const getAgeFilters = (age) => {
// 	if (!age) return {};
//
// 	return {
// 		'eligibility.structured.min_age_in_years_lte': parseInt(age),
// 		'eligibility.structured.max_age_in_years_gte': parseInt(age),
// 	};
// };

// const getLocationFilters = (location) => {
// 	if (!location?.zipCode || !location?.radius) return {};
//
// 	return {
// 		'sites.org_coordinates': {
// 			zipCode: location.zipCode,
// 			radius: location.radius,
// 		},
// 	};
// };

// const transformFiltersToApi = (filters) => {
// 	let apiFilters = {};
//
// 	// Age filter handling
// 	if (filters.age) {
// 		apiFilters['eligibility.structured.min_age_in_years_lte'] = filters.age;
// 		apiFilters['eligibility.structured.max_age_in_years_gte'] = filters.age;
// 	}
//
// 	return {
// 		...apiFilters,
// 		...getLocationFilters(filters.location),
// 	};
// };
//
// const getFiltersFromURL = (params) => {
// 	const filters = {};
//
// 	// Handle age filter params
// 	// const ageValues = params.getAll('age');
// 	// if (ageValues.length) {
// 	// 	filters.age = ageValues;
// 	// }
// 	const age = params.get('age');
// 	if (age) {
// 		filters.age = age;
// 	}
//
// 	// Handle location params
// 	const zipCode = params.get('zip');
// 	const radius = params.get('radius');
// 	if (zipCode || radius) {
// 		filters.location = {
// 			zipCode: zipCode || '',
// 			radius: radius ? parseInt(radius, 10) : null,
// 		};
// 		}
//
// 	return filters;
// };
// const updateURLWithFilters = (filters, existingSearch, isInitialLoad = false) => {
// 	// Start with empty params
// 	const params = new URLSearchParams();
//
// 	// First, copy all existing non-filter params
// 	const existingParams = new URLSearchParams(existingSearch);
// 	for (const [key, value] of existingParams.entries()) {
// 		if (!['age', 'zip', 'radius'].includes(key)) {
// 			params.set(key, value);
// 		}
// 	}
//
// 	// Set pn=1 only for non-initial loads
// 	if (!isInitialLoad) {
// 		params.set('pn', '1');
// 	}
//
// 	// Add filter params
// 	// if (filters.age?.length) {
// 	// 	filters.age.forEach((age) => params.append('age', age));
// 	// }
// 	if (filters.age) {
// 		params.set('age', filters.age.toString());
// 	} else {
// 		params.delete('age');
// 	}
//
// 	if (filters.location?.zipCode) {
// 		params.set('zip', filters.location.zipCode);
// 		if (filters.location.radius) {
// 			params.set('radius', filters.location.radius.toString());
// 		}
// 	}
//
// 	return params.toString();
// };
// const getAgeRangeFilters = (ageFilters, baseParams = {}) => {
// 	if (!ageFilters?.length) return {};
//
// 	const path = 'eligibility.structured';
// 	const filters = {};
//
// 	// Helper to add a complete query (base params + age filter)
// 	const addQuery = (prefix = '', ageGroup) => {
// 		// Add all base parameters with prefix
// 		Object.entries(baseParams).forEach(([key, value]) => {
// 			filters[`${prefix}${key}`] = value;
// 		});
//
// 		// Add age-specific filters with same prefix
// 		switch (ageGroup) {
// 			case 'child':
// 				filters[`${prefix}${path}.min_age_in_years_lte`] = 17;
// 				break;
// 			case 'adult':
// 				filters[`${prefix}${path}.min_age_in_years_lte`] = 64;
// 				filters[`${prefix}${path}.max_age_in_years_gte`] = 18;
// 				break;
// 			case 'older_adult':
// 				filters[`${prefix}${path}.max_age_in_years_gte`] = 65;
// 				break;
// 		}
// 	};
//
// 	// Add first age filter with base parameters (no prefix)
// 	addQuery('', ageFilters[0]);
//
// 	// Add parallel queries for additional age filters
// 	ageFilters.slice(1).forEach((filter, index) => {
// 		const prefix = 'outer_or_'.repeat(index + 1);
// 		addQuery(prefix, filter);
// 	});
//
// 	return filters;
// };

// const getAgeRangeFilters = (ageFilters) => {
// 	if (!ageFilters?.length) return {};
//
// 	let filters = {};
// 	let minAge = null;
// 	let maxAge = null;
//
// 	// Anything avialable to a 17 year old or below. Solid.
// 	if (ageFilters.includes('child')) {
// 		minAge = Math.min(minAge || 17, 17);
// 		filters['eligibility.structured.min_age_in_years_lte'] = minAge; // anything below this included
// 	}
//
// 	// Solid.
// 	if (ageFilters.includes('adult')) {
// 		minAge = Math.min(minAge || 18, 18);
// 		maxAge = Math.max(maxAge || 64, 64);
// 		filters['eligibility.structured.min_age_in_years_lte'] = maxAge;
// 		filters['eligibility.structured.max_age_in_years_gte'] = minAge;
// 	}
// 	// Maximim age allowesi greater than or equal to 65. Max age 64 and below. Solid.
// 	if (ageFilters.includes('older_adult')) {
// 		maxAge = Math.max(maxAge || 65, 65);
// 		// filters['eligibility.structured.min_age_in_years_gte'] = minAge;
// 		filters['eligibility.structured.max_age_in_years_gte'] = maxAge;
// 	}
//
// 	// // WE want the range captured by child and adult. THis hsould be OR, butits doing AND Wrong.
// 	// if (ageFilters.includes('child') && ageFilters.includes('older_adult')) {
// 	// 	maxAge = Math.max(maxAge || 65, 65);
// 	// 	filters['eligibility.structured.max_age_in_years_gte'] = maxAge;
// 	// }
//
// 	// // Solid.
// 	// if (ageFilters.includes('adult') && ageFilters.includes('child')) {
// 	// 	// minAge = Math.min(minAge || 18, 18);
// 	// 	// maxAge = Math.max(maxAge || 64, 64);
// 	// 	// filters['eligibility.structured.min_age_in_years_lte'] = minAge;
// 	// 	// filters['eligibility.structured.max_age_in_years_gte'] = maxAge;
// 	// 	filters['eligibility.structured.min_age_in_years_lte'] = 64; //anything beliw this included. unapted
// 	// }
// 	//
// 	// // WE want the range captured by child and adult. Solid. but weird..
// 	// if (ageFilters.includes('adult') && ageFilters.includes('older_adult')) {
// 	// 	// minAge = Math.min(minAge || 18, 18);
// 	// 	// maxAge = Math.max(maxAge || 64, 64);
// 	// 	// filters['eligibility.structured.min_age_in_years_lte'] = 999; // Anything below 1000
// 	// 	filters['eligibility.structured.max_age_in_years_gte'] = 18; // anything above 18, uncapped
// 	// }
//
// 	// We want all trials, aka same as no filer. Solid.
// 	if (ageFilters.includes('child') && ageFilters.includes('older_adult') && ageFilters.includes('adult')) {
// 		filters = {};
// 		minAge = null;
// 		maxAge = null;
// 	}
// 	//
// 	// if (minAge !== null) {
// 	// 	filters['eligibility.structured.min_age_in_years_lte'] = minAge;
// 	// }
// 	// if (maxAge !== null) {
// 	// 	filters['eligibility.structured.max_age_in_years_gte'] = maxAge;
// 	// }
//
// 	return filters;
// };
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
			// eslint-disable-next-line no-case-declarations
			const { filterType, value } = action.payload;
			// eslint-disable-next-line no-case-declarations
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

	const [isApplyingFilters, setIsApplyingFilters] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	// Add state for zip coordinates
	const [zipCoords, setZipCoords] = useState(null);
	const [hasInvalidZip, setHasInvalidZip] = useState(false);

	// Create updateFunc for useZipConversion
	const updateZipState = (key, value) => {
		if (key === 'zipCoords') {
			setZipCoords(value);
		} else if (key === 'hasInvalidZip') {
			setHasInvalidZip(value);
		}
	};

	const [{ getZipCoords, isError }] = useZipConversion(updateZipState);
	// const [isInitialLoad, setIsInitialLoad] = useState(true);

	// Effect to handle zip code updates
	useEffect(() => {
		if (state.appliedFilters?.location?.zipCode) {
			getZipCoords(state.appliedFilters.location.zipCode);
		} else {
			setZipCoords(null);
			setHasInvalidZip(false);
		}
	}, [state.appliedFilters?.location?.zipCode]);

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
			// setIsInitialLoad(false);
		}
	}, []);

	useEffect(() => {
		// Meaning, we have not modified the form, and we shuld search
		// AKA its initial
		if (!state.isDirty && state.shouldSearch) {
			const params = new URLSearchParams(window.location.search);

			// Handle filter updates
			if (Object.keys(state.appliedFilters).length > 0) {
				console.log(state.appliedFilters);

				// // Set pn=1 only for non-initial loads
				// if (!state.isInitialLoad) {
				// 	console.log(state.isInitialLoad);
				// 	console.log('HERE');
				// 	params.set('pn', '1');
				// } else {
				// 	console.log(state.isInitialLoad);
				// 	console.log('HERE nothing');
				// 	dispatch({
				// 		type: FilterActionTypes.APPLY_FILTERS,
				// 		payload: { isInitialLoad: false },
				// 	});
				// }

				// Reset page to 1 when filters actively change
				params.set('pn', '1');

				// Clear and re-add filter params
				['age', 'zip', 'radius'].forEach((param) => params.delete(param));

				// Add age filters
				if (state.appliedFilters.age) {
					params.append('age', state.appliedFilters.age);
				}

				// Add location filter
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

	const getLocationFilters = (location) => {
		// Early return if any required values are missing
		if (!location?.zipCode || !location?.radius || !zipCoords || hasInvalidZip) {
			return {};
		}

		// Validate coordinate structure - using 'long' instead of 'lon'
		if (!zipCoords.lat || !zipCoords.long) {
			console.error('Invalid coordinate structure:', zipCoords);
			return {};
		}

		// Convert coordinates safely using 'long' for longitude
		const lat = String(zipCoords.lat);
		const lon = String(zipCoords.long); // Changed from lon to long

		// Validate converted values
		if (!lat || !lon) {
			console.error('Invalid coordinate values after conversion:', { lat, lon });
			return {};
		}

		return {
			'sites.org_coordinates_lat': lat,
			'sites.org_coordinates_lon': lon, // API still expects 'lon'
			'sites.org_coordinates_dist': `${location.radius}mi`,
		};
	};

	const transformFiltersToApi = (filters) => {
		let apiFilters = {};

		// Age filter handling
		if (filters.age) {
			apiFilters['eligibility.structured.min_age_in_years_lte'] = filters.age;
			apiFilters['eligibility.structured.max_age_in_years_gte'] = filters.age;
		}

		return {
			// ...getAgeRangeFilters(filters.age, baseParams),
			// ...getAgeFilters(filters.age),
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
		isZipError: isError || hasInvalidZip,
		isApplyingFilters,
		setIsApplyingFilters,
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

	const { state, dispatch, getCurrentFilters, isApplyingFilters, setIsApplyingFilters } = context;

	const setFilter = (filterType, value) =>
		dispatch({
			type: FilterActionTypes.SET_FILTER,
			payload: { filterType, value },
		});

	const applyFilters = async () => {
		setIsApplyingFilters(true);
		dispatch({ type: FilterActionTypes.APPLY_FILTERS });
		// Give enough time for visual feedback
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
	};
}
