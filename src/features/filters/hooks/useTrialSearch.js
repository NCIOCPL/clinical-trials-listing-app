import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clinicalTrialsClient } from '../../../api/queries';

const cleanRequestFilters = (filters) => {
	try {
		// Start with a clean object
		const cleaned = {};

		// Iterate through filter properties
		Object.entries(filters).forEach(([key, value]) => {
			// Skip empty arrays
			if (Array.isArray(value) && value.length === 0) {
				return;
			}

			// Skip empty objects or objects with null/empty values
			if (typeof value === 'object' && value !== null) {
				const isEmptyObject = Object.values(value).every((v) => v === '' || v === null || v === undefined);
				if (isEmptyObject) {
					return;
				}
			}

			// Keep non-empty values
			if (value !== null && value !== undefined && value !== '') {
				cleaned[key] = value;
			}
		});

		return cleaned;
	} catch (err) {
		console.error('Error cleaning request filters:', err);
		// Return empty object if cleaning fails to avoid breaking the entire request
		return {};
	}
};

export const useTrialSearch = (requestFilters, isEnabled = true) => {
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	useEffect(() => {
		try {
			setIsInitialLoad(true);
		} catch (err) {
			console.error('Error setting initial load:', err);
		}
	}, [requestFilters]);

	const {
		data: trials,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['trials', requestFilters],
		queryFn: async () => {
			try {
				// Validate input
				if (!requestFilters || typeof requestFilters !== 'object') {
					throw new Error('Invalid request filters provided');
				}

				// Base request body with required fields
				const baseBody = {
					current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
					include: ['brief_summary', 'brief_title', 'current_trial_status', 'nci_id', 'nct_id', 'sites.org_name', 'sites.org_country', 'sites.org_state_or_province', 'sites.org_city', 'sites.recruitment_status'],
					from: requestFilters.from || 0,
					size: requestFilters.size || 25,
				};

				// Clean the request filters
				const cleanedFilters = cleanRequestFilters(requestFilters);

				// Merge base body with cleaned filters
				const requestBody = {
					...baseBody,
					...cleanedFilters,
				};

				console.log('Sending request with body:', requestBody);

				const response = await clinicalTrialsClient.post('/trials', requestBody);

				// Validate response
				if (!response || !response.data) {
					throw new Error('Invalid response from server');
				}

				// Validate essential response properties
				const { data, total } = response.data;
				if (!Array.isArray(data)) {
					throw new Error('Response data is not an array');
				}
				if (typeof total !== 'number') {
					throw new Error('Response total is not a number');
				}

				return {
					data: response.data.data || [],
					total: response.data.total || 0,
				};
			} catch (err) {
				console.error('Error in trial search:', err);
				// Rethrow with more context for React Query error handling
				throw new Error(err.response?.data?.message || err.message || 'An error occurred while fetching trials');
			}
		},
		enabled: isEnabled && isInitialLoad,
		onSuccess: () => {
			try {
				setIsInitialLoad(false);
			} catch (err) {
				console.error('Error setting initial load on success:', err);
			}
		},
		onError: (err) => {
			console.error('Query error:', err);
			// Keep initial load true on error to allow retrying
			setIsInitialLoad(true);
		},
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		retry: 1, // Only retry once
		retryDelay: 1000, // Wait 1 second between retries
	});

	return {
		trials: trials
			? {
					data: trials.data || [],
					total: trials.total || 0,
			  }
			: null,
		isLoading,
		error: error
			? {
					message: error.message,
					original: error,
			  }
			: null,
	};
};
