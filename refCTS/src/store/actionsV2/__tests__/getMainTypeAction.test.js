import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { getMainTypeAction } from '../getMainTypeAction';

describe('getMainTypeAction', () => {
	it('should match returned object', () => {
		const requestQuery = {
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			type: 'maintype',
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'maintypeOptions',
				method: 'getMainType',
				requestParams: requestQuery,
			},
		};

		expect(getMainTypeAction()).toEqual(expectedAction);
	});
});
