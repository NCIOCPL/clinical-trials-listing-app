import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of lead org from the CTS api matching the search text and request filters provided
 * @param {Number} from - the offset to start results from
 * @param {String} searchText - free text string matching lead org name
 * @param size - the number of results
 * @return {{payload: {cacheKey: string, service: string, requests: [{method: string, requestParams: {include: [string], current_trial_status: string[], size: number, name: *, from: number}}]}, type: string}}
 */
export const getLeadOrgAction = ({ from = 0, searchText, size = 10 }) => {
	if (!searchText || searchText === '') {
		throw new Error('You must specify a lead org in order to fetch it.');
	}

	const requestQuery = {
		agg_field: 'lead_org',
		agg_name: searchText,
		agg_field_sort: 'agg_field',
		agg_field_order: 'asc',
		current_trial_status: ACTIVE_TRIAL_STATUSES,
		include: ['none'],
		from,
		size,
	};

	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'leadorgs',
			method: 'getLeadOrg',
			requestParams: requestQuery,
		},
	};
};
