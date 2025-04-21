/**
 * @file This file contains utility functions related to analytics tracking for filter interactions.
 * It includes functions to track filter changes, applications, clears, and format filter data for tracking.
 */
import { URL_PARAM_MAPPING } from '../constants/urlParams';

/**
 * Tracks an event when a filter's value is changed by the user.
 *
 * @param {string} filterType - The type of filter being changed (e.g., 'age', 'location').
 * @param {*} value - The new value of the filter.
 * @param {object} analytics - The analytics tracking object (e.g., from react-tracking).
 */
export const trackFilterChange = (filterType, value, analytics) => {
	analytics.trackEvent({
		type: 'Other', // Analytics event type
		event: 'TrialListingApp:Filter:Change', // Specific event name
		filterType, // The type of filter modified
		filterValue: value, // The new value set
	});
};

/**
 * Tracks an event when the user applies the selected filters.
 *
 * @param {Array<object>} appliedFilters - An array of the currently applied filter objects.
 * @param {object} analytics - The analytics tracking object.
 */
export const trackFilterApply = (appliedFilters, analytics) => {
	analytics.trackEvent({
		type: 'Other',
		event: 'TrialListingApp:Filter:Apply', // Specific event name
		filterCount: appliedFilters.length, // Number of filters applied
		filters: appliedFilters, // The actual filter objects applied
	});
};

/**
 * Tracks an event when the user clears all filters.
 *
 * @param {object} analytics - The analytics tracking object.
 */
export const trackFilterClear = (analytics) => {
	analytics.trackEvent({
		type: 'Other',
		event: 'TrialListingApp:Filter:Clear', // Specific event name
	});
};

/**
 * Formats the location filter object into a pipe-delimited string for analytics.
 * Example: "z|20850|100"
 *
 * @param {object} location - The location filter object containing zipCode and radius.
 * @returns {string} A formatted string representing the location filter, or an empty string if invalid.
 */
export const formatLocationString = (location) => {
	// Return empty string if zipCode or radius is missing
	if (!location?.zipCode || !location?.radius) return '';
	// Construct the string using the short code for zip code
	return `${URL_PARAM_MAPPING.zipCode.shortCode}|${location.zipCode}|${location.radius}`;
};

/**
 * Creates a colon-delimited string listing the short codes of currently applied filters.
 * Example: "a:loc" if age and location filters are applied.
 *
 * @param {object} filters - The current filter state object.
 * @returns {string} A colon-delimited string of applied filter short codes.
 */
export const getAppliedFieldsString = (filters) => {
	const fields = [];
	// Check if age filter is applied (assuming non-empty value means applied)
	if (filters.age) fields.push(URL_PARAM_MAPPING.age.shortCode);
	// Check if location filter is applied (zipCode exists)
	if (filters.location?.zipCode) fields.push('loc'); // Using 'loc' as a general location indicator
	// Add checks for other filter types here if needed
	// if (filters.subtype?.length > 0) fields.push(URL_PARAM_MAPPING.subtype.shortCode);
	return fields.join(':'); // Join the short codes with colons
};
