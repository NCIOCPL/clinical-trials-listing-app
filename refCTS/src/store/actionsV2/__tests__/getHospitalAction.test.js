import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { getHospitalAction } from '../getHospitalAction';

describe('getHospitalAction', () => {
	it('should match returned object', () => {
		const searchText = 'united';

		const requestQuery = {
			name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			size: 10,
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'hospitals',
				method: 'getHospital',
				requestParams: requestQuery,
			},
		};

		expect(getHospitalAction({ searchText })).toEqual(expectedAction);
	});

	it('handles exception when called without a search text parameter', () => {
		expect(() => {
			getHospitalAction({ searchText: null });
		}).toThrow('You must specify a hospital in order to fetch it.');
	});
});
