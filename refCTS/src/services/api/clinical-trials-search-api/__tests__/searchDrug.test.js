import axios from 'axios';
import querystring from 'querystring';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { searchDrug } from '../searchDrug';
import { searchDrugAction } from '../../../../store/actionsV2';

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('searchDrug', () => {
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
		const searchText = 'chi';

		const query = searchDrugAction({ searchText });

		const requestQuery = {
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			sort: 'count',
			order: 'desc',
			category: ['Agent', 'Agent Category'],
			name: searchText,
			size: 10,
		};

		const result = {
			data: [
				{
					name: 'Chimeric Antigen Receptor T-Cell Therapy',
					codes: ['C137999', 'C126102'],
					category: ['agent category', 'agent'],
					type: ['biological/vaccine', 'drug'],
					synonyms: [
						'Chimeric Antigen Receptor T-Cell Therapy',
						'CAR T Cell',
						'CAR T Cells',
						'CAR T-cells',
						'CAR-T Cell',
						'CAR-T Cells',
						'CAR-modified T-cells',
						'Chimeric-antigen Receptor T-lymphocytes',
					],
					count: 147,
				},
				{
					name: 'Flutamide',
					codes: ['C509'],
					category: ['agent'],
					type: ['drug'],
					synonyms: [
						'Apimid',
						'Cebatrol',
						'Chimax',
						'Cytomid',
						'Drogenil',
						'Euflex',
						'Eulexine',
						'Flucinome',
						'Fluken',
						'Flulem',
						'Fluta-Gry',
						'Flutabene',
						'Flutacan',
						'Flutamex',
						'Flutamide',
						'Flutamin',
						'Flutan',
						'Flutaplex',
						'Fugerel',
						'Grisetin',
						'Oncosal',
						'Profamid',
						'Prostacur',
						'Prostadirex',
						'Prostica',
						'Prostogenat',
						'Tafenil',
						'Tecnoflut',
						'Testotard',
					],
					count: 5,
				},
				{
					name: 'Autologous CD19/CD22 Chimeric Antigen Receptor T-cells CT120',
					codes: ['C142834'],
					category: ['agent'],
					type: ['biological/vaccine'],
					synonyms: [
						'Autologous CD19/CD22 Chimeric Antigen Receptor T-cells CT120',
					],
					count: 3,
				},
				{
					name: 'Autologous CD19-28z Chimeric Antigen Receptor-expressing T-lymphocytes',
					codes: ['C106247'],
					category: ['agent'],
					type: ['biological/vaccine'],
					synonyms: [
						'Autologous CD19-28z Chimeric Antigen Receptor-expressing T-lymphocytes',
					],
					count: 2,
				},
				{
					name: 'Autologous Anti-CD19 Chimeric Antigen Receptor T-cells SJCAR19',
					codes: ['C142887'],
					category: ['agent'],
					type: ['biological/vaccine'],
					synonyms: [
						'Autologous Anti-CD19 Chimeric Antigen Receptor T-cells SJCAR19',
					],
					count: 1,
				},
				{
					name: 'Autologous Desmoglein-3 Chimeric Autoantibody Receptor T-cells DSG3-CAART',
					codes: ['C182441'],
					category: ['agent'],
					type: ['biological/vaccine'],
					synonyms: [
						'Autologous Desmoglein-3 Chimeric Autoantibody Receptor T-cells DSG3-CAART',
					],
					count: 1,
				},
				{
					name: 'Bcl-XL Proteolysis Targeting Chimera DT2216',
					codes: ['C179922'],
					category: ['agent'],
					type: ['biological/vaccine'],
					synonyms: ['Bcl-XL Proteolysis Targeting Chimera DT2216'],
					count: 1,
				},
				{
					name: 'Chinese Herbal Formulation PHY906',
					codes: ['C91704'],
					category: ['agent'],
					type: ['dietary supplement'],
					synonyms: ['Chinese Herbal Formulation PHY906', 'TCM PHY906'],
					count: 1,
				},
				{
					name: 'ER alpha Proteolysis-targeting Chimera Protein Degrader ARV-471',
					codes: ['C165420'],
					category: ['agent'],
					type: ['drug'],
					synonyms: [
						'ER alpha Proteolysis-targeting Chimera Protein Degrader ARV-471',
					],
					count: 1,
				},
			],
			total: 9,
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(200, result);

		const response = await searchDrug(client, query.payload.requestParams);

		expect(response).toEqual(result);
		scope.isDone();
	});

	it('throws a 204 error status', async () => {
		const searchText = 'bev';

		const query = searchDrugAction({ searchText });

		const requestQuery = {
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			sort: 'count',
			order: 'desc',
			category: ['Agent', 'Agent Category'],
			name: searchText,
			size: 10,
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(204);
		await expect(
			searchDrug(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 204 for fetching drugs');
		scope.isDone();
	});

	it('throws a 404 error', async () => {
		const searchText = 'chi';

		const query = searchDrugAction({ searchText });

		const requestQuery = {
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			sort: 'count',
			order: 'desc',
			category: ['Agent', 'Agent Category'],
			name: searchText,
			size: 10,
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(404);
		await expect(
			searchDrug(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 404 for fetching drugs');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const searchText = 'chi';

		const query = searchDrugAction({ searchText });

		const requestQuery = {
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			sort: 'count',
			order: 'desc',
			category: ['Agent', 'Agent Category'],
			name: searchText,
			size: 10,
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(
			searchDrug(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 500 for fetching drugs');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const searchText = 'chi';

		const query = searchDrugAction({ searchText });

		const requestQuery = {
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			sort: 'count',
			order: 'desc',
			category: ['Agent', 'Agent Category'],
			name: searchText,
			size: 10,
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(
			searchDrug(client, query.payload.requestParams)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
