/**
 * Gets a disease from the Clinical Trials API matching the request filters
 *
 * @param {Array} ids - the disease code/codes to fetch
 */

export const getCtsApiDiseaseFetcherAction = (ids) => {
	// Set up query for Clinical Trials API.
	// Include only active trial statuses, type, code, and size.
	const requestQuery = {
		current_trial_status: [
			'Active',
			'Approved',
			'Enrolling by Invitation',
			'In Review',
			'Temporarily Closed to Accrual',
			'Temporarily Closed to Accrual and Intervention',
		],
		type: ['maintype', 'subtype', 'stage', 'finding'],
		code: ids,
		size: 100,
	};

	return {
		type: 'getCtsApiDiseaseFetcher',
		payload: requestQuery,
	};
};
