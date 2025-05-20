import { useQuery } from '@tanstack/react-query';
import { useStateValue } from '../../store/store';
import { getMainType } from '../../services/api/clinical-trials-search-api/getMainType';

export function useSubTypeSearch(maintypeCode) {
	const [
		{
			apiClients: { clinicalTrialsSearchClient },
		},
	] = useStateValue();

	const { data, isLoading, error } = useQuery({
		// Include maintype in the query key for proper caching
		queryKey: ['subtypes', maintypeCode],

		// Only fetch if we have a maintype code
		enabled: !!maintypeCode,

		queryFn: async () => {
			if (!maintypeCode) return [];

			// Include parameters for the specific maintype
			const query = {
				type: 'subtype',
				maintype: maintypeCode,
				current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review',
                                'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
			};

			const response = await getMainType(clinicalTrialsSearchClient, query);

			// The API response has the data in a nested 'data' property
			if (response && Array.isArray(response.data)) {
				// Transform data to the format our ComboBox component expects
				const transformedData = response.data.map((item) => ({
					id: item.codes?.[0] || item.name,
					label: item.name,
					value: item.codes?.[0] || item.name,
					count: item.doc_count || 0, // Use doc_count instead of count
				}));

				// Sort alphabetically by label
				const sortedData = transformedData.sort((a, b) => a.label.localeCompare(b.label));
				return sortedData;
			}

			return [];
		},
		// This data changes when maintype changes, so use a shorter stale time
		staleTime: 10 * 60 * 1000, // 10 minutes
		cacheTime: 24 * 60 * 60 * 1000, // 24 hours
		refetchOnWindowFocus: false,
	});

	// Return the actual data
	return {
		options: data || [], // Return the dataset from API
		isLoading,
		error,
	};
}
