import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { getOtherInterventionsAction } from '../getOtherInterventionsAction';

describe('getOtherInterventionsAction', () => {
	it('should match returned object', () => {
		const searchText = 'bio';

		const requestQuery = {
			category: ['Other'],
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			order: 'desc',
			name: searchText,
			size: 10,
			sort: 'count',
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'treatmentOptions',
				method: 'getOtherInterventions',
				requestParams: requestQuery,
			},
		};

		expect(getOtherInterventionsAction({ searchText })).toEqual(expectedAction);
	});

	it('handles exception when called without a search text parameter', () => {
		expect(() => {
			getOtherInterventionsAction({ searchText: null });
		}).toThrow('You must specify a treatment in order to fetch it.');
	});
});
