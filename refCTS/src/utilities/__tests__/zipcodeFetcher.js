import { zipcodeFetcher } from '../zipcodeFetcher';
import nock from 'nock';

describe('zipcodeFetcher', () => {
	// Turn off networking before running any tests.
	beforeAll(() => {
		nock.disableNetConnect();
	});

	// Clean up the state of nock after each test.
	afterEach(() => {
		nock.cleanAll();
	});
	// Create a new client. The host does not matter as long
	// as it matches what is going to be called.
	const zipbase = 'https://localhost/zipcode';

	it('fetches the zip', async () => {
		const expected = { lat: 39.0897, long: -77.1798 };
		const scope = nock(zipbase);
		scope.get(`/20874`).reply(200, expected);

		const actual = await zipcodeFetcher(zipbase, '20874');
		expect(actual).toEqual(expected);
		scope.done();
	});

	it('returns null when not found', async () => {
		const scope = nock(zipbase);
		scope.get(`/20874`).reply(404);

		const actual = await zipcodeFetcher(zipbase, '20874');
		expect(actual).toBeNull();
		scope.done();
	});
});
