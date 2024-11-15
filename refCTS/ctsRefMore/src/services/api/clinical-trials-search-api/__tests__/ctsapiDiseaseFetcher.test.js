import axios from 'axios';
import nock from 'nock';

import { getCtsApiDiseaseFetcherAction } from '../../actions';
import { ctsapiDiseaseFetcher } from '../ctsapiDiseaseFetcher';
import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('ctsapiDiseaseFetcher', () => {
	// Turn off networking before running any tests.
	beforeAll(() => {
		nock.disableNetConnect();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});
	// Clean up the state of nock after each test.
	afterEach(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	it('fetches the terms', async () => {
		// Setup the nock scope so we can respond like we are the API.
		const ids = ['C9133', 'C153203'];

		const query = getCtsApiDiseaseFetcherAction(ids);
		const scope = nock('http://example.org')
			.get('/diseases')
			.query(query.payload)
			.reply(200, {
				data: [
					{
						name: 'Adenosquamous Lung Cancer',
						codes: ['C9133'],
						ancestor_ids: ['C2926', 'C4878'],
						parent_ids: ['C2926'],
						type: ['subtype'],
						synonyms: [
							'Adenosquamous Cell Lung Carcinoma',
							'Adenosquamous Lung Carcinoma',
							'Lung Adenosquamous Carcinoma',
						],
						count: 4,
					},
					{
						name: 'Advanced Lung Carcinoma',
						codes: ['C153203'],
						ancestor_ids: ['C4878'],
						parent_ids: ['C4878'],
						type: ['subtype'],
						synonyms: [],
						count: 15,
					},
				],
			});

		const actual = await ctsapiDiseaseFetcher(client, query.payload);
		expect(actual).toEqual([
			{
				name: 'Adenosquamous Lung Cancer',
				codes: ['C9133'],
				parentDiseaseID: ['C2926'],
				type: ['subtype'],
			},
			{
				name: 'Advanced Lung Carcinoma',
				codes: ['C153203'],
				parentDiseaseID: ['C4878'],
				type: ['subtype'],
			},
		]);
		// Assert that nock got the expected request and finished.
		scope.done();
	});

	it('throws a 404 error', async () => {
		const ids = 'C123456';

		const query = getCtsApiDiseaseFetcherAction(ids);
		const scope = nock('http://example.org')
			.get('/diseases')
			.query(query.payload)
			.reply(404);
		await expect(ctsapiDiseaseFetcher(client, query.payload)).rejects.toThrow(
			'Unexpected status 404 for fetching disease code(s)'
		);
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const ids = ['C9133', 'C56789'];

		const query = getCtsApiDiseaseFetcherAction(ids);
		const scope = nock('http://example.org')
			.get('/diseases')
			.query(query.payload)
			.reply(500);
		await expect(ctsapiDiseaseFetcher(client, query.payload)).rejects.toThrow(
			'Unexpected status 500 for fetching disease code(s)'
		);
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const ids = ['C9133', 'C5678'];

		const query = getCtsApiDiseaseFetcherAction(ids);

		const scope = nock('http://example.org')
			.get('/diseases')
			.query(query.payload)
			.replyWithError('connection refused');
		await expect(ctsapiDiseaseFetcher(client, query.payload)).rejects.toThrow(
			'connection refused'
		);
		scope.isDone();
	});

	it('makes a request where the response is 201', async () => {
		const ids = 'C123456';

		const query = getCtsApiDiseaseFetcherAction(ids);
		const scope = nock('http://example.org')
			.get('/diseases')
			.query(query.payload)
			.reply(201);
		await expect(ctsapiDiseaseFetcher(client, query.payload)).rejects.toThrow(
			'Unexpected status 201 for fetching disease code(s)'
		);
		scope.isDone();
	});
});
