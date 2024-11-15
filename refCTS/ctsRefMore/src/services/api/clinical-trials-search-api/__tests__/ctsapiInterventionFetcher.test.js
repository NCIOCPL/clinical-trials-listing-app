import axios from 'axios';
import nock from 'nock';

import { getCtsApiInterventionFetcherAction } from '../../actions';
import { ctsapiInterventionFetcher } from '../ctsapiInterventionFetcher';
import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('ctsapiInterventionFetcher', () => {
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
		const ids = ['C15974', 'C308'];

		const query = getCtsApiInterventionFetcherAction(ids);
		const scope = nock('http://example.org')
			.get('/interventions')
			.query(query.payload)
			.reply(200, {
				data: [
					{
						name: 'Biological Cancer Immunotherapy',
						codes: ['C15974'],
						category: ['agent category'],
						type: ['biological/vaccine'],
						synonyms: [
							'Biological Immunotherapy for Cancer',
							'Immunotherapy, Cancer, Biological',
						],
						count: 2,
					},
					{
						name: 'Immunotherapy',
						codes: ['C308'],
						category: ['agent category', 'none', 'agent'],
						type: [
							'biological/vaccine',
							'drug',
							'other',
							'radiation',
							'procedure/surgery',
							'dietary supplement',
						],
						synonyms: [
							'Immunotherapy',
							'BRM',
							'Biological Response Modifier',
							'Biomodulators',
							'Immune Mediators',
							'Immune Modulators',
							'Immune Regulators',
							'Immunomodulating Agent',
							'Immunomodulators',
							'Immunomodulatory Agent',
							'Immunopotentiators',
							'Immunotherapy Agent',
						],
						count: 2934,
					},
				],
			});

		const actual = await ctsapiInterventionFetcher(client, query.payload);
		expect(actual).toEqual([
			{
				name: 'Biological Cancer Immunotherapy',
				codes: ['C15974'],
				category: ['agent category'],
				type: ['biological/vaccine'],
				synonyms: [
					'Biological Immunotherapy for Cancer',
					'Immunotherapy, Cancer, Biological',
				],
			},
			{
				name: 'Immunotherapy',
				codes: ['C308'],
				category: ['agent category', 'none', 'agent'],
				type: [
					'biological/vaccine',
					'drug',
					'other',
					'radiation',
					'procedure/surgery',
					'dietary supplement',
				],
				synonyms: [
					'Immunotherapy',
					'BRM',
					'Biological Response Modifier',
					'Biomodulators',
					'Immune Mediators',
					'Immune Modulators',
					'Immune Regulators',
					'Immunomodulating Agent',
					'Immunomodulators',
					'Immunomodulatory Agent',
					'Immunopotentiators',
					'Immunotherapy Agent',
				],
			},
		]);
		// Assert that nock got the expected request and finished.
		scope.done();
	});

	it('throws a 404 error', async () => {
		const ids = 'C123456';

		const query = getCtsApiInterventionFetcherAction(ids);
		const scope = nock('http://example.org')
			.get('/interventions')
			.query(query.payload)
			.reply(404);
		await expect(
			ctsapiInterventionFetcher(client, query.payload)
		).rejects.toThrow(
			'Unexpected status 404 for fetching interventions code(s)'
		);
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const ids = ['C9133', 'C56789'];

		const query = getCtsApiInterventionFetcherAction(ids);
		const scope = nock('http://example.org')
			.get('/interventions')
			.query(query.payload)
			.reply(500);
		await expect(
			ctsapiInterventionFetcher(client, query.payload)
		).rejects.toThrow(
			'Unexpected status 500 for fetching interventions code(s)'
		);
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const ids = ['C9133', 'C5678'];

		const query = getCtsApiInterventionFetcherAction(ids);

		const scope = nock('http://example.org')
			.get('/interventions')
			.query(query.payload)
			.replyWithError('connection refused');
		await expect(
			ctsapiInterventionFetcher(client, query.payload)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});

	it('makes a request where the response is 201', async () => {
		const ids = 'C123456';

		const query = getCtsApiInterventionFetcherAction(ids);
		const scope = nock('http://example.org')
			.get('/interventions')
			.query(query.payload)
			.reply(201);
		await expect(
			ctsapiInterventionFetcher(client, query.payload)
		).rejects.toThrow(
			'Unexpected status 201 for fetching interventions code(s)'
		);
		scope.isDone();
	});
});
