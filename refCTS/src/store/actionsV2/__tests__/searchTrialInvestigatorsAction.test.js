import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { searchTrialInvestigatorsAction } from '../searchTrialInvestigatorsAction';

describe('searchTrialInvestigatorsAction', () => {
	it('should match returned object', () => {
		const searchText = 'Purple';

		const requestQuery = {
			agg_field: 'principal_investigator',
			agg_name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'tis',
				method: 'searchTrialInvestigators',
				requestParams: requestQuery,
			},
		};

		expect(searchTrialInvestigatorsAction({ searchText })).toEqual(
			expectedAction
		);
	});

	it('handles exception when called without an searchText parameter', () => {
		expect(() => {
			searchTrialInvestigatorsAction({ searchText: null });
		}).toThrow('You must specify a trial investigator in order to fetch it.');
	});
});
