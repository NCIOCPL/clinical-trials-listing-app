/**
 * @file This file defines the useDynamicFilterOptions hook, which is intended
 * to fetch dynamic filter options (like subtypes and stages) based on a disease ID.
 * NOTE: The actual fetching logic using react-query is currently commented out,
 * and the hook returns default empty options.
 */
// // Constants for static options (currently unused as age filter is numeric input)
// const AGE_OPTIONS = [
// 	{ value: 'child', label: 'Child (birth - 17)' },
// 	{ value: 'adult', label: 'Adult (18 - 64)' },
// 	{ value: 'older_adult', label: 'Older adult (65+)' },
// ];

/**
 * Custom hook to fetch dynamic filter options based on a disease ID.
 * Currently, this hook returns static default options as the fetching logic is commented out.
 *
 * The commented-out logic uses react-query to fetch aggregations for subtypes and stages
 * from the clinical trials API based on the provided diseaseId.
 *
 * @param {string} diseaseId - The NCI Thesaurus concept ID of the disease.
 * @returns {object} An object containing the filter options data, loading state, and error state.
 *                   Currently returns static data with isLoading: false and error: null.
 */
export const useDynamicFilterOptions = () => {
	// --- Current Implementation (Returns Static Defaults) ---
	return {
		data: {
			subtype: [],
			stage: [],
			drugIntervention: [],
			age: [], // Return empty age options as it's handled by numeric input
		},
		isLoading: false,
		error: null,
	};

	// --- Commented-Out Fetching Logic using react-query ---
	/*
	return useQuery({
		queryKey: ['filterOptions', diseaseId], // Unique query key including diseaseId
		queryFn: async () => {
			// If no diseaseId is provided, return default options immediately
			if (!diseaseId) {
				return DEFAULT_FILTER_OPTIONS;
			}

			try {
				// Make API call to fetch aggregations for the given disease
				const response = await clinicalTrialsClient.post('/trials', {
					// Filter by disease ID
					diseases: {
						nci_thesaurus_concept_id: [diseaseId],
					},
					// Request aggregations for relevant filter fields
					aggregations: {
						subtypes: {
							terms: {
								field: 'diseases.subtype', // Field to aggregate on
								size: 100, // Max number of options to return
							},
						},
						stages: {
							terms: {
								field: 'diseases.stage',
								size: 50,
							},
						},
						// Add other aggregations as needed (e.g., drug/intervention)
					},
					size: 0, // We only need aggregations, not the trials themselves
				});

				// Format the aggregation results into the desired options structure
				return {
					subtype:
						response.data.aggregations?.subtypes?.buckets?.map((bucket) => ({
							value: bucket.key, // Use the aggregated key as the value
							label: bucket.key, // Use the aggregated key as the label (can be formatted later)
							count: bucket.doc_count, // Include the count for potential display
						})) || [],
					stage:
						response.data.aggregations?.stages?.buckets?.map((bucket) => ({
							value: bucket.key,
							label: bucket.key, // Format stage labels if needed (e.g., "Stage IV")
							count: bucket.doc_count,
						})) || [],
					// age: AGE_OPTIONS, // Use static age options if needed
					drugIntervention: [], // Placeholder for drug/intervention options
				};
			} catch (error) {
				// Handle specific errors like rate limiting
				if (error.response?.status === 429) {
					// Silently return default options if rate limited
					return DEFAULT_FILTER_OPTIONS;
				}
				// Re-throw other errors to be handled by react-query
				throw error;
			}
		},
		enabled: Boolean(diseaseId), // Only run the query if diseaseId is provided
		staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
		cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
		retry: 0, // Don't retry on failure
		refetchOnWindowFocus: false, // Don't refetch when window gains focus
		refetchOnReconnect: false, // Don't refetch on network reconnect
		refetchOnMount: false, // Don't refetch automatically on mount if data is fresh
	});
	*/
};
