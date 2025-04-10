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
		enabledFilters: ['maintype', 'age', 'location'],
		order: ['maintype', 'age', 'location'],
	},
};
