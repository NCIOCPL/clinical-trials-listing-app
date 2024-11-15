import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { searchDrugAction } from '../searchDrugAction';

describe('searchDrugAction', () => {
	it('should match the returned object', () => {
		const searchText = 'ibuprofen';

		const requestQuery = {
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			sort: 'count',
			order: 'desc',
			category: ['Agent', 'Agent Category'],
			name: searchText,
			size: 10,
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'drugOptions',
				method: 'searchDrug',
				requestParams: requestQuery,
			},
		};

		expect(searchDrugAction({ searchText })).toEqual(expectedAction);
	});

	it('handles exception when called without a search text parameter', () => {
		expect(() => {
			searchDrugAction({ searchText: null });
		}).toThrow('You must specify a drug in order to fetch it.');
	});
});
