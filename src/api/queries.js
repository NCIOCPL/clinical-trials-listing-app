import { createApiClient } from './client';

export const clinicalTrialsClient = createApiClient(process.env.REACT_APP_CTS_API_URL);

export const ageFilterOptions = [
	{ value: 'child', label: 'Child (birth - 17)' },
	{ value: 'adult', label: 'Adult (18 - 64)' },
	{ value: 'older_adult', label: 'Older adult (65+)' },
];

export const filterTrialsByAge = async (ageGroups) => {
	const response = await clinicalTrialsClient.get('/trials', {
		params: {
			'eligibility.structured.max_age_in_years_gte': ageGroups,
			'eligibility.structured.min_age_in_years_lte': ageGroups,
		},
	});
	return response.data;
};

export const trialQueries = {
	getTrials: async ({ filters, page = 1, pageSize = 25 }) => {
		const response = await clinicalTrialsClient.get('/trials', {
			params: {
				from: (page - 1) * pageSize,
				size: pageSize,
				...filters,
			},
		});
		return response.data;
	},

	getTrialById: async (id) => {
		const response = await clinicalTrialsClient.get(`/trials/${id}`);
		return response.data;
	},
};

// export const fetchFilters = async ({ type, searchText }) => {
// 	const response = await clinicalTrialsClient.get('/filters', {
// 		params: { type, searchText },
// 	});
// 	return response.data;
// };

// export const searchTrials = async (filters) => {
//   const response = await apiClient.get('/trials', {
//     params: filters
//   });
//   return response.data;
// };

// export const searchTrials = async (filters) => {
// 	const params = {
// 		...filters,
// 		'eligibility.structured.max_age_in_years_gte': filters.age,
// 		'eligibility.structured.min_age_in_years_lte': filters.age,
// 	};
//
// 	const response = await clinicalTrialsClient.get('/trials', { params });
// 	return response.data;
// };
