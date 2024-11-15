import axios from 'axios';
import querystring from 'query-string';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { getCountries } from '../getCountries';
import { getCountriesAction } from '../../../../store/actionsV2';

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('getCountries', () => {
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

	it('makes a request to the api and matches returned result', async () => {
		const query = getCountriesAction();

		const requestQuery = {
			agg_field: 'sites.org_country',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
		};

		const result = {
			total: 7354,
			aggregations: {
				doc_count: 7354,
				'sites.org_country': [
					{
						key: 'Argentina',
						doc_count: 3,
					},
					{
						key: 'Australia',
						doc_count: 29,
					},
					{
						key: 'Austria',
						doc_count: 1,
					},
					{
						key: 'Belgium',
						doc_count: 2,
					},
					{
						key: 'Brazil',
						doc_count: 3,
					},
					{
						key: 'Canada',
						doc_count: 109,
					},
					{
						key: 'China',
						doc_count: 5,
					},
					{
						key: 'Colombia',
						doc_count: 3,
					},
					{
						key: 'Cyprus',
						doc_count: 1,
					},
					{
						key: 'Denmark',
						doc_count: 1,
					},
					{
						key: 'Egypt',
						doc_count: 1,
					},
					{
						key: 'France',
						doc_count: 3,
					},
					{
						key: 'Germany',
						doc_count: 2,
					},
					{
						key: 'Honduras',
						doc_count: 1,
					},
					{
						key: 'Hong Kong',
						doc_count: 4,
					},
					{
						key: 'India',
						doc_count: 4,
					},
					{
						key: 'Ireland',
						doc_count: 2,
					},
					{
						key: 'Israel',
						doc_count: 6,
					},
					{
						key: 'Italy',
						doc_count: 4,
					},
					{
						key: 'Japan',
						doc_count: 7,
					},
					{
						key: 'Kenya',
						doc_count: 1,
					},
					{
						key: 'Korea, Republic of',
						doc_count: 10,
					},
					{
						key: 'Malawi',
						doc_count: 3,
					},
					{
						key: 'Mexico',
						doc_count: 4,
					},
					{
						key: 'Netherlands',
						doc_count: 4,
					},
					{
						key: 'New Zealand',
						doc_count: 15,
					},
					{
						key: 'Nigeria',
						doc_count: 2,
					},
					{
						key: 'Norway',
						doc_count: 1,
					},
					{
						key: 'Peru',
						doc_count: 3,
					},
					{
						key: 'Poland',
						doc_count: 2,
					},
					{
						key: 'Saudi Arabia',
						doc_count: 13,
					},
					{
						key: 'Singapore',
						doc_count: 4,
					},
					{
						key: 'Spain',
						doc_count: 3,
					},
					{
						key: 'Sweden',
						doc_count: 1,
					},
					{
						key: 'Switzerland',
						doc_count: 6,
					},
					{
						key: 'Taiwan',
						doc_count: 1,
					},
					{
						key: 'Tanzania',
						doc_count: 2,
					},
					{
						key: 'Uganda',
						doc_count: 1,
					},
					{
						key: 'United Kingdom',
						doc_count: 3,
					},
					{
						key: 'United States',
						doc_count: 7315,
					},
					{
						key: 'Zambia',
						doc_count: 1,
					},
					{
						key: 'Zimbabwe',
						doc_count: 1,
					},
				],
			},
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.reply(200, result);
		const response = await getCountries(client, query.payload.requestParams);
		expect(response).toEqual(result);
		scope.isDone();
	});

	it('throws a 404 error', async () => {
		const query = getCountriesAction();

		const requestQuery = {
			agg_field: 'sites.org_country',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.reply(404);
		await expect(
			getCountries(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 404 for fetching countries');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const query = getCountriesAction();

		const requestQuery = {
			agg_field: 'sites.org_country',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(
			getCountries(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 500 for fetching countries');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const query = getCountriesAction();

		const requestQuery = {
			agg_field: 'sites.org_country',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(
			getCountries(client, query.payload.requestParams)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
