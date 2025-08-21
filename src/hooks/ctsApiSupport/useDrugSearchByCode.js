import { useQuery } from '@tanstack/react-query';
import { useStateValue } from '../../store/store';
import { searchDrug } from '../../services/api/clinical-trials-search-api/searchDrug';

export function useDrugSearchByCode(conceptCode) {
	const [
		{
			apiClients: { clinicalTrialsSearchClient },
		},
	] = useStateValue();

	const { data, isLoading, error } = useQuery({
		// Include conceptCode in the query key for proper caching
		queryKey: ['drugsByCode', conceptCode],

		// Only fetch if we have a concept code
		enabled: !!conceptCode,

		queryFn: async () => {
			if (!conceptCode) return [];

			// Build query to search by concept code
			const query = {
				current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
				sort: 'count',
				order: 'desc',
				category: ['Agent', 'Agent Category'],
				nci_thesaurus_concept_id: conceptCode, // Search by concept code instead of name
				size: 10,
			};

			const response = await searchDrug(clinicalTrialsSearchClient, query);
			// console.log('[useDrugSearchByCode] API response for concept code', conceptCode, ':', response);

			// The API response has the data in a nested 'data' property
			if (response && Array.isArray(response.data)) {
				// console.log('[useDrugSearchByCode] Returning drugs:', response.data);
				return response.data;
			}

			// console.log('[useDrugSearchByCode] No data in response, returning empty array');
			return [];
		},
		// Use shorter stale time since search results can change frequently
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 30 * 60 * 1000, // 30 minutes
		refetchOnWindowFocus: false,
	});

	// Return the actual data
	return {
		drugs: data || [], // Return the dataset from API
		isLoading,
		error,
	};
}
