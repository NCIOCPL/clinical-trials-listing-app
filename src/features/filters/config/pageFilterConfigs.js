export const PAGE_FILTER_CONFIGS = {
	Disease: {
		enabledFilters: ['age', 'location'],
		order: ['age', 'location'],
	},

	Manual: {
		enabledFilters: [],
		order: [],
	},

	Intervention: {
		enabledFilters: ['age', 'location', 'maintype'],
		order: ['age', 'location', 'maintype'],
	},
};
