import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { getStagesAction } from '../getStagesAction';

describe('getStagesAction', () => {
	it('should match returned object', () => {
		const ancestorIds = 'C4920';

		const requestQuery = {
			type: 'stage',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			ancestor_ids: ancestorIds,
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'stageOptions',
				method: 'getStages',
				requestParams: requestQuery,
			},
		};

		expect(getStagesAction(ancestorIds)).toEqual(expectedAction);
	});

	it('handles exception when called without an ancestor id parameter', () => {
		expect(() => {
			getStagesAction(undefined);
		}).toThrow('You must specify an ancestor id in order to fetch it.');
	});
});
