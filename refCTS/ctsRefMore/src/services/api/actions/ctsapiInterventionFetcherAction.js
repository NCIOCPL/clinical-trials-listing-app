/**
 * Gets a list of clinical trials from the Clinical Trials API matching the request filters
 * @param ids - a list of IDs to fetch.
 *
 */

export const getCtsApiInterventionFetcherAction = (ids) => {
	// Set up query for Clinical Trials API.
	// Include only active trial statuses, ids and size.
	const requestQuery = {
		current_trial_status: [
			'Active',
			'Approved',
			'Enrolling by Invitation',
			'In Review',
			'Temporarily Closed to Accrual',
			'Temporarily Closed to Accrual and Intervention',
		],
		code: ids,
		size: 100,
	};

	return {
		type: 'getCtsApiInterventionFetcher',
		payload: requestQuery,
	};
};
