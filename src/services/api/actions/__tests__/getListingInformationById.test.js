import { getListingInformationById } from '../getListingInformationById';

describe('getListingInformationById action', () => {
	test('should match getListingInformationById action', () => {
		const queryParam = ['C5816', 'C8550', 'C3813'];

		const expectedAction = {
			interceptorName: 'listing-information-api',
			method: 'GET',
			endpoint: `{{API_HOST}}/listing-information/get?ccode=C5816&ccode=C8550&ccode=C3813`,
		};

		expect(getListingInformationById({ queryParam })).toEqual(expectedAction);
	});
});
