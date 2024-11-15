import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of countries from the CTS api
 * @return {{payload: {cacheKey: string, method: string, service: string, requestParams: {include: [string], current_trial_status: string[], size: number, agg_field: string}}, type: string}}
 */
export const getCountriesAction = () => {
	const requestQuery = {
		agg_field: 'sites.org_country',
		current_trial_status: ACTIVE_TRIAL_STATUSES,
		include: ['none'],
	};

	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'countries',
			method: 'getCountries',
			requestParams: requestQuery,
		},
	};
};
