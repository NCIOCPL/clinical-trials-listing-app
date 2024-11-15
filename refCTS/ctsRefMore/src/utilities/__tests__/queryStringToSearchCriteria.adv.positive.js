import { queryStringToSearchCriteria } from '../queryStringToSearchCriteria';
import { defaultState } from './defaultStateCopy';

// We want to test mapping the trial types, so we should not
// really use the default state.
const TRIAL_TYPES = [
	{ label: 'Treatment', value: 'treatment', checked: false },
	{ label: 'Prevention', value: 'prevention', checked: false },
	{ label: 'Supportive Care', value: 'supportive_care', checked: false },
	{
		label: 'Health Services Research',
		value: 'health_services_research',
		checked: false,
	},
	{ label: 'Diagnostic', value: 'diagnostic', checked: false },
	{ label: 'Screening', value: 'screening', checked: false },
	{ label: 'Basic Science', value: 'basic_science', checked: false },
	{ label: 'Other', value: 'other', checked: false },
];

/**
 * Helper function to set enabled trial types.
 *
 * @param array type
 *   List of trial types to enable
 */
const getExpectedTrialTypes = (types) => {
	return TRIAL_TYPES.map((type) => {
		if (types.includes(type.value)) {
			return {
				...type,
				checked: true,
			};
		} else {
			return type;
		}
	});
};

const TRIAL_PHASES = [
	{ label: 'Phase I', value: 'i', checked: false },
	{ label: 'Phase II', value: 'ii', checked: false },
	{ label: 'Phase III', value: 'iii', checked: false },
	{ label: 'Phase IV', value: 'iv', checked: false },
];

/**
 * Helper function to set enabled phases.
 *
 * @param array phases
 *   List of phases to enable
 */
function getExpectedPhases(phases) {
	return TRIAL_PHASES.map((phase) => {
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

describe('Adv - queryStringToSearchCriteria maps query to form', () => {
	const goodMappingTestCases = [
		[
			'no params',
			'rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				formType: 'advanced',
			},
		],
		// Other Fields
		[
			'age',
			'rl=2&a=35',
			async () => [],
			async () => [],
			async () => null,
			{
				age: 35,
				formType: 'advanced',
			},
		],
		[
			'phrase',
			'rl=2&q=chicken',
			async () => [],
			async () => [],
			async () => null,
			{
				keywordPhrases: 'chicken',
				formType: 'advanced',
			},
		],
		[
			'lead organization',
			'rl=2&lo=Mayo+Clinic',
			async () => [],
			async () => [],
			async () => null,
			{
				leadOrg: { term: 'Mayo Clinic', termKey: 'Mayo Clinic' },
				formType: 'advanced',
			},
		],
		[
			'lead organization - with comma',
			'rl=2&lo=Mayo+Clinic,+Mayo+Clinic',
			async () => [],
			async () => [],
			async () => null,
			{
				leadOrg: {
					term: 'Mayo Clinic, Mayo Clinic',
					termKey: 'Mayo Clinic, Mayo Clinic',
				},
				formType: 'advanced',
			},
		],
		[
			'Principal Investigator',
			'rl=2&in=Sophia+Smith',
			async () => [],
			async () => [],
			async () => null,
			{
				investigator: { term: 'Sophia Smith', termKey: 'Sophia Smith' },
				formType: 'advanced',
			},
		],
		[
			'Principal Investigator - with comma',
			'rl=2&in=Sophia+Smith,M.D.',
			async () => [],
			async () => [],
			async () => null,
			{
				investigator: {
					term: 'Sophia Smith,M.D.',
					termKey: 'Sophia Smith,M.D.',
				},
				formType: 'advanced',
			},
		],
		[
			'Trial ID',
			'rl=2&tid=NCI-2014-01509',
			async () => [],
			async () => [],
			async () => null,
			{
				trialId: 'NCI-2014-01509',
				formType: 'advanced',
			},
		],
		// There was a test for TID with semi-colons. Not going to handle that.
		[
			'Trial ID - with comma',
			'rl=2&tid=NCI-2014-01509,NCI-2014-01507',
			async () => [],
			async () => [],
			async () => null,
			{
				trialId: 'NCI-2014-01509,NCI-2014-01507',
				formType: 'advanced',
			},
		],
		[
			'Healthy Volunteers',
			'rl=2&hv=1',
			async () => [],
			async () => [],
			async () => null,
			{
				healthyVolunteers: true,
				formType: 'advanced',
			},
		],
		// Trial type and Phases... ugg
		[
			'Trial Type - single ',
			'rl=2&tt=basic_science',
			async () => [],
			async () => [],
			async () => null,
			{
				trialTypes: getExpectedTrialTypes(['basic_science']),
				formType: 'advanced',
			},
		],
		[
			'Trial Type - multi',
			'rl=2&tt=basic_science&tt=Treatment&tt=supportive_care',
			async () => [],
			async () => [],
			async () => null,
			{
				trialTypes: getExpectedTrialTypes([
					'basic_science',
					'treatment',
					'supportive_care',
				]),
				formType: 'advanced',
			},
		],
		[
			'Trial Phase - single ',
			'rl=2&tp=iii',
			async () => [],
			async () => [],
			async () => null,
			{
				trialPhases: getExpectedPhases(['iii']),
				formType: 'advanced',
			},
		],
		[
			'Trial Type - multi',
			'rl=2&tp=II&tp=III',
			async () => [],
			async () => [],
			async () => null,
			{
				trialPhases: getExpectedPhases(['ii', 'iii']),
				formType: 'advanced',
			},
		],
		[
			'VA Only',
			'rl=2&va=1',
			async () => [],
			async () => [],
			async () => null,
			{
				vaOnly: true,
				formType: 'advanced',
			},
		],
		[
			'Pager test',
			'rl=2&pn=200',
			async () => [],
			async () => [],
			async () => null,
			{
				resultsPage: 200,
				formType: 'advanced',
			},
		],
	];

	// Test iterates over multiple cases defined by mappingTestCases
	it.each(goodMappingTestCases)(
		'%# - correctly maps %s',
		async (
			testName,
			urlQuery,
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher,
			additionalExpectedQuery
		) => {
			const expected = {
				searchCriteria: {
					...defaultState,
					...additionalExpectedQuery,
					qs: urlQuery,
				},
				errors: [],
			};

			const actual = await queryStringToSearchCriteria(
				urlQuery,
				diseaseFetcher,
				interventionsFetcher,
				zipcodeFetcher
			);
			expect(actual).toEqual(expected);
		}
	);
});
