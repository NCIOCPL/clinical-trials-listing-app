import axios from 'axios';
import querystring from 'query-string';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { getDiseasesForTypeAhead } from '../getDiseasesForTypeAhead';
import { getDiseasesForTypeAheadAction } from '../../../../store/actionsV2';

const mock = {
	data: [
		{
			name: 'Bilateral Breast Cancer',
			codes: ['C8287'],
			ancestor_ids: ['C4872'],
			type: ['subtype'],
			parent_ids: ['C4872'],
			synonyms: ['Bilateral Breast Carcinoma'],
			count: 9,
		},
		{
			name: 'Breast Cancer',
			codes: ['C4872'],
			ancestor_ids: [],
			type: ['maintype'],
			parent_ids: [],
			synonyms: [
				'Breast Carcinoma',
				'Breast cancer, NOS',
				'Cancer of Breast',
				'Cancer of the Breast',
				'Carcinoma of Breast',
				'Carcinoma of the Breast',
				'Mammary Carcinoma',
				'breast cancer',
			],
			count: 977,
		},
	],
};

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('getDiseasesForTypeAhead', () => {
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
		const searchText = 'Breast Cancer';
		const query = getDiseasesForTypeAheadAction({ searchText });

		const requestQuery = {
			name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			size: 10,
			type: ['maintype', 'subtype', 'stage'],
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(200, mock);
		const response = await getDiseasesForTypeAhead(
			client,
			query.payload.requestParams
		);
		expect(response).toEqual(mock);
		scope.isDone();
	});

	it('throws a 400 error', async () => {
		const searchText = 'Breast Cancer';
		const query = getDiseasesForTypeAheadAction({ searchText });

		const requestQuery = {
			name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			size: 10,
			type: ['maintype', 'subtype', 'stage'],
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(400);
		await expect(
			getDiseasesForTypeAhead(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 400 for fetching diseases');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const searchText = 'Breast Cancer';
		const query = getDiseasesForTypeAheadAction({ searchText });

		const requestQuery = {
			name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			size: 10,
			type: ['maintype', 'subtype', 'stage'],
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(
			getDiseasesForTypeAhead(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 500 for fetching diseases');
		scope.isDone();
	});

	it('throws a 204 error status', async () => {
		const searchText = 'Breast Cancer';
		const query = getDiseasesForTypeAheadAction({ searchText });

		const requestQuery = {
			name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			size: 10,
			type: ['maintype', 'subtype', 'stage'],
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(204);
		await expect(
			getDiseasesForTypeAhead(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 204 for fetching diseases');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const searchText = 'Breast Cancer';
		const query = getDiseasesForTypeAheadAction({ searchText });

		const requestQuery = {
			name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			size: 10,
			type: ['maintype', 'subtype', 'stage'],
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(
			getDiseasesForTypeAhead(client, query.payload.requestParams)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
