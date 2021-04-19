import { getListingInformationById } from '../getListingInformationById';

describe('getListingInformationById action', () => {
	test('should match getListingInformationById action', () => {
		const ids = ['C5816', 'C8550', 'C3813'];

		const expectedAction = {
			type: 'id',
			payload: ['C5816', 'C8550', 'C3813'],
		};

		expect(getListingInformationById({ ids })).toEqual(expectedAction);
	});
});
