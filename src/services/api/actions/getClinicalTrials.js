import { getEndpoint } from '../endpoints';

export const getClinicalTrials = (requestFilters = '') => {
	const endpoint = getEndpoint('clinicalTrials');
	const additionalParams = JSON.parse(requestFilters);
	const defaultQuery = {
		current_trial_status: [
			'Active',
			'Approved',
			'Enrolling by Invitation',
			'In Review',
			'Temporarily Closed to Accrual',
			'Temporarily Closed to Accrual and Intervention',
		],
		...additionalParams,
	};

	return {
		method: 'POST',
		endpoint: `${endpoint}`,
		body: defaultQuery,
	};
};
