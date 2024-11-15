import { queryStringToSearchCriteria } from '../queryStringToSearchCriteria';
import {
	getDiseaseFetcher,
	TYPE_EXPECTATION,
} from './queryStringToSearchCriteria.common';
import { defaultState } from './defaultStateCopy';

describe('Advanced - Disease - queryStringToSearchCriteria maps query to form', () => {
	const goodMappingTestCases = [
		[
			'adv - single id cancer type',
			'?t=C1111&rl=2',
			getDiseaseFetcher(['C1111'], ['Main Type A']),
			async () => [],
			async () => null,
			{
				cancerType: TYPE_EXPECTATION['Main Type A'],
				formType: 'advanced',
			},
		],
		[
			'adv - main type - main type / subtype',
			'?t=C1114&rl=2',
			getDiseaseFetcher(['C1114'], ['Main Type C']),
			async () => [],
			async () => null,
			{
				cancerType: TYPE_EXPECTATION['Main Type C'],
				formType: 'advanced',
			},
		],
		// Subtypes
		[
			'adv - single id subtype',
			'?st=C2222&rl=2',
			getDiseaseFetcher(['C2222'], ['Subtype A']),
			async () => [],
			async () => null,
			{
				subtypes: [TYPE_EXPECTATION['Subtype A']],
				formType: 'advanced',
			},
		],
		[
			'adv - subtype - main type / subtype',
			'?st=C1114&rl=2',
			getDiseaseFetcher(['C1114'], ['Main Type C']),
			async () => [],
			async () => null,
			{
				subtypes: [TYPE_EXPECTATION['Main Type C']],
				formType: 'advanced',
			},
		],
		[
			'adv - subtype - subtype / stage',
			'?st=C3336|C3337|C3338&rl=2',
			getDiseaseFetcher(['C3336', 'C3337', 'C3338'], ['Stage C']),
			async () => [],
			async () => null,
			{
				subtypes: [TYPE_EXPECTATION['Stage C']],
				formType: 'advanced',
			},
		],
		[
			'adv - multi id subtype',
			'?st=C2223|C2224&rl=2',
			getDiseaseFetcher(['C2223', 'C2224'], ['Subtype B']),
			async () => [],
			async () => null,
			{
				subtypes: [TYPE_EXPECTATION['Subtype B']],
				formType: 'advanced',
			},
		],
		[
			'adv - multi id subtype, API missing one part',
			'?st=C2222|C9999&rl=2',
			getDiseaseFetcher(['C2222', 'C9999'], ['Subtype A']),
			async () => [],
			async () => null,
			{
				subtypes: [TYPE_EXPECTATION['Subtype A']],
				formType: 'advanced',
			},
		],
		[
			'adv - multi id subtype, API extra part',
			'?st=C2224&rl=2',
			getDiseaseFetcher(['C2224'], ['Subtype B']),
			async () => [],
			async () => null,
			{
				subtypes: [TYPE_EXPECTATION['Subtype B']],
				formType: 'advanced',
			},
		],
		[
			'adv - multiple subtypes',
			'?st=C2222&st=C2223|C2224&rl=2',
			getDiseaseFetcher(
				['C2222', 'C2223', 'C2224'],
				['Subtype A', 'Subtype B']
			),
			async () => [],
			async () => null,
			{
				subtypes: [
					TYPE_EXPECTATION['Subtype A'],
					TYPE_EXPECTATION['Subtype B'],
				],
				formType: 'advanced',
			},
		],
		// Stages
		[
			'adv - single id stage',
			'?stg=C3333&rl=2',
			getDiseaseFetcher(['C3333'], ['Stage A']),
			async () => [],
			async () => null,
			{
				stages: [TYPE_EXPECTATION['Stage A']],
				formType: 'advanced',
			},
		],
		[
			'adv - stage - subtype / stage',
			'?stg=C3336|C3337|C3338&rl=2',
			getDiseaseFetcher(['C3336', 'C3337', 'C3338'], ['Stage C']),
			async () => [],
			async () => null,
			{
				stages: [TYPE_EXPECTATION['Stage C']],
				formType: 'advanced',
			},
		],
		[
			'adv - multi id stage',
			'?stg=C3334|C3335&rl=2',
			getDiseaseFetcher(['C3334', 'C3335'], ['Stage B']),
			async () => [],
			async () => null,
			{
				stages: [TYPE_EXPECTATION['Stage B']],
				formType: 'advanced',
			},
		],
		[
			'adv - multi id stage, API missing one part',
			'?stg=C3333|C9999&rl=2',
			getDiseaseFetcher(['C3333', 'C9999'], ['Stage A']),
			async () => [],
			async () => null,
			{
				stages: [TYPE_EXPECTATION['Stage A']],
				formType: 'advanced',
			},
		],
		[
			'adv - multi id stage, API extra part',
			'?stg=C3334&rl=2',
			getDiseaseFetcher(['C3334'], ['Stage B']),
			async () => [],
			async () => null,
			{
				stages: [TYPE_EXPECTATION['Stage B']],
				formType: 'advanced',
			},
		],
		[
			'adv - multiple stages',
			'?stg=C3333&stg=C3334|C3335&rl=2',
			getDiseaseFetcher(['C3333', 'C3334', 'C3335'], ['Stage A', 'Stage B']),
			async () => [],
			async () => null,
			{
				stages: [TYPE_EXPECTATION['Stage A'], TYPE_EXPECTATION['Stage B']],
				formType: 'advanced',
			},
		],
		// Findings
		[
			'adv - single id finding',
			'?fin=C4444&rl=2',
			getDiseaseFetcher(['C4444'], ['Finding A']),
			async () => [],
			async () => null,
			{
				findings: [TYPE_EXPECTATION['Finding A']],
				formType: 'advanced',
			},
		],
		[
			'adv - multi id finding',
			'?fin=C4445|C4446&rl=2',
			getDiseaseFetcher(['C4445,C4446'], ['Finding B']),
			async () => [],
			async () => null,
			{
				findings: [TYPE_EXPECTATION['Finding B']],
				formType: 'advanced',
			},
		],
		[
			'adv - multi id finding, API missing one part',
			'?fin=C4444|C9999&rl=2',
			getDiseaseFetcher(['C4444', 'C9999'], ['Finding A']),
			async () => [],
			async () => null,
			{
				findings: [TYPE_EXPECTATION['Finding A']],
				formType: 'advanced',
			},
		],
		[
			'adv - multi id finding, API extra part',
			'?fin=C4445&rl=2',
			getDiseaseFetcher(['C4445'], ['Finding B']),
			async () => [],
			async () => null,
			{
				findings: [TYPE_EXPECTATION['Finding B']],
				formType: 'advanced',
			},
		],
		[
			'adv - multiple findings',
			'?fin=C4444&fin=C4445|C4446&rl=2',
			getDiseaseFetcher(
				['C4444', 'C4445', 'C4446'],
				['Finding A', 'Finding B']
			),
			async () => [],
			async () => null,
			{
				findings: [
					TYPE_EXPECTATION['Finding A'],
					TYPE_EXPECTATION['Finding B'],
				],
				formType: 'advanced',
			},
		],
		// Multi Diseases
		// There is only 1 test because the assumption that all the
		// combos for each param were tested above - this just
		// makes sure that we are fetching a bunch of things and
		// picking out the correct concepts.
		[
			'adv - multiple diseases',
			'?t=C1111&st=C2222&stg=C3336|C3337&fin=C4444&fin=C4445|C4446&rl=2',
			getDiseaseFetcher(
				['C1111', 'C2222', 'C3336', 'C3337', 'C4444', 'C4445', 'C4446'],
				['Main Type A', 'Subtype A', 'Stage C', 'Finding A', 'Finding B']
			),
			async () => [],
			async () => null,
			{
				cancerType: TYPE_EXPECTATION['Main Type A'],
				subtypes: [TYPE_EXPECTATION['Subtype A']],
				stages: [TYPE_EXPECTATION['Stage C']],
				findings: [
					TYPE_EXPECTATION['Finding A'],
					TYPE_EXPECTATION['Finding B'],
				],
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
