/**
 * Gets a list of clinical trials from the Clinical Trials API matching the request filters
 *
 * @param {Object} params the parameters to fetch
 * @param {} params.requestFilters the request filters to match
 */
export const getClinicalTrials = ({ requestFilters = {} }) => {
	// Set up query for Clinical Trias API.
	// Include requestFilters and only active trial statuses.
	const defaultQuery = {
		current_trial_status: [
			'Active',
			'Approved',
			'Enrolling by Invitation',
			'In Review',
			'Temporarily Closed to Accrual',
			'Temporarily Closed to Accrual and Intervention',
		],
		...requestFilters,
	};

	return {
		interceptorName: 'clinical-trials-api',
		method: 'POST',
		endpoint: `{{API_HOST}}/clinical-trials`,
		body: defaultQuery
	};
};
