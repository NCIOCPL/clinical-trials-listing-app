import nock from 'nock';
import { getListingInformationByName, default as factory } from '../';

describe('Get listing information by name', () => {
	beforeAll(() => {
		nock.disableNetConnect();
	});

	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	const client = factory('http://example.org');

	it('works with name', async () => {
		const expected = {
			conceptId: ['C1234'],
			name: {
				label: 'Spiroplatin',
				normalized: 'spiroplatin',
			},
			prettyUrlName: 'spiroplatin',
		};

		const scope = nock('http://example.org')
			.get('/listing-information/spiroplatin')
			.reply(200, expected);

		const actual = await getListingInformationByName(client, 'spiroplatin');

		expect(actual).toEqual(expected);
		scope.isDone();
	});

	it('handles not found', async () => {
		const scope = nock('http://example.org')
			.get('/listing-information/asdf')
			.reply(404);

		const actual = await getListingInformationByName(client, 'asdf');

		expect(actual).toBeNull();
		scope.isDone();
	});

	it('handles error', async () => {
		const scope = nock('http://example.org')
			.get('/listing-information/asdf')
			.reply(500);

		await expect(getListingInformationByName(client, 'asdf')).rejects.toThrow(
			'Unexpected status 500 for fetching name'
		);

		scope.isDone();
	});

	it('handles unexpected status', async () => {
		const scope = nock('http://example.org')
			.get('/listing-information/asdf')
			.reply(201);

		await expect(getListingInformationByName(client, 'asdf')).rejects.toThrow(
			'Unexpected status 201 for fetching name'
		);

		scope.isDone();
	});

	it('validates name', async () => {
		await expect(getListingInformationByName(client, '!$')).rejects.toThrow(
			'Name does not match valid string, can only include a-z,0-9 and dashes (-)'
		);
	});
});
