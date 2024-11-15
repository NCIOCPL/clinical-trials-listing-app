import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of disease finding based on ancestor id from the CTS api
 * @param {Array} ancestorIds - is a main type disease's code - providing this will return any of the children along a disease path
 * @return {{payload: {cacheKey: string, service: string, requests: [{method: string, requestParams: { current_trial_status: string[], size: number}}]}, type: string}}
 */
export const getFindingsAction = (ancestorIds) => {
	if (!ancestorIds) {
		throw new Error('You must specify an ancestor id in order to fetch it.');
	}
	const requestQuery = {
		type: 'finding',
		current_trial_status: ACTIVE_TRIAL_STATUSES,
		maintype: ancestorIds,
	};
	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'findingsOptions',
			method: 'getFindings',
			requestParams: requestQuery,
		},
	};
};
