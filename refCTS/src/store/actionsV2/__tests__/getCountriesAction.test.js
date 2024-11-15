import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { getCountriesAction } from '../getCountriesAction';

describe('getCountriesAction', () => {
	it('should match returned object', () => {
		const requestQuery = {
			agg_field: 'sites.org_country',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'countries',
				method: 'getCountries',
				requestParams: requestQuery,
			},
		};

		expect(getCountriesAction()).toEqual(expectedAction);
	});
});
