import axios from 'axios';
import querystring from 'querystring';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { getLeadOrg } from '../getLeadOrg';
import { getLeadOrgAction } from '../../../../store/actionsV2';

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('getLeadOrg', () => {
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
		const searchText = 'hos';

		const query = getLeadOrgAction({ searchText });

		const requestQuery = {
			agg_field: 'lead_org',
			agg_name: searchText,
			agg_field_sort: 'agg_field',
			agg_field_order: 'asc',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
			from: 0,
			size: 10,
		};

		const result = {
			total: 7358,
			aggregations: {
				doc_count: 419,
				lead_org: [
					{
						key: 'Barretos Cancer Hospital',
						doc_count: 1,
					},
					{
						key: "Boston Children's Hospital",
						doc_count: 1,
					},
					{
						key: "Children's Hospital Colorado",
						doc_count: 11,
					},
					{
						key: "Children's Hospital Los Angeles",
						doc_count: 4,
					},
					{
						key: "Children's Hospital and Medical Center of Omaha",
						doc_count: 1,
					},
					{
						key: "Children's Hospital of Philadelphia",
						doc_count: 12,
					},
					{
						key: "Children's Hospital of Pittsburgh of UPMC",
						doc_count: 5,
					},
					{
						key: "Children's Hospitals and Clinics of Minnesota - Minneapolis",
						doc_count: 3,
					},
					{
						key: "Cincinnati Children's Hospital Medical Center",
						doc_count: 2,
					},
					{
						key: 'Emory University Hospital/Winship Cancer Institute',
						doc_count: 71,
					},
				],
			},
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.reply(200, result);
		const response = await getLeadOrg(client, query.payload.requestParams);
		expect(response).toEqual(result);
		scope.isDone();
	});

	it('throws a 404 error', async () => {
		const searchText = 'hos';

		const query = getLeadOrgAction({ searchText });

		const requestQuery = {
			agg_field: 'lead_org',
			agg_name: searchText,
			agg_field_sort: 'agg_field',
			agg_field_order: 'asc',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
			from: 0,
			size: 10,
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.reply(404);
		await expect(
			getLeadOrg(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 404 for fetching lead organization');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const searchText = 'hos';

		const query = getLeadOrgAction({ searchText });

		const requestQuery = {
			agg_field: 'lead_org',
			agg_name: searchText,
			agg_field_sort: 'agg_field',
			agg_field_order: 'asc',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
			from: 0,
			size: 10,
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(
			getLeadOrg(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 500 for fetching lead organization');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const searchText = 'hos';

		const query = getLeadOrgAction({ searchText });

		const requestQuery = {
			agg_field: 'lead_org',
			agg_name: searchText,
			agg_field_sort: 'agg_field',
			agg_field_order: 'asc',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			include: ['none'],
			from: 0,
			size: 10,
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(
			getLeadOrg(client, query.payload.requestParams)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
