import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { getFindingsAction } from '../getFindingsAction';

describe('getFindingsAction', () => {
	it('should match returned object', () => {
		const ancestorIds = 'C4920';

		const requestQuery = {
			type: 'finding',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			maintype: ancestorIds,
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'findingsOptions',
				method: 'getFindings',
				requestParams: requestQuery,
			},
		};

		expect(getFindingsAction(ancestorIds)).toEqual(expectedAction);
	});

	it('handles exception when called without an ancestor id parameter', () => {
		expect(() => {
			getFindingsAction(undefined);
		}).toThrow('You must specify an ancestor id in order to fetch it.');
	});
});
