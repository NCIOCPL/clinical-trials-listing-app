/* eslint-disable */

import React, { useEffect, useState } from 'react';
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

const Sidebar = ({ pageType = 'Disease' }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { state, dispatch, applyFilters, enabledFilters = [], listingInfo, fetchState } = useFilters();
	const { filters, isDirty } = state;
	const [hasInteracted, setHasInteracted] = useState(false);
	const { filterAppliedCounter, filterRemovedCounter, incrementAppliedCounter, incrementRemovedCounter } = useFilterCounters();
	const tracking = useTracking();
	// const [{ canonicalHost, language, analyticsChannel, analyticsContentGroup, analyticsPublishedDate, siteName }] = useStateValue();
	//
	// const getBaseAnalyticsData = () => ({
	// 	name: canonicalHost?.replace(/^(http|https):\/\//, '') + location.pathname,
	// 	title: siteName, // Fallback to siteName since pageTitle may not be available
	// 	metaTitle: siteName,
	// 	language: language === 'en' ? 'english' : 'spanish',
	// 	channel: analyticsChannel,
	// 	contentGroup: analyticsContentGroup,
	// 	publishedDate: analyticsPublishedDate,
	// 	trialListingPageType: pageType,
	// 	type: 'nciAppModulePage',
	// });
	const validateFilters = () => {
		const errors = {};

		if (filters.age && (filters.age < 0 || filters.age > 120)) {
			errors.age = 'Invalid age value';
		}

		if (filters.location?.zipCode) {
			if (!/^\d{5}$/.test(filters.location.zipCode)) {
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
						return 'a';
					case 'location':
					case 'radius':
						return 'z';
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
				data: {
					interactionType: INTERACTION_TYPES.FILTER_START,
					fieldInteractedWith: fieldName,
				},
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

	const handleZipCodeChange = (e) => {
		dispatch({
			type: FilterActionTypes.SET_FILTER,
			payload: {
				filterType: 'location',
				value: {
					...filters.location,
					zipCode: e.target.value,
					radius: e.target.value ? filters.location.radius || '100' : null,
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
		tracking.trackEvent({
			type: 'Other',
			event: FILTER_EVENTS.MODIFY,
			data: {
				interactionType: INTERACTION_TYPES.CLEAR_ALL,
				fieldRemoved: 'all',
				filterAppliedCounter,
				filterRemovedCounter,
				numberResults: fetchState?.total || 0,
			},
		});
		dispatch({ type: FilterActionTypes.CLEAR_FILTERS });
		dispatch({ type: FilterActionTypes.APPLY_FILTERS });
	};

	const handleApplyFilters = async () => {
		if (isDirty) {
			const validationErrors = validateFilters();

			if (Object.keys(validationErrors).length > 0) {
				tracking.trackEvent({
					type: 'Other',
					event: FILTER_EVENTS.APPLY_ERROR,
					data: {
						interactionType: INTERACTION_TYPES.APPLIED_WITH_ERRORS,
						errorField: getErrorFields(validationErrors),
					},
				});
				return;
			}

			incrementAppliedCounter();
			await applyFilters();

			tracking.trackEvent({
				type: 'Other',
				event: FILTER_EVENTS.APPLY,
				data: {
					interactionType: INTERACTION_TYPES.FILTER_APPLIED,
					numberResults: fetchState?.total || 0,
					fieldsUsed: getAppliedFieldsString(filters),
					age: filters.age,
					loc: formatLocationString(filters.location),
					filterAppliedCounter,
					filterRemovedCounter,
				},
			});
			const params = new URLSearchParams(window.location.search);
			if (filters.age) {
				params.set('age', filters.age);
			} else {
				params.delete('age');
			}
			params.set('pn', '1');
			navigate(`${window.location.pathname}?${params.toString()}`);
		}
	};

	const renderFilter = (filterType) => {
		switch (filterType) {
			case 'age':
				return <AgeFilter value={filters.age} onChange={handleAgeFilterChange} onFocus={() => trackFilterStart(filterType)} />;
			case 'location':
				return <ZipCodeFilter zipCode={filters.location.zipCode} radius={filters.location.radius} onZipCodeChange={handleZipCodeChange} onRadiusChange={handleRadiusChange} onFocus={() => trackFilterStart(filterType)} />;
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
		const age = params.get('age');

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
						return <div key={filterType}>{renderFilter(filterType)}</div>;
					}
					return null;
				})}
				<div className="ctla-sidebar__actions">
					<button className="usa-button ctla-sidebar__button--clear" onClick={handleClearFilters} disabled={!hasActiveFilters()}>
						Clear Filters
					</button>
					<button className="usa-button ctla-sidebar__button--apply" onClick={handleApplyFilters} disabled={!isDirty}>
						Apply Filters
					</button>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
