import { useQuery } from '@tanstack/react-query';
import { useStateValue } from '../../store/store';
import { searchDrug } from '../../services/api/clinical-trials-search-api/searchDrug';

export function useDrugSearch(searchText) {
	const [
		{
			apiClients: { clinicalTrialsSearchClient },
		},
	] = useStateValue();

	const { data, isLoading, error } = useQuery({
		// Include searchText in the query key for proper caching
		queryKey: ['drugs', searchText],

		// Only fetch if we have a search text with 3+ characters
		enabled: !!searchText && searchText.length >= 3,

		queryFn: async () => {
			if (!searchText || searchText.length < 3) return [];

			// Build query matching the clinical trials search app
			const query = {
				current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
				sort: 'count',
				order: 'desc',
				category: ['Agent', 'Agent Category'],
				name: searchText,
				size: 10,
			};

			const response = await searchDrug(clinicalTrialsSearchClient, query);

			// The API response has the data in a nested 'data' property
			if (response && Array.isArray(response.data)) {
				// Return data in the format expected by our autocomplete component
				// The response should already have the format with codes, name, category, synonyms
				return response.data;
			}

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
