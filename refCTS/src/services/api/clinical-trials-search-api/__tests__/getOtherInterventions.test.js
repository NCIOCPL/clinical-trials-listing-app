import axios from 'axios';
import querystring from 'querystring';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { getOtherInterventions } from '../getOtherInterventions';
import { getOtherInterventionsAction } from '../../../../store/actionsV2';

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('getOtherInterventions', () => {
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
		const searchText = 'bio';

		const query = getOtherInterventionsAction({ searchText });

		const requestQuery = {
			category: ['Other'],
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			order: 'desc',
			name: searchText,
			size: 10,
			sort: 'count',
		};

		const result = {
			data: [
				{
					name: 'Laboratory Biomarker Analysis',
					codes: ['C64263'],
					category: ['other'],
					type: ['other', 'procedure/surgery'],
					synonyms: [],
					count: 836,
				},
				{
					name: 'Biospecimen Collection',
					codes: ['C70945'],
					category: ['other'],
					type: ['procedure/surgery', 'other'],
					synonyms: ['Biological Sample Collection'],
					count: 465,
				},
			],
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(200, result);
		const response = await getOtherInterventions(
			client,
			query.payload.requestParams
		);
		expect(response).toEqual(result);
		scope.isDone();
	});

	it('throws a 404 error', async () => {
		const searchText = 'bio';

		const query = getOtherInterventionsAction({ searchText });

		const requestQuery = {
			category: ['Other'],
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			order: 'desc',
			name: searchText,
			size: 10,
			sort: 'count',
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(404);
		await expect(
			getOtherInterventions(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 404 for fetching other treatments');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const searchText = 'bio';

		const query = getOtherInterventionsAction({ searchText });

		const requestQuery = {
			category: ['Other'],
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			order: 'desc',
			name: searchText,
			size: 10,
			sort: 'count',
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(
			getOtherInterventions(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 500 for fetching other treatments');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const searchText = 'bio';

		const query = getOtherInterventionsAction({ searchText });

		const requestQuery = {
			category: ['Other'],
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			order: 'desc',
			name: searchText,
			size: 10,
			sort: 'count',
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(
			getOtherInterventions(client, query.payload.requestParams)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
