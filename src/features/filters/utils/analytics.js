import { URL_PARAM_MAPPING } from '../constants/urlParams';

export const trackFilterChange = (filterType, value, analytics) => {
	analytics.trackEvent({
		type: 'Other',
		event: 'TrialListingApp:Filter:Change',
		filterType,
		filterValue: value,
	});
};

export const trackFilterApply = (appliedFilters, analytics) => {
	analytics.trackEvent({
		type: 'Other',
		event: 'TrialListingApp:Filter:Apply',
		filterCount: appliedFilters.length,
		filters: appliedFilters,
	});
};

export const trackFilterClear = (analytics) => {
	analytics.trackEvent({
		type: 'Other',
		event: 'TrialListingApp:Filter:Clear',
	});
};

export const formatLocationString = (location) => {
	if (!location?.zipCode || !location?.radius) return '';
	return `${URL_PARAM_MAPPING.zipCode.shortCode}|${location.zipCode}|${location.radius}`;
};

export const getAppliedFieldsString = (filters) => {
	const fields = [];
	if (filters.age) fields.push(URL_PARAM_MAPPING.age.shortCode);
	if (filters.location?.zipCode) fields.push('loc');
	return fields.join(':');
};
