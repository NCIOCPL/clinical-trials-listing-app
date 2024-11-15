import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of diseases of main types, sub types, and stage from the CTS api
 * @param {String} searchText - free text string matching disease type
 * @param {Number} size - the number of results expected
 * @return {{payload: {cacheKey: string, method: string, service: string, requestParams: {current_trial_status: string[], size: number, name: *, type: [string, string, string, string]}}, type: string}}
 */
export const getDiseasesForTypeAheadAction = ({
	searchText = '',
	size = 10,
}) => {
	const requestQuery = {
		name: searchText,
		current_trial_status: ACTIVE_TRIAL_STATUSES,
		size,
		type: ['maintype', 'subtype', 'stage'],
	};

	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'diseases',
			method: 'getDiseases',
			requestParams: requestQuery,
		},
	};
};
