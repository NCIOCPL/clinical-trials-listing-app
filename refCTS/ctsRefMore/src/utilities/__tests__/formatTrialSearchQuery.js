import { defaultState } from './defaultStateCopy';
import { formatTrialSearchQuery } from '../formatTrialSearchQuery';
import {
	ACTIVE_TRIAL_STATUSES,
	ACTIVE_RECRUITMENT_STATUSES,
	SEARCH_RETURNS_FIELDS,
} from '../../constants';

/**
 * This file contains tests for the formatTrialSearchQuery
 * method in utilities.js.
 */

/**
 * The base query params added to any search.
 */
const BASE_EXPECTED_QUERY = {
	current_trial_status: ACTIVE_TRIAL_STATUSES,
	from: 0,
	include: SEARCH_RETURNS_FIELDS,
};

// For these tests the parameters are:
// - The test name
// - Any overrides to the default state, e.g. { keywordPhrases: "chicken" }
// - The expected API query params over the default ones, e.g {"keyword": "chicken"}
// The test will then merge the defaultState with the params to make the input
// and merge the additional query params with the base query to make the
// expected object.
const mappingTestCases = [
	['empty query', {}, {}],
	[
		'age parameter',
		{ age: 35 },
		{
			'eligibility.structured.max_age_in_years_gte': 35,
			'eligibility.structured.min_age_in_years_lte': 35,
		},
	],
	/* TODO: GENDER MAPPING TEST */
	['phrase parameter', { keywordPhrases: 'chicken' }, { keyword: 'chicken' }],
	[
		'single trial type',
		{
			trialTypes: getTrialTypesObject(['treatment']),
		},
		{
			primary_purpose: ['treatment'],
		},
	],
	[
		'multiple trial type',
		{
			trialTypes: getTrialTypesObject(['treatment', 'supportive_care']),
		},
		{
			primary_purpose: ['treatment', 'supportive_care'],
		},
	],
	[
		'principal investigator',
		{
			investigator: { term: 'Sophia Smith', termKey: 'Sophia Smith' },
		},
		{
			['principal_investigator._fulltext']: 'Sophia Smith',
		},
	],
	[
		'lead organization',
		{
			leadOrg: { term: 'Mayo Clinic', termKey: 'Mayo Clinic' },
		},
		{
			['lead_org._fulltext']: 'Mayo Clinic',
		},
	],
	[
		'single trial id',
		{
			trialId: 'NCI-2015-00054',
		},
		{
			trial_ids: ['NCI-2015-00054'],
		},
	],
	[
		'multiple trial id',
		{
			trialId: 'SWOG, CCOG',
		},
		{
			trial_ids: ['SWOG', 'CCOG'],
		},
	],
	[
		'healthy volunteers',
		{
			healthyVolunteers: true,
		},
		{
			['eligibility.structured.accepts_healthy_volunteers']: true,
		},
		// NOTE: New code does not support a way to indicate
		// eligibility.structured.accepts_healthy_volunteers: false
	],
	/************************
	 * Phase Tests
	 ************************/
	[
		'phase i',
		{
			trialPhases: getPhaseObject(['i']),
		},
		{
			phase: ['i', 'i_ii'],
		},
	],
	[
		'phase ii',
		{
			trialPhases: getPhaseObject(['ii']),
		},
		{
			phase: ['ii', 'i_ii', 'ii_iii'],
		},
	],
	[
		'phase iii',
		{
			trialPhases: getPhaseObject(['iii']),
		},
		{
			phase: ['iii', 'ii_iii'],
		},
	],
	[
		'phase iv',
		{
			trialPhases: getPhaseObject(['iv']),
		},
		{
			phase: ['iv'],
		},
	],
	[
		'all phases selected',
		{
			trialPhases: getPhaseObject(['i', 'ii', 'iii', 'iv']),
		},
		{
			phase: ['i', 'ii', 'iii', 'iv', 'i_ii', 'ii_iii'],
		},
	],

	/***********************
	 * Location test cases
	 ***********************/
	[
		'is VA only (true)',
		{
			vaOnly: true,
		},
		{
			'sites.org_va': true,
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	[
		'NIH campus',
		{
			location: 'search-location-nih',
		},
		{
			'sites.org_postal_code': '20892',
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	[
		'hospital',
		{
			hospital: {
				term: 'M D Anderson Cancer Center',
				termKey: 'M D Anderson Cancer Center',
			},
			location: 'search-location-hospital',
		},
		{
			'sites.org_name._fulltext': 'M D Anderson Cancer Center',
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	[
		'country',
		{
			country: 'United States',
			location: 'search-location-country',
		},
		{
			'sites.org_country': 'United States',
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	[
		'state',
		{
			// For the purposes of this function we want to make
			// sure that it is not adding in anything we did not
			// ask for.
			country: 'United States',
			states: [{ abbr: 'MD', name: 'Maryland' }],
			location: 'search-location-country',
		},
		{
			'sites.org_country': 'United States',
			'sites.org_state_or_province': ['MD'],
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	[
		'city',
		{
			// For the purposes of this function we want to make
			// sure that it is not adding in anything we did not
			// ask for.
			country: undefined,
			city: 'Baltimore',
			location: 'search-location-country',
		},
		{
			'sites.org_city': 'Baltimore',
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	[
		'city and state',
		{
			// For the purposes of this function we want to make
			// sure that it is not adding in anything we did not
			// ask for.
			country: 'United States',
			states: [{ abbr: 'MD', name: 'Maryland' }],
			city: 'Baltimore',
			location: 'search-location-country',
		},
		{
			'sites.org_country': 'United States',
			'sites.org_city': 'Baltimore',
			'sites.org_state_or_province': ['MD'],
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	[
		'country, city and state',
		{
			// For the purposes of this function we want to make
			// sure that it is not adding in anything we did not
			// ask for.
			country: 'United States',
			states: [{ abbr: 'MD', name: 'Maryland' }],
			city: 'Baltimore',
			location: 'search-location-country',
		},
		{
			'sites.org_country': 'United States',
			'sites.org_city': 'Baltimore',
			'sites.org_state_or_province': ['MD'],
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	[
		'Canadian city',
		{
			// For the purposes of this function we want to make
			// sure that it is not adding in anything we did not
			// ask for.
			country: 'Canada',
			city: 'Toronto',
			location: 'search-location-country',
		},
		{
			'sites.org_country': 'Canada',
			'sites.org_city': 'Toronto',
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	[
		'Zip Code',
		{
			location: 'search-location-zip',
			zip: '20850',
			zipRadius: '500',
			zipCoords: { lat: 39.0897, long: -77.1798 },
		},
		{
			'sites.org_coordinates_lat': '39.0897',
			'sites.org_coordinates_lon': '-77.1798',
			'sites.org_coordinates_dist': '500mi',
			'sites.recruitment_status': ACTIVE_RECRUITMENT_STATUSES,
		},
	],
	/***********************
	 * Disease Params
	 ***********************/
	[
		'main type with one code',
		{
			cancerType: { name: 'Breast Cancer', codes: ['C4872'] },
		},
		{
			maintype: ['C4872'],
		},
	],
	[
		'main type with multiple codes',
		{
			cancerType: { name: 'TEST Cancer', codes: ['C4872', 'C6789'] },
		},
		{
			maintype: ['C4872', 'C6789'],
		},
	],
	[
		'one sub-type/one code',
		{
			subtypes: [{ name: 'Inflammatory Breast Cancer', codes: ['C4001'] }],
		},
		{
			subtype: ['C4001'],
		},
	],
	[
		'one sub-type/two codes',
		{
			subtypes: [{ name: 'Test Subtype Cancer', codes: ['C5678', 'C1234'] }],
		},
		{
			subtype: ['C5678', 'C1234'],
		},
	],
	[
		'two sub-types mixed',
		{
			subtypes: [
				{ name: 'Inflammatory Breast Cancer', codes: ['C4001'] },
				{ name: 'Test Subtype Cancer', codes: ['C5678', 'C1234'] },
			],
		},
		{
			subtype: ['C4001', 'C5678', 'C1234'],
		},
	],
	[
		'one stage/one code',
		{
			stages: [
				{ name: 'Stage IIIB Inflammatory Breast Cancer', codes: ['C9246'] },
			],
		},
		{
			stage: ['C9246'],
		},
	],
	[
		'one stage/two codes',
		{
			stages: [{ name: 'Test Cancer Stage', codes: ['C12345', 'C678910'] }],
		},
		{
			stage: ['C12345', 'C678910'],
		},
	],
	[
		'two stages mixed',
		{
			stages: [
				{ name: 'Stage IIIB Inflammatory Breast Cancer', codes: ['C9246'] },
				{ name: 'Test Cancer Stage', codes: ['C12345', 'C678910'] },
			],
		},
		{
			stage: ['C9246', 'C12345', 'C678910'],
		},
	],
	[
		'one finding/one code',
		{
			findings: [{ name: 'Test Finding', codes: ['C1234'] }],
		},
		{
			finding: ['C1234'],
		},
	],
	[
		'one finding/two codes',
		{
			findings: [{ name: 'Test Finding 2', codes: ['C2345', 'C3456'] }],
		},
		{
			finding: ['C2345', 'C3456'],
		},
	],
	[
		'two findings mixed',
		{
			findings: [
				{ name: 'Test Finding', codes: ['C1234'] },
				{ name: 'Test Finding 2', codes: ['C2345', 'C3456'] },
			],
		},
		{
			finding: ['C1234', 'C2345', 'C3456'],
		},
	],
	//TODO: Handle combo
	//TODO: Test case for Subtype same as Stage, e.g. DCIS
	/**************
	 * Drug / Interventions tests
	 **************/
	[
		'drug / one id',
		{
			drugs: [{ name: 'Trastuzumab', codes: ['C1674'] }],
		},
		{
			'arms.interventions.nci_thesaurus_concept_id': ['C1674'],
		},
	],
	[
		'drug / two ids',
		{
			drugs: [{ name: 'Immunotherapy', codes: ['C308', 'C15262'] }],
		},
		{
			'arms.interventions.nci_thesaurus_concept_id': ['C308', 'C15262'],
		},
	],
	[
		'two drugs mixed',
		{
			drugs: [
				{ name: 'Trastuzumab', codes: ['C1674'] },
				{ name: 'Immunotherapy', codes: ['C308', 'C15262'] },
			],
		},
		{
			'arms.interventions.nci_thesaurus_concept_id': [
				'C1674',
				'C308',
				'C15262',
			],
		},
	],
	[
		'other intervention / one id',
		{
			treatments: [{ name: 'Surgery', codes: ['C17173'] }],
		},
		{
			'arms.interventions.nci_thesaurus_concept_id': ['C17173'],
		},
	],
	[
		'other intervention / two ids',
		{
			treatments: [
				{
					name: "Can't Find Example Other With Two Codes",
					codes: ['C308', 'C15262'],
				},
			],
		},
		{
			'arms.interventions.nci_thesaurus_concept_id': ['C308', 'C15262'],
		},
	],
	[
		'two other interventions mixed',
		{
			treatments: [
				{ name: 'Surgery', codes: ['C17173'] },
				{
					name: "Can't Find Example Other With Two Codes",
					codes: ['C308', 'C15262'],
				},
			],
		},
		{
			'arms.interventions.nci_thesaurus_concept_id': [
				'C17173',
				'C308',
				'C15262',
			],
		},
	],
	[
		'one drug / one other',
		{
			drugs: [{ name: 'Immunotherapy', codes: ['C308', 'C15262'] }],
			treatments: [{ name: 'Surgery', codes: ['C17173'] }],
		},
		{
			'arms.interventions.nci_thesaurus_concept_id': [
				'C308',
				'C15262',
				'C17173',
			],
		},
	],
];

describe('formatTrialSearchQuery maps form to query', () => {
	// Test iterates over multiple cases defined by mappingTestCases
	it.each(mappingTestCases)(
		'%# - correctly maps %s',
		(testName, formStateChanges, additionalExpectedQuery) => {
			const testForm = {
				...defaultState,
				...formStateChanges,
			};

			const expected = {
				...additionalExpectedQuery,
				...BASE_EXPECTED_QUERY,
			};

			const actual = formatTrialSearchQuery(testForm);
			expect(actual).toEqual(expected);
		}
	);
});

/**
 * Helper function to set enabled phases.
 *
 * @param array phases
 *   List of phases to enable
 */
function getPhaseObject(phases) {
	return defaultState.trialPhases.map((phase) => {
		if (phases.includes(phase.value)) {
			return {
				...phase,
				checked: true,
			};
		} else {
			return phase;
		}
	});
}

/**
 * Helper function to set enab led trial types.
 *
 * @param array type
 *   List of trial types to enable
 */
function getTrialTypesObject(types) {
	return defaultState.trialTypes.map((type) => {
		if (types.includes(type.value)) {
			return {
				...type,
				checked: true,
			};
		} else {
			return type;
		}
	});
}
