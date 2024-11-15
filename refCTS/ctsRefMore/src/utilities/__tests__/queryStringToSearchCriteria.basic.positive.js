import { queryStringToSearchCriteria } from '../queryStringToSearchCriteria';
import {
	getDiseaseFetcher,
	TYPE_EXPECTATION,
} from './queryStringToSearchCriteria.common';
import { defaultState } from './defaultStateCopy';

describe('Basic - queryStringToSearchCriteria maps query to form', () => {
	const goodMappingTestCases = [
		[
			'basic - no params',
			'rl=1',
			async () => [],
			async () => [],
			async () => null,
			{
				formType: 'basic',
			},
		],
		[
			'basic - single id cancer type',
			'?t=C1111&rl=1',
			getDiseaseFetcher(['C1111'], ['Main Type A']),
			async () => [],
			async () => null,
			{
				cancerType: TYPE_EXPECTATION['Main Type A'],
				formType: 'basic',
			},
		],
		[
			'basic - multi id cancer type',
			'?t=C1112|C1113&rl=1',
			getDiseaseFetcher(['C1112', 'C1113'], ['Main Type B']),
			async () => [],
			async () => null,
			{
				cancerType: TYPE_EXPECTATION['Main Type B'],
				formType: 'basic',
			},
		],
		[
			'basic - cancer type - subtype',
			'?t=C2222&rl=1',
			getDiseaseFetcher(['C2222'], ['Subtype A']),
			async () => [],
			async () => null,
			{
				cancerType: TYPE_EXPECTATION['Subtype A'],
				formType: 'basic',
			},
		],
		[
			'basic - cancer type - stage',
			'?t=C3333&rl=1',
			getDiseaseFetcher(['C3333'], ['Stage A']),
			async () => [],
			async () => null,
			{
				cancerType: TYPE_EXPECTATION['Stage A'],
				formType: 'basic',
			},
		],
		[
			'basic - age',
			'a=35&rl=1',
			async () => [],
			async () => [],
			async () => null,
			{
				age: 35,
				formType: 'basic',
			},
		],
		[
			'basic - phrase',
			'q=chicken&rl=1',
			async () => [],
			async () => [],
			async () => null,
			{
				keywordPhrases: 'chicken',
				formType: 'basic',
			},
		],
		[
			'basic - phrase with commas',
			'q=chicken,+fish,+and+beans&rl=1',
			async () => [],
			async () => [],
			async () => null,
			{
				keywordPhrases: 'chicken, fish, and beans',
				formType: 'basic',
			},
		],
		[
			'basic - zip code',
			'?loc=1&z=20850&rl=1',
			async () => [],
			async () => [],
			async () => ({ lat: 39.0897, long: -77.1798 }),
			{
				location: 'search-location-zip',
				zip: '20850',
				zipCoords: { lat: 39.0897, long: -77.1798 },
				formType: 'basic',
			},
		],
		[
			'Pager test',
			'rl=1&pn=200',
			async () => [],
			async () => [],
			async () => null,
			{
				resultsPage: 200,
				formType: 'basic',
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
