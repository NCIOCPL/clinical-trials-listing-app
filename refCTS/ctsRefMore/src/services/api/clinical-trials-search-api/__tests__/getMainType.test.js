import axios from 'axios';
import querystring from 'query-string';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { getMainType } from '../getMainType';
import { getMainTypeAction } from '../../../../store/actionsV2';

const mock = require('../../../../../support/mock-data/diseases/empty_maintype_empty_empty.json');

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('getMainType', () => {
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

	it('makes a request to the api and matches returned result for specified search text', async () => {
		const query = getMainTypeAction();

		const requestQuery = {
			type: 'maintype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(200, mock);
		const response = await getMainType(client, query.payload.requestParams);
		expect(response).toEqual(mock);
		scope.isDone();
	});

	it('throws a 400 error', async () => {
		const query = getMainTypeAction();

		const requestQuery = {
			type: 'maintype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(400);
		await expect(
			getMainType(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 400 for fetching main types');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const query = getMainTypeAction();

		const requestQuery = {
			type: 'maintype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(
			getMainType(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 500 for fetching main types');
		scope.isDone();
	});

	it('throws a 204 error status', async () => {
		const query = getMainTypeAction();

		const requestQuery = {
			type: 'maintype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(204);
		await expect(
			getMainType(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 204 for fetching main types');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const query = getMainTypeAction();

		const requestQuery = {
			type: 'maintype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(
			getMainType(client, query.payload.requestParams)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
