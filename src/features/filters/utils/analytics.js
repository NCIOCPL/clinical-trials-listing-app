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
