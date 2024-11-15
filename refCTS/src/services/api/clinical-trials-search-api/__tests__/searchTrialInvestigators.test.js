import axios from 'axios';
import querystring from 'querystring';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { searchTrialInvestigators } from '../searchTrialInvestigators';
import { searchTrialInvestigatorsAction } from '../../../../store/actionsV2';

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('searchTrialInvestigators', () => {
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
		const searchText = 'Grace Smith';

		const query = searchTrialInvestigatorsAction({ searchText });

		const requestQuery = {
			agg_field: 'principal_investigator',
			agg_name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const result = {
			total: 1,
			trials: [
				{
					current_trial_status: 'Active',
					nct_id: 'NCT04592250',
					brief_title: 'Financial Toxicity in Cancer Patients',
					eligibility: {
						structured: {
							max_age: '999 Years',
							max_age_number: 999,
							min_age_unit: 'Years',
							max_age_unit: 'Years',
							max_age_in_years: 999,
							gender: 'BOTH',
							min_age: '18 Years',
							min_age_number: 18,
							min_age_in_years: 18,
						},
					},
					diseases: [
						{
							inclusion_indicator: 'TRIAL',
							paths: [
								{
									paths: [
										{
											concepts: [
												{ code: 'C9292', label: 'Solid Neoplasm', idx: 0 },
											],
											direction: 1,
										},
									],
								},
							],
							synonyms: ['Malignant Solid Neoplasm'],
							nci_thesaurus_concept_id: 'C132146',
							display_name: 'Malignant Solid Tumor',
							type: ['subtype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Malignant Solid Neoplasm',
							parents: ['C9305', 'C9292'],
						},
						{
							inclusion_indicator: 'TRIAL',
							paths: null,
							synonyms: [
								'HEMOLYMPHORETICULAR TUMOR, MALIGNANT',
								'Hematologic Cancer',
								'Hematologic Malignancy',
								'Hematologic Neoplasm',
								'Hematological Neoplasm',
								'Hematopoietic Cancer',
								'Hematopoietic Neoplasm',
								'Hematopoietic Neoplasms Including Lymphomas',
								'Hematopoietic and Lymphoid Neoplasm',
								'Hematopoietic malignancy, NOS',
								'Malignant Hematologic Neoplasm',
								'Malignant Hematopoietic Neoplasm',
								'hematologic cancer',
							],
							nci_thesaurus_concept_id: 'C27134',
							display_name: 'Hematopoietic and Lymphoid Cell Neoplasm',
							type: ['maintype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Hematopoietic and Lymphoid Cell Neoplasm',
							parents: ['C26323', 'C35813', 'C4741'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: ['Hematopoietic and Lymphoid System Disease'],
							nci_thesaurus_concept_id: 'C35814',
							display_name: 'Hematopoietic and Lymphoid System Disorder',
							type: ['subtype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Hematopoietic and Lymphoid System Disorder',
							parents: ['C27551'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: ['Tumor Morphology', 'Tumor_Morphology'],
							nci_thesaurus_concept_id: 'C4741',
							display_name: 'Neoplasm by Morphology',
							type: ['subtype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Neoplasm by Morphology',
							parents: ['C3262'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: [
								'Blood Disease',
								'Blood Disorder',
								'Hematologic Disorder',
								'Hematological Disorder',
							],
							nci_thesaurus_concept_id: 'C26323',
							display_name: 'Hematologic and Lymphocytic Disorder',
							type: ['subtype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Hematologic and Lymphocytic Disorder',
							parents: ['C35814'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: [
								'Solid Neoplasm',
								'Solid Tumour',
								'Solid tumor, NOS',
								'solid tumor',
							],
							nci_thesaurus_concept_id: 'C9292',
							display_name: 'Solid Tumor',
							type: ['maintype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Solid Neoplasm',
							parents: ['C7062'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: [
								'CA',
								'Cancer',
								'Malignancy',
								'Malignant Growth',
								'Malignant Neoplastic Disease',
								'Malignant Tumor',
								'NEOPLASM, MALIGNANT',
								'Neoplasm, malignant',
								'Tumor, malignant, NOS',
								'Unclassified tumor, malignant',
								'cancer',
								'malignancy',
							],
							nci_thesaurus_concept_id: 'C9305',
							display_name: 'Malignant Neoplasm',
							type: ['subtype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Malignant Neoplasm',
							parents: ['C7062'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: ['Disease by Site'],
							nci_thesaurus_concept_id: 'C27551',
							display_name: 'Disorder by Site',
							type: ['subtype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Disorder by Site',
							parents: ['C2991'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: [],
							nci_thesaurus_concept_id: 'C7062',
							display_name: 'Neoplasm by Special Category',
							type: ['subtype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Neoplasm by Special Category',
							parents: ['C3262'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: [],
							nci_thesaurus_concept_id: 'C3263',
							display_name: 'Neoplasm by Site',
							type: ['subtype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Neoplasm by Site',
							parents: ['C3262'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: [],
							nci_thesaurus_concept_id: 'C7057',
							display_name: 'Disease, Disorder or Finding',
							type: [],
							lead_disease_indicator: 'YES',
							preferred_name: 'Disease, Disorder or Finding',
							parents: [],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: [
								'Diagnosis',
								'Disease',
								'Disease or Disorder',
								'Disease or Disorder, Non-Neoplastic',
								'Diseases',
								'Diseases and Disorders',
								'Disorder',
								'Disorders',
								'condition',
								'disease',
								'disease term',
								'disease type',
								'disease_term',
								'disease_type',
								'disorder',
							],
							nci_thesaurus_concept_id: 'C2991',
							display_name: 'Other Disease',
							type: ['maintype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Disease or Disorder',
							parents: ['C7057'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: [
								'Neoplasia',
								'Neoplasm',
								'Neoplasm, NOS',
								'Neoplasms, NOS',
								'Neoplastic Disease',
								'Neoplastic Growth',
								'Tumor, NOS',
								'neoplasia',
								'neoplasm',
								'tumor',
							],
							nci_thesaurus_concept_id: 'C3262',
							display_name: 'Other Neoplasm',
							type: ['maintype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Neoplasm',
							parents: ['C2991'],
						},
						{
							inclusion_indicator: 'TREE',
							synonyms: ['Hematopoietic and Lymphoid System Tumor'],
							nci_thesaurus_concept_id: 'C35813',
							display_name: 'Hematopoietic and Lymphoid System Neoplasm',
							type: ['subtype'],
							lead_disease_indicator: 'YES',
							preferred_name: 'Hematopoietic and Lymphoid System Neoplasm',
							parents: ['C35814', 'C3263'],
						},
					],
					sites: [
						{
							org_state_or_province: 'TX',
							org_city: 'Houston',
							org_va: false,
							org_country: 'United States',
							org_name: 'M D Anderson Cancer Center',
							org_postal_code: '77030',
							org_coordinates: { lon: -95.4026, lat: 29.7059 },
							recruitment_status: 'ACTIVE',
						},
						{
							org_state_or_province: 'TX',
							org_city: 'Sugar Land',
							org_va: false,
							org_country: 'United States',
							org_name: 'MD Anderson in Sugar Land',
							org_postal_code: '77478',
							org_coordinates: { lon: -95.6056, lat: 29.6152 },
							recruitment_status: 'ACTIVE',
						},
						{
							org_state_or_province: 'TX',
							org_city: 'League City',
							org_va: false,
							org_country: 'United States',
							org_name: 'MD Anderson League City',
							org_postal_code: '77573',
							org_coordinates: { lon: -95.1021, lat: 29.4885 },
							recruitment_status: 'ACTIVE',
						},
					],
					nci_id: 'NCI-2020-07501',
				},
			],
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.reply(200, result);

		const response = await searchTrialInvestigators(
			client,
			query.payload.requestParams
		);
		expect(response).toEqual(result);
		scope.isDone();
	});

	it('throws a 404 error', async () => {
		const searchText = 'Grace Smoth';

		const query = searchTrialInvestigatorsAction({ searchText });

		const requestQuery = {
			agg_field: 'principal_investigator',
			agg_name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.reply(404);
		await expect(
			searchTrialInvestigators(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 404 for fetching trial investigators');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const searchText = 'Grace Smath';

		const query = searchTrialInvestigatorsAction({ searchText });

		const requestQuery = {
			agg_field: 'principal_investigator',
			agg_name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(
			searchTrialInvestigators(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 500 for fetching trial investigators');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const searchText = 'Grace Smeth';

		const query = searchTrialInvestigatorsAction({ searchText });

		const requestQuery = {
			agg_field: 'principal_investigator',
			agg_name: searchText,
			current_trial_status: ACTIVE_TRIAL_STATUSES,
		};

		const scope = nock('http://example.org')
			.get(`/trials?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(
			searchTrialInvestigators(client, query.payload.requestParams)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
