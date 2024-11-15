import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useCtsApi } from '../useCtsApi';
import { useAppSettings } from '../../../store/store';
import {
	getClinicalTrialDescriptionAction,
	getClinicalTrialsAction,
} from '../../../services/api/actions';
import clinicalTrialsSearchClientFactory, {
	getClinicalTrialDescription,
	getClinicalTrials,
} from '../../../services/api/clinical-trials-search-api';

jest.mock('../../../store/store');
jest.mock(
	'../../../services/api/clinical-trials-search-api/getClinicalTrialDescription.js'
);
jest.mock(
	'../../../services/api/clinical-trials-search-api/getClinicalTrials.js'
);
/* ----------------------------------
   !!!! README !!!!
	 When adding a new action you will need to:
	 1. update the "payload.map((res, idx) => {" block below to expose
	    some information for your tests to look for in the document.
	 2. Add a new describe block for all of the tests for your action
   ----------------------------------
 */

const clinicalTrialsSearchClient =
	clinicalTrialsSearchClientFactory('http://example.org');

/* eslint-disable react/prop-types */
const UseCtsApiSupportSample = ({ actions }) => {
	const { loading, payload, error, aborted } = useCtsApi(actions);

	return (
		<div>
			{(() => {
				if (!loading && payload) {
					return (
						<>
							<h1>Payload</h1>
							<ul>
								{payload.length === 0 ? (
									<div>Noop</div>
								) : (
									payload.map((res, idx) => {
										// This will look at the responses in the payload
										// and output a element for you tests to look for.
										//
										// As you add actions to useCtsApi, you need to add
										// conditions here.
										if (res === null) {
											return <li key={idx}>Payload[{idx}]: null </li>;
										} else if (res.nci_id) {
											return (
												<li key={idx}>
													Payload[{idx}]-trialId: {res.nci_id}
												</li>
											);
										} else if (res.total) {
											// Fetch Trials
											// TODO: Make this a better detection of a trial result.
											return (
												<li key={idx}>
													Payload[{idx}]-total: {res.total}
												</li>
											);
										} else {
											return <li key={idx}>Payload[{idx}]: unknown</li>;
										}
									})
								)}
							</ul>
						</>
					);
				} else if (!loading && error) {
					return <h1>Error: {error.message}</h1>;
				} else if (!loading && aborted) {
					return <h1>Aborted: This should not happen</h1>;
				} else {
					return <h1>Loading</h1>;
				}
			})()}
		</div>
	);
};

