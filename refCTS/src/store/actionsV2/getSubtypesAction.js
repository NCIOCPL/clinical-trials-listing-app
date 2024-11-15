import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of disease subtypes based on ancestor id from the CTS api
 * @param size is ommited as per API V2 it will return ALL results when size is not provided
 * @param ancestorIds is a main type disease's code - providing this will return any of the children along a disease path
 * @return {{payload: {cacheKey: string, service: string, requests: [{method: string, requestParams: { current_trial_status: string[], size: number}}]}, type: string}}
 */
export const getSubtypesAction = (ancestorIds) => {
	if (!ancestorIds) {
		throw new Error('You must specify an ancestor id in order to fetch it.');
	}
	const requestQuery = {
		type: 'subtype',
		current_trial_status: ACTIVE_TRIAL_STATUSES,
		ancestor_ids: ancestorIds,
	};
	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'subtypeOptions',
			method: 'getSubtypes',
			requestParams: requestQuery,
		},
	};
};
