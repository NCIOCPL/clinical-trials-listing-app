import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of hospitals from the CTS api matching the search text and request filters provided
 * @param {String} searchText - free text string matching hospital name
 * @param size - the number of results
 * @return {{payload: {cacheKey: string, method: string, service: string, requestParams: {current_trial_status: string[], size: number, name: *}}, type: string}}
 */
export const getHospitalAction = ({ searchText, size = 10 }) => {
	if (!searchText || searchText === '') {
		throw new Error('You must specify a hospital in order to fetch it.');
	}

	const requestQuery = {
		name: searchText,
		current_trial_status: ACTIVE_TRIAL_STATUSES,
		size,
	};

	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'hospitals',
			method: 'getHospital',
			requestParams: requestQuery,
		},
	};
};
