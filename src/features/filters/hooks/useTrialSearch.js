/**
 * @file This file defines the useTrialSearch hook, which is responsible for
 * fetching clinical trials data based on a set of request filters. It utilizes
 * react-query for data fetching and includes logic for cleaning filters and
 * managing initial load state.
 */
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStateValue } from '../../../store/store';

/**
 * Cleans the request filter object by removing empty arrays, empty objects,
 * null, undefined, or empty string values. This ensures only valid filter
 * criteria are sent to the API.
 *
 * @param {object} filters - The raw filter object.
 * @returns {object} A cleaned filter object with invalid criteria removed.
 */
const cleanRequestFilters = (filters) => {
	try {
		const cleaned = {};
		Object.entries(filters).forEach(([key, value]) => {
			// Skip empty arrays
			if (Array.isArray(value) && value.length === 0) {
				return;
			}
			// Skip objects where all values are empty/null/undefined
			if (typeof value === 'object' && value !== null) {
				const isEmptyObject = Object.values(value).every((v) => v === '' || v === null || v === undefined);
				if (isEmptyObject) {
					return;
				}
			}
			// Include value if it's not null, undefined, or an empty string
			if (value !== null && value !== undefined && value !== '') {
				cleaned[key] = value;
			}
		});
		return cleaned;
	} catch (err) {
		// Log error during development, return empty object in production
		// console.error('Error cleaning request filters:', err);
		return {};
	}
};

/**
 * Custom hook to search for clinical trials based on provided filters.
 * Handles data fetching using react-query, cleans filters before sending,
 * and manages loading and error states.
 *
 * @param {object} requestFilters - The filter criteria object, potentially including pagination (`from`, `size`).
 * @param {boolean} [isEnabled=true] - Flag to enable or disable the query execution.
 * @returns {object} An object containing:
 *   - trials {object|null}: The fetched trials data ({ data: [], total: 0 }) or null.
 *   - isLoading {boolean}: Indicates if the query is currently loading.
 *   - error {object|null}: An error object if the query failed, otherwise null.
 */
export const useTrialSearch = (requestFilters, isEnabled = true) => {
	// State to track if this is the initial data load for the current filters
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	// Access the API client from global state
	const [
		{
			apiClients: { clinicalTrialsSearchClient },
		},
	] = useStateValue();

	/**
	 * Effect to reset the initial load flag whenever the request filters change.
	 * This ensures the query runs again when filters are updated.
	 */
	useEffect(() => {
		try {
			setIsInitialLoad(true);
		} catch (err) {
			// Error setting state - should not typically happen
			// console.error('Error setting initial load:', err);
		}
	}, [requestFilters]); // Dependency array includes requestFilters

	// Use react-query to fetch trial data
	const {
		data: trials,
		isLoading,
		error,
	} = useQuery({
		// Query key includes the filters to ensure caching and refetching work correctly
		queryKey: ['trials', requestFilters],
		// Async function to perform the API call
		queryFn: async () => {
			try {
				// Basic validation of input filters
				if (!requestFilters || typeof requestFilters !== 'object') {
					throw new Error('Invalid request filters provided');
				}

				// Base request body with default parameters
				const baseBody = {
					current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
					include: ['brief_summary', 'brief_title', 'current_trial_status', 'nci_id', 'nct_id', 'sites.org_name', 'sites.org_country', 'sites.org_state_or_province', 'sites.org_city', 'sites.recruitment_status', 'sites.org_coordinates'],
					from: requestFilters.from || 0, // Default pagination 'from'
					size: requestFilters.size || 25, // Default pagination 'size'
				};

				// Clean the provided filters to remove empty values
				const cleanedFilters = cleanRequestFilters(requestFilters);

				// Combine base parameters with cleaned filters
				const requestBody = {
					...baseBody,
					...cleanedFilters,
				};

				// Make the POST request to the trials endpoint
				const response = await clinicalTrialsSearchClient.post('/trials', requestBody);

				// Validate the server response structure
				if (!response || !response.data) {
					throw new Error('Invalid response from server');
				}

				const { data, total } = response.data;
				if (!Array.isArray(data)) {
					throw new Error('Response data is not an array');
				}
				if (typeof total !== 'number') {
					throw new Error('Response total is not a number');
				}

				// Return the structured data
				return {
					data: response.data.data || [],
					total: response.data.total || 0,
				};
			} catch (err) {
				// Log error during development and throw a user-friendly error
				// console.error('Error in trial search:', err);
				throw new Error(err.response?.data?.message || err.message || 'An error occurred while fetching trials');
			}
		},
		// Enable the query only if isEnabled prop is true and it's the initial load for these filters
		enabled: isEnabled && isInitialLoad,
		// Callback on successful query execution
		onSuccess: () => {
			try {
				// Reset the initial load flag after successful fetch
				setIsInitialLoad(false);
			} catch (err) {
				// Error setting state - should not typically happen
				// console.error('Error setting initial load on success:', err);
			}
		},
		// Callback on query error
		onError: () => {
			// Log error during development
			// console.error('Query error:', err);
			// Reset initial load flag on error to allow retrying
			setIsInitialLoad(true);
		},
		keepPreviousData: true, // Keep previous data visible during refetches (e.g., pagination)
		refetchOnWindowFocus: false, // Disable refetching when window gains focus
		refetchOnMount: false, // Disable automatic refetch on mount if data is fresh
		refetchOnReconnect: false, // Disable automatic refetch on network reconnect
		retry: 1, // Retry once on failure
		retryDelay: 1000, // Wait 1 second before retrying
	});

	// Return the fetched data, loading state, and formatted error object
	return {
		trials: trials
			? {
					data: trials.data || [], // Ensure data is always an array
					total: trials.total || 0, // Ensure total is always a number
			  }
			: null, // Return null if no data yet
		isLoading,
		error: error
			? {
					message: error.message, // Provide a clean error message
					original: error, // Include the original error object for debugging if needed
			  }
			: null, // Return null if no error
	};
};
