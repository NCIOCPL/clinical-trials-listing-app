import { getListingInformationByName } from '../getListingInformationByName';

describe('getListingInformationByName action', () => {
	test('should match getListingInformationByName action', () => {
		const queryParam = 'breast-cancer';

		const expectedAction = {
			interceptorName: 'listing-information-api',
			method: 'GET',
			endpoint: `{{API_HOST}}/listing-information/breast-cancer`,
		};

		expect(getListingInformationByName({ queryParam })).toEqual(expectedAction);
	});
});
