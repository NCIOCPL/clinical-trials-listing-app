import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of Drugs from the CTS api
 * @param {String} searchText - free text string matching Drug name
 * @return {{payload: {cacheKey: string, method: string, service: string, requestParams: {current_trial_status: string[], name: searchText, sort: 'count', order: 'desc', category: }}, type: string}}
 */
export const searchDrugAction = ({ searchText }) => {
	if (!searchText || searchText === '') {
		throw new Error('You must specify a drug in order to fetch it.');
	}
	const requestQuery = {
		current_trial_status: ACTIVE_TRIAL_STATUSES,
		sort: 'count',
		order: 'desc',
		category: ['Agent', 'Agent Category'],
		name: searchText,
		size: 10,
	};

	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'drugOptions',
			method: 'searchDrug',
			requestParams: requestQuery,
		},
	};
};
