/**
 * @file This file defines custom hooks for fetching clinical trial data using react-query.
 * It includes hooks for fetching a list of trials based on filters and pagination,
 * and for fetching a single trial by its ID.
 */
import { useQuery } from '@tanstack/react-query';
import { useStateValue } from '../../../store/store';
import { createTrialQueries } from '../../../api/queries';

/**
 * Custom hook to fetch a list of clinical trials based on applied filters and pagination.
 * Uses react-query for data fetching, caching, and state management.
 *
 * @param {object} filters - An object containing the filter criteria formatted for the API.
 * @param {number|string} page - The current page number for pagination.
 * @param {number|string} pageSize - The number of trials to fetch per page.
 * @returns {object} The react-query query object containing data, status, error, etc.
 *                   for the trials query. Includes `keepPreviousData` for smoother pagination.
 */
export function useTrials(filters = {}, page, pageSize) { // Default filters to {}
	// Access the clinical trials API client from the global state
	const [
		{
			apiClients: { clinicalTrialsSearchClient },
		},
	] = useStateValue();
	// Create trial query functions using the client
	const queries = createTrialQueries(clinicalTrialsSearchClient);

	// Prepare filters for the API call, cleaning and formatting as needed.
	const apiFilters = {};

	// Handle age filter - include only if it's a valid number (not empty string or null/undefined)
	if (filters.age && !isNaN(parseInt(filters.age, 10))) {
		apiFilters.age = parseInt(filters.age, 10);
	}

	// Handle location filter - include zip, radius, and coordinates if valid
	if (
		filters.location?.zipCode &&
		filters.location?.radius &&
		filters.location?.coordinates?.lat &&
		filters.location?.coordinates?.lon
	) {
		// Assuming API expects these parameter names based on typical patterns
		apiFilters.zipCode = filters.location.zipCode;
		apiFilters.zipRadius = filters.location.radius;
		apiFilters.zipLat = filters.location.coordinates.lat;
		apiFilters.zipLon = filters.location.coordinates.lon;
	}

	// TODO: Add handling for other filter types (e.g., trial type, phase)
	// Copy other filters directly if they exist (assuming they are already in API format)
	// Example:
	// if (filters.type) apiFilters.type = filters.type;
	// if (filters.phase) apiFilters.phase = filters.phase;

	// Use react-query's useQuery hook to fetch trials
	return useQuery({
		// Unique query key based on the *cleaned* API filters, page, and pageSize
		queryKey: ['trials', apiFilters, page, pageSize],
		// Function to execute the query using the API client with cleaned filters
		queryFn: () => queries.getTrials({ filters: apiFilters, page, pageSize }),
		// Keep previous data visible while fetching the next page for better UX
		keepPreviousData: true,
	});
}

/**
 * Custom hook to fetch a single clinical trial by its ID.
 * Uses react-query for data fetching and caching.
 *
 * @param {string} id - The NCI ID of the trial to fetch.
 * @returns {object} The react-query query object containing data, status, error, etc.
 *                   for the single trial query. The query is only enabled if an ID is provided.
 */
export function useTrial(id) {
	// Access the clinical trials API client from the global state
	const [
		{
			apiClients: { clinicalTrialsSearchClient },
		},
	] = useStateValue();
	// Create trial query functions using the client
	const queries = createTrialQueries(clinicalTrialsSearchClient);

	// Use react-query's useQuery hook to fetch a single trial
	return useQuery({
		// Unique query key based on the trial ID
		queryKey: ['trial', id],
		// Function to execute the query using the API client
		queryFn: () => queries.getTrialById(id),
		// Only enable (run) the query if an ID is actually provided
		enabled: !!id,
	});
}
