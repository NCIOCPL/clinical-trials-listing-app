import { defaultState } from './defaultStateCopy';
import { buildQueryString } from '../buildQueryString';

/****************
 * The underlying code takes expects buildQueryString to return a
 * dictionary that will be used by query-string module's stringify
 * function. So comma separated params should be an array of
 * strings.
 ****************/

const NO_LOC_BASIC = {
	rl: 1,
	loc: 0,
};

const NO_LOC_ADVANCED = {
	rl: 2,
	loc: 0,
};

const mappingTestCases = [
	// Basic searches.
	['basic - empty search', {}, {}],
	[
		'basic - main type - simple',
		{
			cancerType: { name: 'Breast Cancer', codes: ['C4872'] },
			formType: 'basic',
		},
		{
			...NO_LOC_BASIC,
			t: 'C4872',
		},
	],
	[
		'basic - main type - complex',
		{
			cancerType: { name: 'Stage IV Breast Cancer', codes: ['C3995', 'C4872'] },
			formType: 'basic',
		},
		{
			...NO_LOC_BASIC,
			t: 'C3995|C4872',
		},
	],
	[
		'basic - age',
		{
			age: 35,
			formType: 'basic',
		},
		{
			...NO_LOC_BASIC,
			a: 35,
		},
	],
	[
		'basic - phrase',
		{
			keywordPhrases: 'chicken',
			formType: 'basic',
		},
		{
			...NO_LOC_BASIC,
			q: 'chicken',
		},
	],
	// NO GENDERTESTS FOR NOW
	[
		'basic - location',
		{
			zip: '20850',
			zipCoords: { lat: 39.0897, long: -77.1798 },
			formType: 'basic',
		},
		{
			...NO_LOC_BASIC,
			z: '20850',
			loc: 1,
		},
	],
	[
		'basic - pager',
		{
			resultsPage: 3,
			formType: 'basic',
		},
		{
			...NO_LOC_BASIC,
			pn: 3,
		},
	],
	/************************
	 *********
	 ** Advanced Searches
	 *********
	 ************************/
	[
		'adv - empty search',
		{
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
		},
	],
	/***********
	 * Diseases
	 ***********/
	[
		'adv - main type - simple',
		{
			cancerType: { name: 'Simple Main Type', codes: ['C1111'] },
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			t: 'C1111',
		},
	],
	[
		'adv - main type - complex',
		{
			cancerType: { name: 'Complex Main Type', codes: ['C1112', 'C1113'] },
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			t: 'C1112|C1113',
		},
	],
	[
		'adv - subtype - simple',
		{
			subtypes: [{ name: 'Simple Subtype', codes: ['C2222'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			st: ['C2222'],
		},
	],
	[
		'adv - subtype - complex',
		{
			subtypes: [{ name: 'Test Subtype Cancer', codes: ['C2223', 'C2224'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			st: ['C2223|C2224'],
		},
	],
	[
		'adv - subtype - multiple',
		{
			subtypes: [
				{ name: 'Simple Subtype', codes: ['C2222'] },
				{ name: 'Test Subtype Cancer', codes: ['C2223', 'C2224'] },
			],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			st: ['C2222', 'C2223|C2224'],
		},
	],
	[
		'adv - stage - simple',
		{
			stages: [{ name: 'Simple Stage Test', codes: ['C3333'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			stg: ['C3333'],
		},
	],
	[
		'adv - stage - complex',
		{
			stages: [{ name: 'Complex Stage Test', codes: ['C3334', 'C3335'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			stg: ['C3334|C3335'],
		},
	],
	[
		'adv - stage - multiple',
		{
			stages: [
				{ name: 'Simple Stage Test', codes: ['C3333'] },
				{ name: 'Complex Stage Test', codes: ['C3334', 'C3335'] },
			],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			stg: ['C3333', 'C3334|C3335'],
		},
	],
	[
		'adv - findings - simple',
		{
			findings: [{ name: 'Simple findings Test', codes: ['C4444'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			fin: ['C4444'],
		},
	],
	[
		'adv - findings - complex',
		{
			findings: [{ name: 'Complex Findings Test', codes: ['C4445', 'C4446'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			fin: ['C4445|C4446'],
		},
	],
	[
		'adv - findings - multiple',
		{
			findings: [
				{ name: 'Simple Findings Test', codes: ['C4444'] },
				{ name: 'Complex Findings Test', codes: ['C4445', 'C4446'] },
			],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			fin: ['C4444', 'C4445|C4446'],
		},
	],
	[
		'adv - kitchen sink diseases',
		{
			cancerType: { name: 'Simple Main Type', codes: ['C1111'] },
			stages: [
				{ name: 'Simple Stage Test', codes: ['C3333'] },
				{ name: 'Complex Stage Test', codes: ['C3334', 'C3335'] },
			],
			subtypes: [
				{ name: 'Simple Subtype', codes: ['C2222'] },
				{ name: 'Test Subtype Cancer', codes: ['C2223', 'C2224'] },
			],
			findings: [
				{ name: 'Simple Findings Test', codes: ['C4444'] },
				{ name: 'Complex Findings Test', codes: ['C4445', 'C4446'] },
			],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			t: 'C1111',
			st: ['C2222', 'C2223|C2224'],
			stg: ['C3333', 'C3334|C3335'],
			fin: ['C4444', 'C4445|C4446'],
		},
	],
	/***************
	 * Location tests
	 ***************/
	[
		'adv - zip code - default proximity',
		{
			zip: '20850',
			zipCoords: { lat: 39.0897, long: -77.1798 },
			location: 'search-location-zip',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			z: '20850',
			zp: '100',
			loc: 1,
		},
	],
	[
		'adv - zip code - custom proximity',
		{
			zip: '20850',
			zipCoords: { lat: 39.0897, long: -77.1798 },
			zipRadius: '250',
			location: 'search-location-zip',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			z: '20850',
			zp: '250',
			loc: 1,
		},
	],
	[
		'adv - country',
		{
			country: 'United States',
			location: 'search-location-country',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			lcnty: 'United States',
			loc: 2,
		},
	],
	[
		'adv - state - single',
		{
			country: 'United States',
			states: [{ abbr: 'MD', name: 'Maryland' }],
			location: 'search-location-country',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			lcnty: 'United States',
			lst: ['MD'],
			loc: 2,
		},
	],
	[
		'adv - state - multiple',
		{
			country: 'United States',
			states: [
				{ abbr: 'MD', name: 'Maryland' },
				{ abbr: 'VA', name: 'Virginia' },
			],
			location: 'search-location-country',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			lcnty: 'United States',
			lst: ['MD', 'VA'],
			loc: 2,
		},
	],
	[
		'adv - state - bad state',
		{
			country: 'Canada',
			states: [{ abbr: 'MD', name: 'Maryland' }],
			location: 'search-location-country',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			lcnty: 'Canada',
			loc: 2,
		},
	],
	[
		'adv - city',
		{
			country: 'United States',
			city: 'Baltimore',
			location: 'search-location-country',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			lcnty: 'United States',
			lcty: 'Baltimore',
			loc: 2,
		},
	],
	[
		'adv - country, state & city',
		{
			country: 'United States',
			states: [{ abbr: 'MD', name: 'Maryland' }],
			city: 'Baltimore',
			location: 'search-location-country',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			lcnty: 'United States',
			lst: ['MD'],
			lcty: 'Baltimore',
			loc: 2,
		},
	],
	[
		'adv - hospital',
		{
			hospital: {
				term: 'M D Anderson Cancer Center',
				termKey: 'M D Anderson Cancer Center',
			},
			location: 'search-location-hospital',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			hos: 'M D Anderson Cancer Center',
			loc: 3,
		},
	],
	[
		'adv - NIH Only',
		{
			location: 'search-location-nih',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			loc: 4,
		},
	],
	[
		'adv - Is VA Only',
		{
			vaOnly: true,
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			va: 1,
		},
	],
	/***************
	 * Drugs and Other Treatments
	 ***************/
	[
		'drug / one id',
		{
			drugs: [{ name: 'Trastuzumab', codes: ['C1674'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			d: ['C1674'],
		},
	],
	[
		'drug / two ids',
		{
			drugs: [{ name: 'Immunotherapy', codes: ['C308', 'C15262'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			d: ['C308|C15262'],
		},
	],
	[
		'two drugs mixed',
		{
			drugs: [
				{ name: 'Trastuzumab', codes: ['C1674'] },
				{ name: 'Immunotherapy', codes: ['C308', 'C15262'] },
			],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			d: ['C1674', 'C308|C15262'],
		},
	],
	[
		'other intervention / one id',
		{
			treatments: [{ name: 'Surgery', codes: ['C17173'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			i: ['C17173'],
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
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			i: ['C308|C15262'],
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
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			i: ['C17173', 'C308|C15262'],
		},
	],
	[
		'one drug / one other',
		{
			drugs: [{ name: 'Immunotherapy', codes: ['C308', 'C15262'] }],
			treatments: [{ name: 'Surgery', codes: ['C17173'] }],
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			d: ['C308|C15262'],
			i: ['C17173'],
		},
	],
	/***************
	 * Other
	 ***************/
	[
		'adv - age',
		{
			age: 35,
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			a: 35,
		},
	],
	[
		'adv - phrase',
		{
			keywordPhrases: 'chicken',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			q: 'chicken',
		},
	],
	// NO GENDER TEST
	[
		'adv - trial type - single',
		{
			trialTypes: getTrialTypesObject(['treatment']),
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			tt: ['treatment'],
		},
	],
	[
		'adv - trial type - multiple',
		{
			trialTypes: getTrialTypesObject(['treatment', 'supportive_care']),
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			tt: ['treatment', 'supportive_care'],
		},
	],
	[
		'adv - phase - single',
		{
			trialPhases: getPhaseObject(['ii']),
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			tp: ['ii'],
		},
	],
	[
		'adv - phase - multiple',
		{
			trialPhases: getPhaseObject(['ii', 'iii']),
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			tp: ['ii', 'iii'],
		},
	],
	// Not testing multiple here because it does not matter
	// internally to the app - it only matters for API
	// query building.
	[
		'adv - trial id',
		{
			trialId: 'foo, bar',
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			tid: 'foo, bar',
		},
	],
	[
		'adv - principal investigator',
		{
			investigator: { term: 'Sophia Smith', termKey: 'Sophia Smith' },
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			in: 'Sophia Smith',
		},
	],
	[
		'adv - lead organization',
		{
			leadOrg: { term: 'Mayo Clinic', termKey: 'Mayo Clinic' },
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			lo: 'Mayo Clinic',
		},
	],
	[
		'adv - healthy volunteers',
		{
			healthyVolunteers: true,
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			hv: 1,
		},
		// NOTE: New code does not support a way to indicate
		// accepts_healthy_volunteers_indicator: "NO"
	],
	[
		'adv - pager',
		{
			resultsPage: 3,
			formType: 'advanced',
		},
		{
			...NO_LOC_ADVANCED,
			pn: 3,
		},
	],
];

describe('buildQueryString maps form state to url query', () => {
	// Test iterates over multiple cases defined by mappingTestCases
	it.each(mappingTestCases)(
		'%# - correctly maps %s',
		(testName, formStateChanges, expected) => {
			const testForm = {
				...defaultState,
				...formStateChanges,
			};

			const actual = buildQueryString(testForm);
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
