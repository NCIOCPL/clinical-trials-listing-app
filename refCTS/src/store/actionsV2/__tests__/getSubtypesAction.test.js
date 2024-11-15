import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { getSubtypesAction } from '../getSubtypesAction';

describe('getSubtypesAction', () => {
	it('should match returned object', () => {
		const ancestorIds = 'C4920';

		const requestQuery = {
			type: 'subtype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			ancestor_ids: ancestorIds,
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'subtypeOptions',
				method: 'getSubtypes',
				requestParams: requestQuery,
			},
		};

		expect(getSubtypesAction(ancestorIds)).toEqual(expectedAction);
	});

	it('handles exception when called without an ancestor id parameter', () => {
		expect(() => {
			getSubtypesAction(undefined);
		}).toThrow('You must specify an ancestor id in order to fetch it.');
	});
});
