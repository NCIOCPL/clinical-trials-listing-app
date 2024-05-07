import nock from 'nock';

import { getClinicalTrials as getClinicalTrialsQuery } from '../../actions/getClinicalTrials';
import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { getClinicalTrials } from '../getClinicalTrials';

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('testing getClinicalTrials', () => {
	beforeAll(() => {
		nock.disableNetConnect();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	it('makes a request to api and returns 57 trials, for trastuzumab', async () => {
		const requestFilters = {
			'arms.interventions.intervention_code': ['C1647'],
		};

		const query = getClinicalTrialsQuery({
			requestFilters,
		});

		const scope = nock('http://example.org')
			.post('/trials', query.payload)
			.reply(200, { total: 57, data: [{}] });
		const response = await getClinicalTrials(client, query.payload);
		expect(response.total).toEqual(57);
		scope.isDone();
	});

	it.each([
		['empty object', {}],
		['null total', { total: null }],
		['count with null trials', { total: 32 }],
		['count with empty trials', { total: 32, data: [] }],
		['zero count with trials', { total: 0, data: [1] }],
	])('Invalid trial responses - %s', async (testCase, resObj) => {
		const requestFilters = {
			'arms.interventions.intervention_code': ['C1647'],
		};

		const query = getClinicalTrialsQuery({
			requestFilters,
		});

		const scope = nock('http://example.org')
			.post('/trials', query.payload)
			.reply(200, resObj);

		await expect(getClinicalTrials(client, query.payload)).rejects.toThrow(
			'Trial count mismatch from the API'
		);
		scope.isDone();
	});

	it('makes a request where the response is 201', async () => {
		const requestFilters = {
			'bad_request.interventions.intervention_code_request': ['BAD404'],
		};

		const query = getClinicalTrialsQuery({
			requestFilters,
		});

		const scope = nock('http://example.org')
			.post('/trials', query.payload)
			.reply(201);
		await expect(getClinicalTrials(client, query.payload)).rejects.toThrow(
			'Unexpected status 201 for fetching clinical trials'
		);
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const requestFilters = {
			'arms.interventions.intervention_code': ['C1647'],
		};

		const query = getClinicalTrialsQuery({
			requestFilters,
		});

		const scope = nock('http://example.org')
			.post('/trials', query.payload)
			.reply(500);
		await expect(getClinicalTrials(client, query.payload)).rejects.toThrow(
			'Unexpected status 500 for fetching clinical trials'
		);
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const requestFilters = {
			'arms.interventions.intervention_code': ['C1647'],
		};

		const query = getClinicalTrialsQuery({
			requestFilters,
		});

		const scope = nock('http://example.org')
			.post('/trials', query.payload)
			.replyWithError('connection refused');
		await expect(getClinicalTrials(client, query.payload)).rejects.toThrow(
			'connection refused'
		);
		scope.isDone();
	});
});
