/* eslint-disable */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../context/FilterContext/FilterContext';
import ZipCodeFilter from '../ZipCodeFilter';
import AgeFilter from '../AgeFilter/AgeFilter';
import { FILTER_CONFIG } from '../../config/filterConfig';
import { FilterActionTypes } from '../../context/FilterContext/FilterContext';
import { PAGE_FILTER_CONFIGS } from '../../config/pageFilterConfigs';
import './Sidebar.scss';
import { useStateValue } from '../../../../store/store';
import { useLocation } from 'react-router';
import { FILTER_EVENTS, INTERACTION_TYPES } from '../../tracking/filterEvents';
import { useFilterCounters } from '../../hooks/useFilterCounters';
import { formatLocationString, getAppliedFieldsString } from '../../utils/analytics';
import { useTracking } from 'react-tracking';
import { URL_PARAM_MAPPING } from '../../constants/urlParams';
import { isValidZipFormat } from '../../utils/locationUtils';

const Sidebar = ({ pageType = 'Disease', isDisabled = false, initialTotalCount = null, onFilterApplied = () => {}, onFilterCleared = () => {} }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { state, dispatch, applyFilters, enabledFilters = [], listingInfo, fetchState } = useFilters();
	const { filters, isDirty } = state;
	const [hasInteracted, setHasInteracted] = useState(false);
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [getZipValidationStatus, setGetZipValidationStatus] = useState(null);
	const { filterAppliedCounter, filterRemovedCounter, incrementAppliedCounter, incrementRemovedCounter } = useFilterCounters();
	const tracking = useTracking();

	const validateFilters = () => {
		const errors = {};

		if (filters.age && (filters.age < 0 || filters.age > 120)) {
			errors.age = 'Invalid age value';
		}

		if (filters.location?.zipCode) {
			if (!isValidZipFormat(filters.location.zipCode)) {
				errors.location = 'Invalid ZIP code format';
			}
			if (!filters.location.radius) {
				errors.radius = 'Radius is required when ZIP code is provided';
			}
		}

		return errors;
	};

	const getErrorFields = (errors) => {
		return Object.keys(errors)
			.map((field) => {
				switch (field) {
					case 'age':
						return URL_PARAM_MAPPING.age.shortCode;
					case 'location':
					case 'radius':
						return URL_PARAM_MAPPING.zipCode.shortCode;
					default:
						return field;
				}
			})
			.join(',');
	};

	const trackFilterStart = (fieldName) => {
		if (!hasInteracted) {
			tracking.trackEvent({
				type: 'Other',
				event: FILTER_EVENTS.START,
				linkName: FILTER_EVENTS.START,
				interactionType: INTERACTION_TYPES.FILTER_START,
				fieldInteractedWith: fieldName,
			});
			setHasInteracted(true);
		}
	};

	const handleAgeFilterChange = (e) => {
		const value = e.target.value;
		if (value >= FILTER_CONFIG.age.min && value <= FILTER_CONFIG.age.max) {
			dispatch({
				type: FilterActionTypes.SET_FILTER,
				payload: {
					filterType: 'age',
					value: value,
				},
			});
		}
	};

	const handleZipCodeChange = (value) => {
		dispatch({
			type: FilterActionTypes.SET_FILTER,
			payload: {
				filterType: 'location',
				value: {
					...filters.location,
					zipCode: value,
					radius: value ? filters.location.radius || '100' : null,
				},
			},
		});
	};

	const handleRadiusChange = (e) => {
		dispatch({
			type: FilterActionTypes.SET_FILTER,
			payload: {
				filterType: 'location',
				value: {
					...filters.location,
					radius: e.target.value,
				},
			},
		});
	};

	const handleClearFilters = () => {
		incrementRemovedCounter();

		// Notify parent component about filter clearing with counter value
		onFilterCleared(filterRemovedCounter + 1, filterAppliedCounter);

		dispatch({ type: FilterActionTypes.CLEAR_FILTERS });
		dispatch({ type: FilterActionTypes.APPLY_FILTERS });
	};

	const handleApplyFilters = async () => {
		if (!isDirty) return;

		// Clear any existing error state
		const errors = validateFilters();
		const hasErrors = Object.keys(errors).length > 0;

		// If there are validation errors in the form values
		if (hasErrors) {
			tracking.trackEvent({
				type: 'Other',
				event: FILTER_EVENTS.APPLY_ERROR,
				linkName: FILTER_EVENTS.APPLY_ERROR,
				interactionType: INTERACTION_TYPES.APPLIED_WITH_ERRORS,
				errorField: getErrorFields(errors)
			});
			return;
		}

		// Handle ZIP code validation specifically
		if (filters.location?.zipCode) {
			// If we have a ZIP code, we must have validation status
			if (!getZipValidationStatus) {
				console.error('Missing ZIP validation status');
				return;
			}

			// Get the latest validation status
			const validationResult = getZipValidationStatus();

			// If ZIP is invalid, track error and stop
			if (!validationResult.isValid) {
				tracking.trackEvent({
					type: 'Other',
					event: FILTER_EVENTS.APPLY_ERROR,
					linkName: FILTER_EVENTS.APPLY_ERROR,
					interactionType: INTERACTION_TYPES.APPLIED_WITH_ERRORS,
					errorField: 'zip'
				});
				return;
			}

			// Set coordinates before proceeding
			if (validationResult.coordinates) {
				dispatch({
					type: FilterActionTypes.SET_ZIP_COORDINATES,
					payload: validationResult.coordinates
				});
			}
		}

		// Capture current filter values for tracking
		const currentFilters = { ...filters };

		// Track successful application
		incrementAppliedCounter();
		onFilterApplied(currentFilters, filterAppliedCounter + 1);

		// Apply filters and wait for it to complete
		await applyFilters();

		// Update URL parameters
		const params = new URLSearchParams(window.location.search);

		// Handle age parameter
		if (filters.age && filters.age.toString().trim() !== '') {
			params.set(URL_PARAM_MAPPING.age.shortCode, filters.age);
		} else {
			params.delete(URL_PARAM_MAPPING.age.shortCode);
		}

		// Reset to page 1 when filters change
		params.set('pn', '1');

		// Update URL
		navigate(`${window.location.pathname}?${params.toString()}`);
	};

	// Handle zipcode validation change, doing it like this to keep the logic modular
	const handleZipValidationChange = useCallback((validationOrResult) => {
		// If we received a validation function, store it for later use
		if (typeof validationOrResult === 'function') {
			setGetZipValidationStatus(() => validationOrResult);
			return;
		}

		// If we received a direct validation result (from URL params)
		if (validationOrResult && typeof validationOrResult === 'object') {
			// Store the validation status
			setGetZipValidationStatus(() => () => validationOrResult);

			// If it's valid, immediately set the coordinates
			if (validationOrResult.isValid && validationOrResult.coordinates) {
				dispatch({
					type: FilterActionTypes.SET_ZIP_COORDINATES,
					payload: validationOrResult.coordinates
				});
			}
		}
	}, [dispatch]);

	const renderFilter = (filterType, isDisabled) => {
		switch (filterType) {
			case 'age':
				return <AgeFilter value={filters.age} onChange={handleAgeFilterChange} onFocus={() => trackFilterStart(filterType)} disabled={isDisabled} />;
			case 'location':
				return <ZipCodeFilter
					zipCode={filters.location.zipCode}
					radius={filters.location.radius}
					onZipCodeChange={handleZipCodeChange}
					onRadiusChange={handleRadiusChange}
					onValidationChange={handleZipValidationChange}
					onFocus={() => trackFilterStart(filterType)}
					disabled={isDisabled}
				/>;
			default:
				return null;
		}
	};

	const minusSign = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="2" viewBox="0 0 14 2" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 2H0V0H14V2Z" fill="%231B1B1B"/></svg>')`;
	const plusSign = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="%231B1B1B"/></svg>')`;

	const filterBtn = document.getElementById('filterButton');
	const content = document.getElementById('accordionContent');

	const accordionOnClick = () => {
		filterBtn.classList.toggle("is-closed");
		if (!filterBtn.classList.contains("is-closed")) {
			filterBtn.style.backgroundImage = minusSign;
			content.hidden = false;
		} else {
			filterBtn.style.backgroundImage = plusSign;
			content.hidden = true;
		}
	};

	const setMobileOnClick = () => {
		const mobileSize = '(max-width: 1023px)';
		const mediaQueryMobile = window.matchMedia(mobileSize);

		function handleMediaQueryChange(event) {
			if (event.matches) {
				filterBtn.addEventListener('click', accordionOnClick);
			} else {
				if (filterBtn.classList.contains("is-closed"))
				{
					filterBtn.classList.remove("is-closed");
					filterBtn.style.backgroundImage = minusSign;
				}

				filterBtn.removeEventListener('click', accordionOnClick);
				content.removeAttribute('hidden');
			}
		}

		handleMediaQueryChange(mediaQueryMobile);
		mediaQueryMobile.addEventListener('change', handleMediaQueryChange);
	};

	const hasActiveFilters = () => {
		const hasAgeFilter = Array.isArray(filters.age) ? filters.age.some((age) => age !== '') : filters.age && filters.age !== '';

		const hasLocationFilter = Boolean(filters.location?.zipCode);

		return hasAgeFilter || hasLocationFilter;
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const age = params.get(URL_PARAM_MAPPING.age.shortCode);

		if (age) {
			dispatch({
				type: FilterActionTypes.SET_FILTER,
				payload: {
					filterType: 'age',
					value: age,
				},
			});
			dispatch({ type: FilterActionTypes.APPLY_FILTERS });
		}
	}, []);

	if (!pageType || !PAGE_FILTER_CONFIGS[pageType]) {
		console.error('Invalid pageType:', pageType);
		return null;
	}

	return (
		<aside className="ctla-sidebar">
			<div className="usa-accordion ctla-sidebar__header">
				<h2 className="usa-accordion__heading ctla-sidebar__title">
					<button id="filterButton" type="button" className="usa-accordion__button" aria-expanded="true" aria-controls="accordionContent" onClick={setMobileOnClick}>
						Filter Trials
					</button>
				</h2>
			</div>
			<div id="accordionContent" className="usa-accordion__content ctla-sidebar__content">
				{PAGE_FILTER_CONFIGS[pageType].order.map((filterType) => {
					if (enabledFilters.includes(filterType)) {
						return <div key={filterType}>{renderFilter(filterType, isDisabled)}</div>;
					}
					return null;
				})}
				<div className="ctla-sidebar__actions">
					<button className="usa-button ctla-sidebar__button--clear" onClick={handleClearFilters} disabled={isDisabled || !hasActiveFilters()}>
						Clear Filters
					</button>
					<button className="usa-button ctla-sidebar__button--apply" onClick={handleApplyFilters} disabled={isDisabled || !isDirty}>
						Apply Filters
					</button>
				</div>
			</div>
		</aside>
	);
};


export default Sidebar;
