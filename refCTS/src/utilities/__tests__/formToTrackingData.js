import { formToTrackingData } from '../formToTrackingData';
import { defaultState } from './defaultStateCopy';

import {
	API_DISEASE_MOCKS,
	API_INTERVENTION_MOCKS,
} from './queryStringToSearchCriteria.common';

const testCases = [
	// Empty is the MOST IMPORTANT test case.
	// If someone messes with the defaults, this will be
	// the first to fail.
	[
		'empty',
		{},
		{
			location: 'search-location-all',
		},
	],
	/********************
	 * DISEASES
	 ********************/
	[
		'Cancer Type - one code',
		{ cancerType: API_DISEASE_MOCKS['Main Type A'] },
		{
			cancerType: ['C1111'],
			location: 'search-location-all',
		},
	],
	[
		'Cancer Type - two code',
		{ cancerType: API_DISEASE_MOCKS['Main Type B'] },
		{
			cancerType: ['C1112', 'C1113'],
			location: 'search-location-all',
		},
	],
	// Subtypes
	[
		'Subtypes - one code',
		{ subtypes: [API_DISEASE_MOCKS['Subtype A']] },
		{
			subtypes: [['C2222']],
			location: 'search-location-all',
		},
	],
	[
		'Subtypes - two codes',
		{ subtypes: [API_DISEASE_MOCKS['Subtype B']] },
		{
			subtypes: [['C2223', 'C2224']],
			location: 'search-location-all',
		},
	],
	[
		'Subtypes - two items',
		{
			subtypes: [
				API_DISEASE_MOCKS['Subtype A'],
				API_DISEASE_MOCKS['Subtype B'],
			],
		},
		{
			subtypes: [['C2222'], ['C2223', 'C2224']],
			location: 'search-location-all',
		},
	],
	// Stages
	[
		'Stages - one code',
		{ stages: [API_DISEASE_MOCKS['Stage A']] },
		{
			stages: [['C3333']],
			location: 'search-location-all',
		},
	],
	[
		'Stages - two codes',
		{ stages: [API_DISEASE_MOCKS['Stage B']] },
		{
			stages: [['C3334', 'C3335']],
			location: 'search-location-all',
		},
	],
	[
		'Stages - two items',
		{ stages: [API_DISEASE_MOCKS['Stage A'], API_DISEASE_MOCKS['Stage B']] },
		{
			stages: [['C3333'], ['C3334', 'C3335']],
			location: 'search-location-all',
		},
	],
	// Findings
	[
		'Findings - one code',
		{ findings: [API_DISEASE_MOCKS['Finding A']] },
		{
			findings: [['C4444']],
			location: 'search-location-all',
		},
	],
	[
		'Findings - two codes',
		{ findings: [API_DISEASE_MOCKS['Finding B']] },
		{
			findings: [['C4445', 'C4446']],
			location: 'search-location-all',
		},
	],
	[
		'Findings - two items',
		{
			findings: [
				API_DISEASE_MOCKS['Finding A'],
				API_DISEASE_MOCKS['Finding B'],
			],
		},
		{
			findings: [['C4444'], ['C4445', 'C4446']],
			location: 'search-location-all',
		},
	],

	/***********************
	 * INTERVENTIONS
	 ***********************/
	[
		'Drugs - one code',
		{ drugs: [API_INTERVENTION_MOCKS['Drug A']] },
		{
			drugs: [['C5555']],
			location: 'search-location-all',
		},
	],
	[
		'Drugs - two codes',
		{ drugs: [API_INTERVENTION_MOCKS['Drug B']] },
		{
			drugs: [['C5556', 'C5557']],
			location: 'search-location-all',
		},
	],
	[
		'Drugs - two items',
		{
			drugs: [
				API_INTERVENTION_MOCKS['Drug A'],
				API_INTERVENTION_MOCKS['Drug B'],
			],
		},
		{
			drugs: [['C5555'], ['C5556', 'C5557']],
			location: 'search-location-all',
		},
	],
	// Other Interventions
	[
		'Other Interventions - one code',
		{ treatments: [API_INTERVENTION_MOCKS['Treatment A']] },
		{
			treatments: [['C6666']],
			location: 'search-location-all',
		},
	],
	[
		'Other Interventions - two codes',
		{ treatments: [API_INTERVENTION_MOCKS['Treatment B']] },
		{
			treatments: [['C6667', 'C6668']],
			location: 'search-location-all',
		},
	],
	[
		'Other Interventions - two items',
		{
			treatments: [
				API_INTERVENTION_MOCKS['Treatment A'],
				API_INTERVENTION_MOCKS['Treatment B'],
			],
		},
		{
			treatments: [['C6666'], ['C6667', 'C6668']],
			location: 'search-location-all',
		},
	],

	/***********************
	 * LOCATIONS
	 ***********************/
	[
		'VA Only',
		{ vaOnly: true },
		{
			vaOnly: true,
			location: 'search-location-all',
		},
	],

	// ZIP
	[
		'Zip - default radius',
		{
			zip: '20852',
			zipRadius: '100',
			location: 'search-location-zip',
		},
		{
			zip: '20852',
			zipRadius: '100',
			location: 'search-location-zip',
		},
	],
	[
		'Zip - radius',
		{
			zip: '20852',
			zipRadius: '500',
			location: 'search-location-zip',
		},
		{
			zip: '20852',
			zipRadius: '500',
			location: 'search-location-zip',
		},
	],

	// CSC
	[
		'CSC - Country Only',
		{
			country: 'United States',
			location: 'search-location-country',
		},
		{
			location: 'search-location-country',
			country: 'United States',
		},
	],
	[
		'CSC - Country, city',
		{
			country: 'United States',
			city: 'Baltimore',
			location: 'search-location-country',
		},
		{
			location: 'search-location-country',
			city: 'Baltimore',
			country: 'United States',
		},
	],
	[
		'CSC - Country, one state',
		{
			country: 'United States',
			states: [{ abbr: 'MD', name: 'Maryland' }],
			location: 'search-location-country',
		},
		{
			location: 'search-location-country',
			states: ['MD'],
			country: 'United States',
		},
	],
	[
		'CSC - Country, two state',
		{
			country: 'United States',
			states: [
				{ abbr: 'MD', name: 'Maryland' },
				{ abbr: 'VA', name: 'Virginia' },
			],
			location: 'search-location-country',
		},
		{
			location: 'search-location-country',
			states: ['MD', 'VA'],
			country: 'United States',
		},
	],

	// Hospital
	[
		'Hospital',
		{
			hospital: { term: 'Seattle Grace', termKey: 'Seattle Grace' },
			location: 'search-location-hospital',
		},
		{
			hospital: 'Seattle Grace',
			location: 'search-location-hospital',
		},
	],

	// At NIH
	[
		'At NIH',
		{
			location: 'search-location-nih',
		},
		{
			location: 'search-location-nih',
		},
	],

	/***********************
	 * OTHER
	 ***********************/
	[
		'Age',
		{ age: 35 },
		{
			age: 35,
			location: 'search-location-all',
		},
	],
	[
		'Keyword',
		{ keywordPhrases: 'Chicken' },
		{
			keywordPhrases: 'Chicken',
			location: 'search-location-all',
		},
	],
	[
		'Healthy Volunteers',
		{ healthyVolunteers: true },
		{
			healthyVolunteers: true,
			location: 'search-location-all',
		},
	],
	[
		'Trial ID',
		{ trialId: 'NCT123456789' },
		{
			trialId: 'NCT123456789',
			location: 'search-location-all',
		},
	],
	[
		'Trial Investigator',
		{ investigator: { term: 'Stacy Smith', termKey: 'Stacy Smith' } },
		{
			investigator: 'Stacy Smith',
			location: 'search-location-all',
		},
	],
	[
		'Lead Organization',
		{ leadOrg: { term: 'Mayo Clinic', termKey: 'Mayo Clinic' } },
		{
			leadOrg: 'Mayo Clinic',
			location: 'search-location-all',
		},
	],

	// Phase
	[
		'Phase - single',
		{
			trialPhases: getPhaseObject(['i']),
		},
		{
			trialPhases: ['i'],
			location: 'search-location-all',
		},
	],
	[
		'Phase - multi',
		{
			trialPhases: getPhaseObject(['i', 'ii']),
		},
		{
			trialPhases: ['i', 'ii'],
			location: 'search-location-all',
		},
	],

	// Trial Type
	[
		'Trial Types - single',
		{
			trialTypes: getTrialTypesObject(['supportive_care']),
		},
		{
			trialTypes: ['supportive_care'],
			location: 'search-location-all',
		},
	],
	[
		'Trial Types - multi',
		{
			trialTypes: getTrialTypesObject(['supportive_care', 'treatment']),
		},
		{
			trialTypes: ['treatment', 'supportive_care'],
			location: 'search-location-all',
		},
	],
];

describe('formToTrackingData', () => {
	it.each(testCases)(
		'%# - correctly maps %s',
		(testName, formStateChanges, expected) => {
			const testForm = {
				...defaultState,
				...formStateChanges,
			};

			const actual = formToTrackingData(testForm);
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
 * Helper function to set enabled trial types.
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
