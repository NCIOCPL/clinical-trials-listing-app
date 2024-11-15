import { queryStringToSearchCriteria } from '../queryStringToSearchCriteria';
import { defaultState } from './defaultStateCopy';
import {
	getInterventionFetcher,
	INTERVENTION_EXPECTATION,
} from './queryStringToSearchCriteria.common';

describe('Adv - Interventions - queryStringToSearchCriteria maps query to form', () => {
	const goodMappingTestCases = [
		// Drugs
		[
			'single id drug',
			'?d=C5555&rl=2',
			async () => [],
			getInterventionFetcher(['C5555'], ['Drug A']),
			async () => null,
			{
				drugs: [INTERVENTION_EXPECTATION['Drug A']],
				formType: 'advanced',
			},
		],
		[
			'drug - extra id',
			'?d=C5555|C9999&rl=2',
			async () => [],
			getInterventionFetcher(['C5555', 'C9999'], ['Drug A']),
			async () => null,
			{
				drugs: [INTERVENTION_EXPECTATION['Drug A']],
				formType: 'advanced',
			},
		],
		[
			'drug - api extra ID',
			'?d=C5557&rl=2',
			async () => [],
			getInterventionFetcher(['C5557'], ['Drug B']),
			async () => null,
			{
				drugs: [INTERVENTION_EXPECTATION['Drug B']],
				formType: 'advanced',
			},
		],
		[
			'multi id drug',
			'?d=C5556|C5557&rl=2',
			async () => [],
			getInterventionFetcher(['C5556', 'C5557'], ['Drug B']),
			async () => null,
			{
				drugs: [INTERVENTION_EXPECTATION['Drug B']],
				formType: 'advanced',
			},
		],
		[
			'drug - agent category',
			'?d=C5558&rl=2',
			async () => [],
			getInterventionFetcher(['C5558'], ['Drug Category A']),
			async () => null,
			{
				drugs: [INTERVENTION_EXPECTATION['Drug Category A']],
				formType: 'advanced',
			},
		],
		[
			'multiple drugs',
			'?d=C5555&d=C5556|C5557&rl=2',
			async () => [],
			getInterventionFetcher(['C5555', 'C5556', 'C5557'], ['Drug A', 'Drug B']),
			async () => null,
			{
				drugs: [
					INTERVENTION_EXPECTATION['Drug A'],
					INTERVENTION_EXPECTATION['Drug B'],
				],
				formType: 'advanced',
			},
		],
		// Other Treatments
		[
			'single id other treatment',
			'?i=C6666&rl=2',
			async () => [],
			getInterventionFetcher(['C6666'], ['Treatment A']),
			async () => null,
			{
				treatments: [INTERVENTION_EXPECTATION['Treatment A']],
				formType: 'advanced',
			},
		],
		[
			'treatment - extra id',
			'?i=C6666|C9999&rl=2',
			async () => [],
			getInterventionFetcher(['C6666', 'C9999'], ['Treatment A']),
			async () => null,
			{
				treatments: [INTERVENTION_EXPECTATION['Treatment A']],
				formType: 'advanced',
			},
		],
		[
			'treatment - api extra ID',
			'?i=C6667&rl=2',
			async () => [],
			getInterventionFetcher(['C6667'], ['Treatment B']),
			async () => null,
			{
				treatments: [INTERVENTION_EXPECTATION['Treatment B']],
				formType: 'advanced',
			},
		],
		[
			'multi id treatments',
			'?i=C6667|C6668&rl=2',
			async () => [],
			getInterventionFetcher(['C6667', 'C6668'], ['Treatment B']),
			async () => null,
			{
				treatments: [INTERVENTION_EXPECTATION['Treatment B']],
				formType: 'advanced',
			},
		],
		[
			'multiple drugs',
			'?i=C6666&i=C6667|C6668&rl=2',
			async () => [],
			getInterventionFetcher(
				['C6666', 'C6667', 'C6668'],
				['Treatment A', 'Treatment B']
			),
			async () => null,
			{
				treatments: [
					INTERVENTION_EXPECTATION['Treatment A'],
					INTERVENTION_EXPECTATION['Treatment B'],
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
