/**
 * @file EDDL Analytics Helper for Clinical Trials Listing App
 * This file contains functions to track EDDL events for filter interactions,
 * result clicks, and filter clearing according to the requirements.
 */

import { URL_PARAM_MAPPING } from '../constants/urlParams';

// Counter state for tracking applied/removed counts across the session
let filterAppliedCounter = 0;
let filterRemovedCounter = 0;
let hasHadFirstInteraction = false;

// Debouncing mechanism to prevent duplicate events
let lastEventTimestamp = 0;
let lastEventType = null;
let lastEventFilters = null;

/**
 * Resets the analytics counters (useful for testing)
 */
export const resetAnalyticsCounters = () => {
	filterAppliedCounter = 0;
	filterRemovedCounter = 0;
	hasHadFirstInteraction = false;
	lastEventTimestamp = 0;
	lastEventType = null;
	lastEventFilters = null;
};

/**
 * Gets the current counter values
 */
export const getAnalyticsCounters = () => ({
	filterAppliedCounter,
	filterRemovedCounter,
	hasHadFirstInteraction,
});

/**
 * Formats location filter data into the required format
 * @param {object} location - Location filter object with zipCode and radius
 * @returns {string} Formatted string like "z|20850|100" or empty string
 */
const formatLocationFilter = (location) => {
	if (!location?.zipCode || !location?.radius) return '';
	return `${URL_PARAM_MAPPING.zipCode.shortCode}|${location.zipCode}|${location.radius}`;
};

/**
 * Gets the fields used string for analytics
 * @param {object} filters - Applied filters object
 * @returns {string} Colon-delimited string of filter codes (e.g., "t:st:stg:d:a:loc")
 */
const getFieldsUsedString = (filters) => {
	const fields = [];

	// Add fields in the specified order per requirements
	if (filters.maintype?.length > 0) fields.push('t');
	if (filters.subtype?.length > 0) fields.push('st');
	if (filters.stage?.length > 0) fields.push('stg');
	if (filters.drugIntervention?.length > 0) fields.push('d');
	if (filters.age) fields.push('a');
	if (filters.location?.zipCode) fields.push('loc');

	return fields.join(':');
};

/**
 * Formats filter values for analytics tracking
 * @param {object} filters - Applied filters object
 * @returns {object} Formatted filter values for analytics
 */
const formatFilterValues = (filters) => {
	const analyticsData = {};

	// Primary Cancer Type - use 't' field code per requirements
	if (filters.maintype?.length > 0) {
		const maintype = filters.maintype[0];
		analyticsData.t = `t|${maintype}`;
	}

	// Subtype - use 'st' field code per requirements
	if (filters.subtype?.length > 0) {
		const subtype = filters.subtype[0];
		analyticsData.st = `st|${subtype}`;
	}

	// Stage - use 'stg' field code per requirements
	if (filters.stage?.length > 0) {
		const stage = filters.stage[0];
		analyticsData.stg = `stg|${stage}`;
	}

	// Drug/Drug Family - use 'd' field code per requirements
	if (filters.drugIntervention?.length > 0) {
		// If multiple drugs, pass the count, otherwise pass the drug name
		if (filters.drugIntervention.length > 1) {
			analyticsData.d = `d|${filters.drugIntervention.length}`;
		} else {
			const drug = filters.drugIntervention[0];
			const drugName = drug.name || drug;
			analyticsData.d = `d|${drugName}`;
		}
	}

	// Age - use 'a' field code per requirements
	if (filters.age) {
		analyticsData.a = `a|${filters.age}`;
	}

	// Location - keep as 'loc' field code per requirements
	if (filters.location?.zipCode) {
		analyticsData.loc = formatLocationFilter(filters.location);
	}

	return analyticsData;
};

// Removed unused getPageData function

/**
 * Tracks the EDDL:TrialListingApp:FilterApply event
 * This is called when filters are auto-applied after user interaction
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.filters - Applied filters
 * @param {number} params.resultCount - Number of results after filter application
 * @param {object} params.listingInfo - Page listing information
 * @param {string} params.lastChangedFilter - The filter that triggered the auto-apply
 * @param {string} params.fieldAdded - The field code that was added (for add/modify actions)
 * @param {string} params.fieldRemoved - The field code that was removed (for clear/remove actions)
 * @param {string} params.interactionType - Override for interaction type (e.g., 'clear filters', 'filter removed')
 * @param {boolean} params.isUserInteraction - Whether this is a direct user interaction (default: true)
 */
