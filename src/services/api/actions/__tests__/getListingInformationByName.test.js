import { getListingInformationByName } from '../getListingInformationByName';

describe('getListingInformationByName action', () => {
	test('should match getListingInformationByName action', () => {
		const name = 'breast-cancer';

		const expectedAction = {
			type: 'name',
			payload: 'breast-cancer',
		};

		expect(getListingInformationByName({ name })).toEqual(expectedAction);
	});
});
