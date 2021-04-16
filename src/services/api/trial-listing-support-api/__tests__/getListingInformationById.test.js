import axios from 'axios';
import nock from 'nock';
import { getListingInformationById, default as factory } from '../';

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

describe('Get listing information by id', () => {
	beforeAll(() => {
		nock.disableNetConnect();
	});

	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	const client = factory('https://example.org');

	test('works with single id', async () => {
		const expected = {
			conceptId: ['C1234'],
			name: {
				label: 'Spiroplatin',
				normalized: 'spiroplatin',
			},
			prettyUrlName: 'spiroplatin',
		};

		const scope = nock('https://example.org')
			.get('/listing-information/get?ccode=c1234')
			.reply(200, expected);

		const actual = await getListingInformationById(client, ['c1234']);

		expect(actual).toEqual(expected);
		scope.isDone();
	});

	test('works with multiple ids', async () => {
		const expected = {
			conceptId: ['C7768', 'C139538', 'C139569'],
			name: {
				label: 'Stage II Breast Cancer',
				normalized: 'stage II breast cancer',
			},
			prettyUrlName: 'stage-ii-breast-cancer',
		};

		const scope = nock('https://example.org')
			.get('/listing-information/get?ccode=c7768&ccode=C139538')
			.reply(200, expected);

		const actual = await getListingInformationById(client, [
			'c7768',
			'C139538',
		]);

		expect(actual).toEqual(expected);
		scope.isDone();
	});

	test('handles not found', async () => {
		const scope = nock('https://example.org')
			.get('/listing-information/get?ccode=c9999')
			.reply(404);

		const actual = await getListingInformationById(client, ['c9999']);

		expect(actual).toBeNull();
		scope.isDone();
	});

	test('handles error', async () => {
		const scope = nock('https://example.org')
			.get('/listing-information/get?ccode=c9999')
			.reply(500);

		await expect(getListingInformationById(client, ['c9999'])).rejects.toThrow(
			'Unexpected status 500 for fetching ids'
		);

		scope.isDone();
	});

	test('handles unexpected good status', async () => {
		const scope = nock('https://example.org')
			.get('/listing-information/get?ccode=c9999')
			.reply(201);

		await expect(getListingInformationById(client, ['c9999'])).rejects.toThrow(
			'Unexpected status 201 for fetching ids'
		);

		scope.isDone();
	});
});
