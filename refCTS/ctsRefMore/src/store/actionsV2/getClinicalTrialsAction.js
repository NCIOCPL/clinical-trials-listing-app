import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of diseases of main types, sub types, and stage from the CTS api
 * @param {String} searchText - free text string matching disease type
 * @param {Number} size - the number of results expected
 * @return {{payload: {cacheKey: string, method: string, service: string, requestParams: {current_trial_status: string[], size: number, name: *, type: [string, string, string, string]}}, type: string}}
 */
export const getClinicalTrialActionsV2 = ({ cacheKey, data }) => {
	const requestQuery = {
		...data,
		current_trial_status: ACTIVE_TRIAL_STATUSES,
	};

	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey,
			method: 'searchTrials',
			requestParams: requestQuery,
		},
	};
};
