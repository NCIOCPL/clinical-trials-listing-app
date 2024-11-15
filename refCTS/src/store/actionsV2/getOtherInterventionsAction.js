import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of interventions from the CTS api matching the search text and request filters provided
 * @param {String} searchText - free text string matching lead org name
 * @param size - the number of results
 * @return {{payload: {cacheKey: string, method: string, service: string, requestParams: {current_trial_status: string[], size: number, name: *, sort: string, category: [string], order: string}}, type: string}}
 */
export const getOtherInterventionsAction = ({ searchText, size = 10 }) => {
	if (!searchText || searchText === '') {
		throw new Error('You must specify a treatment in order to fetch it.');
	}

	const requestQuery = {
		category: ['Other'],
		current_trial_status: ACTIVE_TRIAL_STATUSES,
		order: 'desc',
		name: searchText,
		size,
		sort: 'count',
	};

	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'treatmentOptions',
			method: 'getOtherInterventions',
			requestParams: requestQuery,
		},
	};
};
