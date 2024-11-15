import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of disease main types from the CTS api
 * @param size is ommited as per API V2 it will return ALL primary types when size is not provided
 * @return {{payload: {cacheKey: string, service: string, requests: [{method: string, requestParams: { current_trial_status: string[], size: number}}]}, type: string}}
 */
export const getMainTypeAction = () => {
	const requestQuery = {
		type: 'maintype',
		current_trial_status: ACTIVE_TRIAL_STATUSES,
	};
	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'maintypeOptions',
			method: 'getMainType',
			requestParams: requestQuery,
		},
	};
};
