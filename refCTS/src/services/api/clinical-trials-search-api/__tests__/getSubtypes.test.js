import axios from 'axios';
import querystring from 'query-string';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { getSubtypes } from '../getSubtypes';
import { getSubtypesAction } from '../../../../store/actionsV2';

const mock = require('../../../../../support/mock-data/diseases/empty_subtype_empty_empty_C4912.json');

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('getSubtypes', () => {
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

	it('makes a request to the api and matches returned result for specified ancestor id', async () => {
		const ancestorIds = 'C4912';
		const query = getSubtypesAction(ancestorIds);

		const requestQuery = {
			type: 'subtype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			ancestor_ids: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(200, mock);
		const response = await getSubtypes(client, query.payload.requestParams);
		expect(response).toEqual(mock);
		scope.isDone();
	});

	it('throws a 400 error', async () => {
		const ancestorIds = 'C1234';
		const query = getSubtypesAction(ancestorIds);

		const requestQuery = {
			type: 'subtype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			ancestor_ids: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(400);
		await expect(
			getSubtypes(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 400 for fetching subtypes');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const ancestorIds = 'C4912';
		const query = getSubtypesAction(ancestorIds);

		const requestQuery = {
			type: 'subtype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			ancestor_ids: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(
			getSubtypes(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 500 for fetching subtypes');
		scope.isDone();
	});

	it('throws a 204 error status', async () => {
		const ancestorIds = 'C4912';
		const query = getSubtypesAction(ancestorIds);

		const requestQuery = {
			type: 'subtype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			ancestor_ids: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(204);
		await expect(
			getSubtypes(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 204 for fetching subtypes');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const ancestorIds = 'C4912';
		const query = getSubtypesAction(ancestorIds);

		const requestQuery = {
			type: 'subtype',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			ancestor_ids: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(
			getSubtypes(client, query.payload.requestParams)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
