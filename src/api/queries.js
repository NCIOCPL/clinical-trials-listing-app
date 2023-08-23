export const createTrialQueries = (client) => {
	const ageFilterOptions = [
		{ value: 'child', label: 'Child (birth - 17)' },
		{ value: 'adult', label: 'Adult (18 - 64)' },
		{ value: 'older_adult', label: 'Older adult (65+)' },
	];

	const filterTrialsByAge = async (ageGroups) => {
		const response = await client.get('/trials', {
			params: {
				'eligibility.structured.max_age_in_years_gte': ageGroups,
				'eligibility.structured.min_age_in_years_lte': ageGroups,
			},
		});
		return response.data;
	};
	const trialQueries = {
		getTrials: async ({ filters, page = 1, pageSize = 25 }) => {
			const response = await client.get('/trials', {
				params: {
					from: (page - 1) * pageSize,
					size: pageSize,
					...filters,
				},
			});
			return response.data;
		},

		getTrialById: async (id) => {
			const response = await client.get(`/trials/${id}`);
			return response.data;
		},
	};

	return {
		ageFilterOptions,
		filterTrialsByAge,
		...trialQueries,
	};
};
