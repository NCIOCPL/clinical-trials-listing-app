import { useQuery } from '@tanstack/react-query';
// import { useState } from 'react';
import { createApiClient } from '../api/client';
import { getMainType } from '../services/api/clinical-trials-search-api/getMainType';

export function useMainTypeSearch() {
	// Use the local proxy URL instead of connecting directly to the external API
	const client = createApiClient('/cts/proxy-api/v2');

	// Mockup data in case the API fails
	const mockData = [
		{ id: 'C4872', label: 'Lung Cancer', value: 'C4872', count: 120 },
		{ id: 'C4913', label: 'Breast Cancer', value: 'C4913', count: 150 },
		{ id: 'C3728', label: 'Colorectal Cancer', value: 'C3728', count: 90 },
		{ id: 'C6536', label: 'Pancreatic Cancer', value: 'C6536', count: 60 },
		{ id: 'C3024', label: 'Leukemia', value: 'C3024', count: 75 },
		{ id: 'C4833', label: 'Lymphoma', value: 'C4833', count: 80 },
	];

	// This query will fetch ALL main types at once, matching how the search app works
	const { data, isLoading, error } = useQuery({
		// Static query key - doesn't depend on search term since we fetch all at once
		queryKey: ['mainTypesAll'],
		queryFn: async () => {
			// Include all required parameters that the search app uses
			const query = {
				type: 'maintype',
				current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
				size: 100, // Set a large enough size to get all main types
			};

			const response = await getMainType(client, query);

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

			// If parsing fails, return mock data as fallback
			console.log('Using mock data as fallback');
			return mockData;
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
