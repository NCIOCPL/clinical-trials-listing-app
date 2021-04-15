import { getTrialType } from '../getTrialType';

describe('getTrialType action', () => {
	test('should match getTrialType action', () => {
		const queryParam = 'supportive-care';

		const expectedAction = {
			interceptorName: 'listing-api',
			method: 'GET',
			endpoint: `{{API_HOST}}/trial-type/supportive-care`,
		};

		expect(getTrialType({ queryParam })).toEqual(expectedAction);
	});
});
