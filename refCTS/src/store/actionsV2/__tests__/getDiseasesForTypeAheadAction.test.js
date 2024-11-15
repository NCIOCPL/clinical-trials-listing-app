import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { getDiseasesForTypeAheadAction } from '../getDiseasesForTypeAheadAction';

describe('getDiseasesForTypeAheadAction', () => {
	it('should match returned object', () => {
		const searchText = 'Breast Cancer';

		const requestQuery = {
			name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			size: 10,
			type: ['maintype', 'subtype', 'stage'],
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'diseases',
				method: 'getDiseases',
				requestParams: requestQuery,
			},
		};

		expect(getDiseasesForTypeAheadAction({ searchText })).toEqual(
			expectedAction
		);
	});
});
