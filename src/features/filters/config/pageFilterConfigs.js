export const PAGE_FILTER_CONFIGS = {
	Disease: {
		enabledFilters: ['age', 'location'],
		order: ['age', 'location'],
	},

	Manual: {
		enabledFilters: ['age'], // Only age filter enabled
		order: ['age'],
	},

	Intervention: {
		enabledFilters: ['location'], // Only location filter enabled
		order: ['location'],
	},
};
