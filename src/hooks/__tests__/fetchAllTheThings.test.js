import { fetchAllTheThings } from '../fetchAllTheThings';

describe('Fetch All The Things Hook', () => {
	test('Fetching Disease Pretty Name returns expected ListingResponse object', async () => {
		const param = {
			fetchName: 'getListingInformationByName',
			fetchParams: 'breast-cancer',
		};

		const expectedReturn = [
			{
				payload: {
					conceptId: ['C4872'],
					name: {
						label: 'Breast Cancer',
						normalized: 'breast cancer',
					},
					prettyUrlName: 'breast-cancer',
				},
				loading: false,
				error: false
			}
		];
		expect(fetchAllTheThings(param)).toEqual(expectedReturn);
	});
});