export const trackFilterApply = ({ filters, resultCount, fieldAdded = null, fieldRemoved = null, interactionType = null, isUserInteraction = true }) => {
	// Don't track if this is not a user interaction (e.g., initial page load with URL params)
	if (!isUserInteraction) {
		return;
	}

	// Check for duplicate events within 3 seconds
	const now = Date.now();
	const filtersString = JSON.stringify(filters);

	if (lastEventType === 'apply' && lastEventFilters === filtersString && now - lastEventTimestamp < 3000) {
		return;
	}

	// Update debouncing variables
	lastEventTimestamp = now;
	lastEventType = 'apply';
	lastEventFilters = filtersString;

	// Increment appropriate counter based on action type
	if (fieldRemoved) {
		// Filter removal or clear action - increment removed counter
		filterRemovedCounter++;
	} else {
		// Filter addition or modification - increment applied counter
		filterAppliedCounter++;
		hasHadFirstInteraction = true;
	}

	// Determine interaction type if not provided
	let finalInteractionType = interactionType;
	if (!finalInteractionType) {
		finalInteractionType = !hasHadFirstInteraction ? 'filter applied' : 'filter modified';
	}

	// Create data object with alphabetical field order to match test expectations
	const filterValues = formatFilterValues(filters);
	const dataObject = {
		filterRemovedCounter,
		filterAppliedCounter,
		// Add filter fields in alphabetical order: a, d, loc, st, stg, t
		...(filterValues.a && { a: filterValues.a }),
		...(filterValues.d && { d: filterValues.d }),
		...(filterValues.loc && { loc: filterValues.loc }),
		...(filterValues.st && { st: filterValues.st }),
		...(filterValues.stg && { stg: filterValues.stg }),
		...(filterValues.t && { t: filterValues.t }),
		fieldsUsed: getFieldsUsedString(filters),
		numberResults: resultCount || 0,
		interactionType: finalInteractionType,
		// Add fieldAdded if present
		...(fieldAdded && { fieldAdded }),
		// Add fieldRemoved if present
		...(fieldRemoved && { fieldRemoved }),
	};

	const eventData = {
		linkName: 'TrialListingApp:FilterApply',
		event: 'TrialListingApp:FilterApply',
		type: 'Other',
		data: dataObject,
	};

	// Use the existing EDDL analytics handler if it exists, otherwise direct push
	if (typeof window !== 'undefined') {
		// First try to use the existing analytics handler
		window.NCIDataLayer = window.NCIDataLayer || [];
		window.NCIDataLayer.push(eventData);

		// Also push to regular dataLayer for compatibility
		if (window.dataLayer) {
			window.dataLayer.push(eventData);
		}
	}

	return eventData;
};

/**
 * Tracks the EDDL:TrialListingApp:ResultClick event
 * This is called when a user clicks on a trial result
 *
 * @param {object} params - Parameters for tracking
 * @param {string} params.trialId - ID of the clicked trial
 * @param {string} params.trialTitle - Title of the clicked trial
 * @param {number} params.position - Position of the result in the list
 * @param {object} params.filters - Currently applied filters
 * @param {number} params.resultCount - Total number of results displayed
 * @param {object} params.listingInfo - Page listing information
 */
export const trackResultClick = ({ position, filters, resultCount }) => {
	// Create data object with alphabetical field order to match test expectations
	const dataObject = {
		age: filters?.age || 'none',
		fieldsUsed: getFieldsUsedString(filters) || 'none',
		filterAppliedCounter,
		filterRemovedCounter,
		loc: formatLocationFilter(filters?.location) || 'none',
		numberResults: resultCount || 0,
		position,
	};

	const eventData = {
		linkName: 'TrialListingApp:ResultClick',
		event: 'TrialListingApp:ResultClick',
		type: 'Other',
		data: dataObject,
	};

	// Use the existing EDDL analytics handler if it exists, otherwise direct push
	if (typeof window !== 'undefined') {
		// First try to use the existing analytics handler
		window.NCIDataLayer = window.NCIDataLayer || [];
		window.NCIDataLayer.push(eventData);

		// Also push to regular dataLayer for compatibility
		if (window.dataLayer) {
			window.dataLayer.push(eventData);
		}
	}

	return eventData;
};

/**
 * Tracks the EDDL:TrialListingApp:FilterClear event
 * This is called when filters are cleared (individual or all)
 *
 * @param {object} params - Parameters for tracking
 * @param {string} params.clearType - 'individual' or 'all'
 * @param {string} params.fieldRemoved - The field that was removed (or 'all')
 * @param {object} params.filters - Filters after removal
 * @param {number} params.resultCount - Number of results after filter removal
 * @param {object} params.listingInfo - Page listing information
 */
export const trackFilterClear = ({ clearType, fieldRemoved, resultCount }) => {
	// Increment counter
	filterRemovedCounter++;

	const interactionType = clearType === 'all' ? 'clear all filters' : 'filter removed';

	// Create data object with alphabetical field order to match test expectations
	const dataObject = {
		filterRemovedCounter,
		filterAppliedCounter,
		fieldRemoved: fieldRemoved || 'all',
		interactionType,
		numberResults: resultCount || 0,
	};

	const eventData = {
		linkName: 'TrialListingApp:FilterClear',
		event: 'TrialListingApp:FilterClear',
		type: 'Other',
		data: dataObject,
	};

	// Use the existing EDDL analytics handler if it exists, otherwise direct push
	if (typeof window !== 'undefined') {
		// First try to use the existing analytics handler
		window.NCIDataLayer = window.NCIDataLayer || [];
		window.NCIDataLayer.push(eventData);

		// Also push to regular dataLayer for compatibility
		if (window.dataLayer) {
			window.dataLayer.push(eventData);
		}
	}

	return eventData;
};

/**
 * Maps filter type to analytics field code
 * @param {string} filterType - The filter type
 * @returns {string} The analytics field code
 */
export const getFieldCode = (filterType) => {
	const mapping = {
		age: 'a',
		location: 'loc',
		maintype: 't',
		subtype: 'st',
		stage: 'stg',
		drugIntervention: 'd',
	};
	return mapping[filterType] || filterType;
};
