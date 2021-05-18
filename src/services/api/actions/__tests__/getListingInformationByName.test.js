import { getListingInformationByName } from '../getListingInformationByName';

describe('getListingInformationByName action', () => {
	it('should match getListingInformationByName action', () => {
		const name = 'breast-cancer';

		const expectedAction = {
			type: 'name',
			payload: 'breast-cancer',
		};

		expect(getListingInformationByName({ name })).toEqual(expectedAction);
	});

	it('handles exception when passed incorrect data because we do not use typescript and do not have type safety', () => {
		expect(() => {
			getListingInformationByName({ foo: [20] });
		}).toThrowError('You must specify a name in order to fetch it.');
		expect(() => {
			getListingInformationByName({ name: null });
		}).toThrowError('You must specify a name in order to fetch it.');
	});
});
