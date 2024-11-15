import { queryStringToSearchCriteria } from '../queryStringToSearchCriteria';

describe('Adv - Negative - queryStringToSearchCriteria maps query to form', () => {
	const errorMappingTestCases = [
		// Other fields
		[
			'adv - bad age nan',
			'a=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'age',
					message: 'Please enter a valid age parameter.',
				},
			],
		],
		[
			'adv - bad age <0',
			'a=-1&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'age',
					message: 'Please enter a valid age parameter.',
				},
			],
		],
		[
			'adv - bad age >120',
			'a=122&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'age',
					message: 'Please enter a valid age parameter.',
				},
			],
		],
		[
			'Healthy Volunteers - bad number',
			'rl=2&hv=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'healthyVolunteers',
					message: 'Please enter a valid healthy volunteer indicator.',
				},
			],
		],
		[
			'Healthy Volunteers - not a number',
			'rl=2&hv=chicken',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'healthyVolunteers',
					message: 'Please enter a valid healthy volunteer indicator.',
				},
			],
		],
		[
			'Trial Type - unknown id',
			'rl=2&tt=chicken',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'trialTypes',
					message: 'Invalid selection',
				},
			],
		],
		[
			'Phase - unknown id',
			'rl=2&tp=chicken',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'trialPhases',
					message: 'Invalid selection',
				},
			],
		],
		[
			'Pager test - bad',
			'rl=2&pn=chicken',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'resultsPage',
					message: 'Invalid parameter',
				},
			],
		],
		[
			'Pager test - bad',
			'rl=2&pn=-1',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'resultsPage',
					message: 'Invalid parameter',
				},
			],
		],
		[
			'VA Only test - bad',
			'rl=2&va=chicken',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'vaOnly',
					message: 'Invalid parameter',
				},
			],
		],
	];

	// Test iterates over multiple cases defined by mappingTestCases
	it.each(errorMappingTestCases)(
		'%# - errors mapping %s',
		async (
			testName,
			urlQuery,
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher,
			expectedErrors
		) => {
			const expected = {
				searchCriteria: null,
				errors: expectedErrors,
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