describe('tests for useCtsApi', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('noop', () => {
		it('tests and empty set of actions', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { clinicalTrialsSearchClient },
				},
			]);

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[]} />);
			});

			expect(screen.getByText('Noop')).toBeInTheDocument();
		});
	});

	describe('getClinicalTrials', () => {
		it('should fetch the data with one requestFilter in the query', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { clinicalTrialsSearchClient },
				},
			]);

			getClinicalTrials.mockReturnValue({
				total: 1,
				trials: [
					{
						brief_summary: 'first summary',
						brief_title: 'first title',
						current_trial_status: 'Active',
						nci_id: 'NCI-2015-00054',
						sites: 0,
					},
				],
			});

			const requestFilters = {
				'arms.interventions.intervention_code': ['C1234'],
			};

			const searchAction = getClinicalTrialsAction({
				from: 0,
				requestFilters,
				size: 1,
			});

			const expected = {
				current_trial_status: [
					'Active',
					'Approved',
					'Enrolling by Invitation',
					'In Review',
					'Temporarily Closed to Accrual',
					'Temporarily Closed to Accrual and Intervention',
				],
				include: [
					'brief_summary',
					'brief_title',
					'current_trial_status',
					'eligibility',
					'eligibility.structured.minAgeInt',
					'eligibility.structured.maxAgeInt',
					'nci_id',
					'nct_id',
					'sites.org_name',
					'sites.org_country',
					'sites.org_state_or_province',
					'sites.org_city',
					'sites.recruitment_status',
				],
				'arms.interventions.intervention_code': ['C1234'],
				from: 0,
				size: 1,
			};

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[searchAction]} />);
			});

			expect(screen.getByText('Payload[0]-total: 1')).toBeInTheDocument();
			expect(getClinicalTrials.mock.calls).toHaveLength(1);
			expect(getClinicalTrials.mock.calls[0][1]).toEqual(expected);
			// Todo: check that the expected text is on the page.
		});

		it('should handle an AbortError when calling getClinicalTrials with client and query params', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { clinicalTrialsSearchClient },
				},
			]);

			getClinicalTrials.mockImplementation(() => {
				const err = new Error('AbortError');
				err.name = 'AbortError';
				throw err;
			});

			const requestFilters = {
				'arms.interventions.intervention_code': ['C1234'],
			};

			const searchAction = getClinicalTrialsAction({
				from: 0,
				requestFilters,
				size: 1,
			});

			const expected = {
				current_trial_status: [
					'Active',
					'Approved',
					'Enrolling by Invitation',
					'In Review',
					'Temporarily Closed to Accrual',
					'Temporarily Closed to Accrual and Intervention',
				],
				include: [
					'brief_summary',
					'brief_title',
					'current_trial_status',
					'eligibility',
					'eligibility.structured.minAgeInt',
					'eligibility.structured.maxAgeInt',
					'nci_id',
					'nct_id',
					'sites.org_name',
					'sites.org_country',
					'sites.org_state_or_province',
					'sites.org_city',
					'sites.recruitment_status',
				],
				'arms.interventions.intervention_code': ['C1234'],
				from: 0,
				size: 1,
			};

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[searchAction]} />);
			});

			expect(
				screen.getByText('Aborted: This should not happen')
			).toBeInTheDocument();
			expect(getClinicalTrials.mock.calls).toHaveLength(1);
			expect(getClinicalTrials.mock.calls[0][1]).toEqual(expected);
		});

		it('should handle any other kind of error when calling getClinicalTrials with client and query params', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { clinicalTrialsSearchClient },
				},
			]);

			getClinicalTrials.mockImplementation(() => {
				throw new Error('Bad Mojo');
			});

			const requestFilters = {
				'arms.interventions.intervention_code': ['C1234'],
			};

			const searchAction = getClinicalTrialsAction({
				from: 0,
				requestFilters,
				size: 1,
			});

			const expected = {
				current_trial_status: [
					'Active',
					'Approved',
					'Enrolling by Invitation',
					'In Review',
					'Temporarily Closed to Accrual',
					'Temporarily Closed to Accrual and Intervention',
				],
				include: [
					'brief_summary',
					'brief_title',
					'current_trial_status',
					'eligibility',
					'eligibility.structured.minAgeInt',
					'eligibility.structured.maxAgeInt',
					'nci_id',
					'nct_id',
					'sites.org_name',
					'sites.org_country',
					'sites.org_state_or_province',
					'sites.org_city',
					'sites.recruitment_status',
				],
				'arms.interventions.intervention_code': ['C1234'],
				from: 0,
				size: 1,
			};

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[searchAction]} />);
			});

			expect(screen.getByText('Error: Bad Mojo')).toBeInTheDocument();
			expect(getClinicalTrials.mock.calls).toHaveLength(1);
			expect(getClinicalTrials.mock.calls[0][1]).toEqual(expected);
		});
	});

	describe('getClinicalTrialDescription', () => {
		it('should fetch the data with with trialId for getClinicalTrialDescription', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { clinicalTrialsSearchClient },
				},
			]);

			getClinicalTrialDescription.mockReturnValue({
				nci_id: 'NCI-2018-02261',
				nct_id: 'NCT00001582',
				protocol_id: '970143',
				ccr_id: '97-C-0143',
				ctep_id: null,
				dcp_id: null,
				other_ids: [
					{
						name: 'Duplicate NCI study protocol identifier',
						value: 'NCI-2013-02071',
					},
					{ name: 'Study Protocol Other Identifier', value: '97-C-0143' },
				],
				current_trial_status: 'Active',
				current_trial_status_date: '1997-07-10',
				brief_title:
					'Investigation of the Human Immune Response in Normal Subjects and Patients With Disorders of the Immune System and Cancer',
				official_title:
					'Collection of Blood, Bone Marrow and Tissue Samples for the Investigation of the Human Immune Response, Lymphoma Biology and HTLV-1 Infection',
				keywords: [
					'Autoimmune Disorder',
					'Immune System Evaluation',
					'Human Response Investigation',
					'Tissue Acquisition',
				],
				brief_summary:
					'This protocol is being submitted to consolidate, update, and expand two previously approved protocols (77-C-0066 and 82-C-0044) into a single protocol. The purpose of this study is to examine the factors involved in the regulation of the immune system of healthy individuals and to define the abnormalities in this regulation that underlies the immunological disorders of patients with a variety of immunodeficiency and malignant disorders. The studies will include the ex vivo phenotypic and functional analysis of the network of cells involved in humoral and cellular immune responses, and in vivo testing for the capacity to make delayed-type hypersensitivity and humoral responses following immunization with a variety of antigens. Individuals to be studied will include patients with a variety of malignancies and patients with primary and secondary immunodeficiency disorders. Selected family members or family members known to be genetic carriers of certain immunodeficiency diseases as well as normal, unrelated individuals will also be studied. A small number of procedures will be used including analysis of blood obtained by phlebotomy, apheresis, skin testing and recall antigens and immunization to assess humoral immunity.',
				detail_description:
					'Background:\r\n\r\n        -  The evaluation of the cells of the immune system and HTLV-1 infection has been a central\r\n           focus of the Metabolism Branch for the past 30 years.\r\n\r\n        -  Blood obtained by apheresis or blood drawing, skin biopsies and other tissues will be\r\n           evaluated for abnormalities related to immunity, HTLV-1 infection and the immune system.\r\n\r\n        -  Advances in the characterization of acquired genetic changes in tumor samples has\r\n\r\n      led to insights for the development of targeted therapy of malignancy\r\n\r\n      Objectives:\r\n\r\n        -  To characterize the molecular biology and immunological features as well as the clinical\r\n           course of individuals with suspected or known disorders of the immune system or cancer\r\n\r\n        -  To define the nature of the immunological, genetic and epigenetic abnormalities in the\r\n           cells of patients with immunodeficiency diseases associated with infections and/or a\r\n           high incidence of malignancy and in patients with cancer.\r\n\r\n        -  To obtain whole blood, plasma and leukocytes, as well as skin, lymph node and bone\r\n           marrow biopsies on patients with immunodeficiency or cancer to investigate the immune\r\n           system.\r\n\r\n      Eligibility:\r\n\r\n        -  Subjects with cancer.\r\n\r\n        -  Subjects with immunodeficiency.\r\n\r\n        -  Subjects with HTLV-1 infection.\r\n\r\n      Design:\r\n\r\n      -This is a natural history study that permits tissue acquisition for analysis of the immune\r\n      system and HTLV-1 infection.',
				primary_purpose: {
					primary_purpose_code: 'OTHER',
					primary_purpose_other_text: 'Not provided by ClinicalTrials.gov',
					primary_purpose_additional_qualifier_code: 'OTHER',
				},
				phase: {
					phase: 'NA',
					phase_other_text: null,
					phase_additional_qualifier_code: 'NO',
				},
				principal_investigator: 'Thomas Alexander Waldmann',
				central_contact: {
					central_contact_email: null,
					central_contact_name: null,
					central_contact_phone: null,
					central_contact_type: null,
				},
				collaborators: null,
				sites: [
					{
						contact_email: null,
						contact_name: 'National Cancer Institute Referral Office',
						contact_phone: '888-624-1937',
						recruitment_status: 'ACTIVE',
						recruitment_status_date: '1997-07-10',
						local_site_identifier: '97-C-0143',
						org_address_line_1: '10 Center Drive',
						org_address_line_2: null,
						org_city: 'Bethesda',
						org_country: 'United States',
						org_email: null,
						org_family: null,
						org_fax: null,
						org_name: 'National Institutes of Health Clinical Center',
						org_to_family_relationship: null,
						org_phone: '800-411-1222',
						org_postal_code: '20892',
						org_state_or_province: 'MD',
						org_status: 'ACTIVE',
						org_status_date: '1997-07-10',
						org_tty: null,
						org_va: false,
						org_coordinates: { lat: 39.0003, lon: -77.1056 },
					},
				],
				eligibility: {
					structured: {
						gender: 'BOTH',
						max_age: '999 Years',
						max_age_number: 999,
						max_age_unit: 'Years',
						min_age: '18 Years',
						min_age_number: 18,
						min_age_unit: 'Years',
						max_age_in_years: 999,
						min_age_in_years: 18,
					},
					unstructured: [
						{
							display_order: 0,
							inclusion_indicator: true,
							description:
								"-  INCLUSION CRITERIA:\r\n\r\n        Participants must meet at least one of these criteria:\r\n\r\n        Have suspected or known disorder of the immune system or cancer\r\n\r\n        Be a known or potential carrier of autoimmune disorder or immunodeficiency disease.\r\n        Specific disorders may include but are not limited to:\r\n\r\n          -  X-linked (severe combined immunodeficiency)\r\n\r\n          -  Autosomal recessive SCID\r\n\r\n          -  X-linked CD40 ligand deficiency\r\n\r\n          -  Common variable immunodeficiency\r\n\r\n          -  Ataxia-telangiectasia\r\n\r\n          -  Wiskott Aldrich syndrome\r\n\r\n          -  DiGeorge syndrome\r\n\r\n          -  Infection with HTLV-1\r\n\r\n        Age greater than or equal to 18 years.\r\n\r\n        Participant must be able to understand and sign informed consent.\r\n\r\n        Participants who will undergo apheresis must have hematocrit greater than 28%, and platelet\r\n        count greater than 50,000.\r\n\r\n        Subjects for whom apheresis is desired but whose counts are lower than those above must be\r\n        evaluated and approved by a Department of Transfusion Medicine consult physician.\r\n\r\n        Weight greater than 25 kg is necessary for apheresis.\r\n\r\n        EXCLUSION CRITERIA:\r\n\r\n        Overall Exclusion Criteria:\r\n\r\n        Pregnant women will not be eligible for any aspect of this protocol.\r\n\r\n        Exclusion Criteria for Apheresis Alone:\r\n\r\n        Any diagnosed medical condition which may be worsened by the apheresis procedure.\r\n        Specifically the participant should not have any of the following:\r\n\r\n          1. Congestive Heart Failure\r\n\r\n          2. History of angina\r\n\r\n          3. Severe hypotension (at the discretion of the participant's physician, the apheresis\r\n             staff and the attending physician from the Department of Transfusion Medicine (DTM)\r\n             per DTM Standard Operating Policies.)\r\n\r\n          4. Poorly controlled hypertension (average baseline blood pressure greater than 160/90)\r\n\r\n          5. History of a coagulation protein disorder.\r\n\r\n        Pediatric patients (less than 18 years) will not undergo apheresis.",
						},
					],
				},
			});

			const trialId = 'NCI-2018-02261';

			const fetchAction = getClinicalTrialDescriptionAction(trialId);

			const expected = 'NCI-2018-02261';

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[fetchAction]} />);
			});

			expect(
				screen.getByText('Payload[0]-trialId: NCI-2018-02261')
			).toBeInTheDocument();
			expect(getClinicalTrialDescription.mock.calls).toHaveLength(1);
			expect(getClinicalTrialDescription.mock.calls[0][1]).toEqual(expected);
			// Todo: check that the expected text is on the page.
		});

		it('should handle an AbortError when calling getClinicalTrialDescription with client and query params', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { clinicalTrialsSearchClient },
				},
			]);

			getClinicalTrialDescription.mockImplementation(() => {
				const err = new Error('AbortError');
				err.name = 'AbortError';
				throw err;
			});

			const trialId = 'NCI-2018-02261';

			const fetchAction = getClinicalTrialDescriptionAction(trialId);

			const expected = 'NCI-2018-02261';

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[fetchAction]} />);
			});

			expect(
				screen.getByText('Aborted: This should not happen')
			).toBeInTheDocument();
			expect(getClinicalTrialDescription.mock.calls).toHaveLength(1);
			expect(getClinicalTrialDescription.mock.calls[0][1]).toEqual(expected);
		});

		it('should handle any other kind of error when calling getClinicalTrialDescription with client and query params', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { clinicalTrialsSearchClient },
				},
			]);

			getClinicalTrialDescription.mockImplementation(() => {
				throw new Error('Bad Mojo');
			});

			const trialId = 'NCI-2018-02261';

			const fetchAction = getClinicalTrialDescriptionAction(trialId);

			const expected = 'NCI-2018-02261';

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[fetchAction]} />);
			});

			expect(screen.getByText('Error: Bad Mojo')).toBeInTheDocument();
			expect(getClinicalTrialDescription.mock.calls).toHaveLength(1);
			expect(getClinicalTrialDescription.mock.calls[0][1]).toEqual(expected);
		});
	});
});
