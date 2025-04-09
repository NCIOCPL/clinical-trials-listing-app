import { useQuery } from '@tanstack/react-query';
// import { useState } from 'react';
import { useStateValue } from '../../store/store';
import { getMainType } from '../../services/api/clinical-trials-search-api/getMainType';

export function useMainTypeSearch() {
	const [
		{
			apiClients: { clinicalTrialsSearchClient },
		},
	] = useStateValue();

	// This query will fetch ALL main types at once, matching how the search app works
	const { data, isLoading, error } = useQuery({
		// Static query key - doesn't depend on search term since we fetch all at once
		queryKey: ['mainTypesAll'],
		queryFn: async () => {
			// Include all required parameters that the search app uses
			const query = {
				type: 'maintype',
				current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
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
			``;
		},
		// This data rarely changes, so we can cache it for a long time
		staleTime: 24 * 60 * 60 * 1000, // 24 hours
		cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
		refetchOnWindowFocus: false,
	});

	// No client-side filtering - let the ComboBox component handle it

	// Return the actual data (with mockData as fallback if API fails)
	return {
		options: data || [], // Return the dataset from API
		isLoading,
		error,
	};
}
