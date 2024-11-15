import { resolveConcepts } from '../resolveConcepts';
import {
	getDiseaseFetcher,
	TYPE_EXPECTATION,
} from './queryStringToSearchCriteria.common';

describe('resolveConcepts maps query to form', () => {
	const resolveTestCases = [
		['Nothing to map', {}, getDiseaseFetcher([], []), {}],
		[
			'Cancer Type - Single id',
			{
				cancerType: {
					name: 'UNKNOWN',
					codes: TYPE_EXPECTATION['Main Type A'].codes,
				},
			},
			getDiseaseFetcher(['C1111'], ['Main Type A']),
			{
				cancerType: TYPE_EXPECTATION['Main Type A'],
			},
		],
		[
			'Cancer Type - Multi id',
			{
				cancerType: {
					name: 'UNKNOWN',
					codes: TYPE_EXPECTATION['Main Type B'].codes,
				},
			},
			getDiseaseFetcher(['C1112', 'C1113'], ['Main Type B']),
			{
				cancerType: TYPE_EXPECTATION['Main Type B'],
			},
		],
		[
			'Cancer Type - API has extra ids',
			{
				cancerType: { name: 'UNKNOWN', codes: ['C1112'] },
			},
			getDiseaseFetcher(['C1112'], ['Main Type B']),
			{
				cancerType: TYPE_EXPECTATION['Main Type B'],
			},
		],
		[
			'subtype - Single id',
			{
				subtypes: [
					{ name: 'UNKNOWN', codes: TYPE_EXPECTATION['Subtype A'].codes },
				],
			},
			getDiseaseFetcher(['C2222'], ['Subtype A']),
			{
				subtypes: [TYPE_EXPECTATION['Subtype A']],
			},
		],
		[
			'subtype - Multiple id, using 1 id',
			{
				subtypes: [
					{ name: 'UNKNOWN', codes: TYPE_EXPECTATION['Subtype A'].codes },
					{ name: 'UNKNOWN', codes: ['C2223'] },
				],
			},
			getDiseaseFetcher(['C2222', 'C2223'], ['Subtype A', 'Subtype B']),
			{
				subtypes: [
					TYPE_EXPECTATION['Subtype A'],
					TYPE_EXPECTATION['Subtype B'],
				],
			},
		],
		[
			'subtype - Multiple id, using 1 id, one missing',
			{
				subtypes: [
					{ name: 'UNKNOWN', codes: TYPE_EXPECTATION['Subtype A'].codes },
					{ name: 'UNKNOWN', codes: ['C2223'] },
					{ name: 'UNKNOWN', codes: ['C9999'] },
				],
			},
			getDiseaseFetcher(
				['C2222', 'C2223', 'C9999'],
				['Subtype A', 'Subtype B']
			),
			{
				subtypes: [
					TYPE_EXPECTATION['Subtype A'],
					TYPE_EXPECTATION['Subtype B'],
					{ name: 'UNKNOWN', codes: ['C9999'] },
				],
			},
		],
		[
			'kit and kaboddle',
			{
				cancerType: {
					name: 'UNKNOWN',
					codes: TYPE_EXPECTATION['Main Type A'].codes,
				},
				subtypes: [
					{ name: 'UNKNOWN', codes: TYPE_EXPECTATION['Subtype A'].codes },
					{ name: 'UNKNOWN', codes: ['C2223'] },
					{ name: 'UNKNOWN', codes: ['C9999'] },
				],
				stages: [{ name: 'UNKNOWN', codes: TYPE_EXPECTATION['Stage A'].codes }],
				findings: [
					{ name: 'UNKNOWN', codes: TYPE_EXPECTATION['Finding A'].codes },
				],
			},
			getDiseaseFetcher(
				['C1111', 'C2222', 'C2223', 'C9999', 'C3333', 'C4444'],
				['Main Type A', 'Subtype A', 'Subtype B', 'Stage A', 'Finding A']
			),
			{
				cancerType: TYPE_EXPECTATION['Main Type A'],
				subtypes: [
					TYPE_EXPECTATION['Subtype A'],
					TYPE_EXPECTATION['Subtype B'],
					{ name: 'UNKNOWN', codes: ['C9999'] },
				],
				stages: [TYPE_EXPECTATION['Stage A']],
				findings: [TYPE_EXPECTATION['Finding A']],
			},
		],
	];

	// Test iterates over multiple cases defined by mappingTestCases
	it.each(resolveTestCases)(
		'%# - correctly resolves %s',
		async (testName, queryDiseases, diseaseFetcher, expected) => {
			const actual = await resolveConcepts(queryDiseases, diseaseFetcher);
			expect(actual).toEqual(expected);
		}
	);
});
