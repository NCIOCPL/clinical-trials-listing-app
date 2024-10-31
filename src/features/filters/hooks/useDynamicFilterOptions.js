import { useQuery } from '@tanstack/react-query';
import { clinicalTrialsClient } from '../../../api/queries';

// // Constants for static options
// const AGE_OPTIONS = [
// 	{ value: 'child', label: 'Child (birth - 17)' },
// 	{ value: 'adult', label: 'Adult (18 - 64)' },
// 	{ value: 'older_adult', label: 'Older adult (65+)' },
// ];

const DEFAULT_FILTER_OPTIONS = {
	subtype: [],
	stage: [],
	drugIntervention: [],
	age: [],
};

export const useDynamicFilterOptions = (diseaseId) => {
	return {
		data: {
			subtype: [],
			stage: [],
			drugIntervention: [],
			age: [],
		},
		isLoading: false,
		error: null,
	};
	// return useQuery({
	// 	queryKey: ['filterOptions', diseaseId],
	// 	queryFn: async () => {
	// 		if (!diseaseId) {
	// 			return DEFAULT_FILTER_OPTIONS;
	// 		}
	//
	// 		try {
	// 			const response = await clinicalTrialsClient.post('/trials', {
	// 				diseases: {
	// 					nci_thesaurus_concept_id: [diseaseId],
	// 				},
	// 				aggregations: {
	// 					subtypes: {
	// 						terms: {
	// 							field: 'diseases.subtype',
	// 							size: 100,
	// 						},
	// 					},
	// 					stages: {
	// 						terms: {
	// 							field: 'diseases.stage',
	// 							size: 50,
	// 						},
	// 					},
	// 				},
	// 			});
	//
	// 			return {
	// 				subtype:
	// 					response.data.aggregations?.subtypes?.buckets?.map((bucket) => ({
	// 						value: bucket.key,
	// 						label: bucket.key,
	// 						count: bucket.doc_count,
	// 					})) || [],
	// 				stage:
	// 					response.data.aggregations?.stages?.buckets?.map((bucket) => ({
	// 						value: bucket.key,
	// 						label: bucket.key,
	// 						count: bucket.doc_count,
	// 					})) || [],
	// 				age: AGE_OPTIONS,
	// 			};
	// 		} catch (error) {
	// 			if (error.response?.status === 429) {
	// 				console.warn('Rate limited, using default filter options');
	// 				return DEFAULT_FILTER_OPTIONS;
	// 			}
	// 			throw error;
	// 		}
	// 	},
	// 	enabled: Boolean(diseaseId),
	// 	staleTime: 5 * 60 * 1000,
	// 	cacheTime: 10 * 60 * 1000,
	// 	retry: 0,
	// 	refetchOnWindowFocus: false,
	// 	refetchOnReconnect: false,
	// 	refetchOnMount: false,
	// });
};
