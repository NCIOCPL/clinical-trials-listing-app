import { getListingInformationById } from '../getListingInformationById';

describe('getListingInformationById action', () => {
	it('should match getListingInformationById action', () => {
		const ids = ['C5816', 'C8550', 'C3813'];

		const expectedAction = {
			type: 'id',
			payload: ['C5816', 'C8550', 'C3813'],
		};

		expect(getListingInformationById({ ids })).toEqual(expectedAction);
	});

	it('handles exception when passed incorrect data because we do not use typescript and do not have type safety', () => {
		expect(() => {
			getListingInformationById({ id: [2] });
		}).toThrowError('You must specify ids in order to fetch them.');
		expect(() => {
			getListingInformationById({ ids: 'chicken' });
		}).toThrowError('You must specify ids in order to fetch them.');
		expect(() => {
			getListingInformationById({ ids: null });
		}).toThrowError('You must specify ids in order to fetch them.');
	});
});
