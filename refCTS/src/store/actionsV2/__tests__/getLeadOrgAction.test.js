import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { getLeadOrgAction } from '../getLeadOrgAction';

describe('getLeadOrgAction', () => {
	it('should match returned object', () => {
		const searchText = 'brown';

		const requestQuery = {
			agg_field: 'lead_org',
			agg_name: searchText,
			agg_field_sort: 'agg_field',
			agg_field_order: 'asc',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
			from: 0,
			size: 10,
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'leadorgs',
				method: 'getLeadOrg',
				requestParams: requestQuery,
			},
		};

		expect(getLeadOrgAction({ searchText })).toEqual(expectedAction);
	});

	it('handles exception when called without a search text parameter', () => {
		expect(() => {
			getLeadOrgAction({ searchText: null });
		}).toThrow('You must specify a lead org in order to fetch it.');
	});
});
