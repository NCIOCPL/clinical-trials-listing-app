import { queryStringToSearchCriteria } from '../queryStringToSearchCriteria';

describe('Advanced - Locations - Negative - queryStringToSearchCriteria maps query to form', () => {
	const errorMappingTestCases = [
		[
			'Bad location value',
			'?loc=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'location',
					message: 'Please enter a valid location type.',
				},
			],
		],
		[
			'Unknown location value',
			'?loc=5&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'location',
					message: 'Please enter a valid location type.',
				},
			],
		],
		[
			'hospital - No value',
			'?loc=3&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'hospital', message: 'Please enter a valid hospital.' }],
		],
		[
			'CCS - No Country',
			'?loc=2&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'country', message: 'Please enter a country.' }],
		],
		[
			'CCS - Bad State',
			'?loc=2&lcnty=United+States&lst=ZZ&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'states', message: 'Unknown State.' }],
		],
		[
			'CCS - Have state for other country',
			'?loc=2&lcnty=Canada&lst=MD&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'states', message: 'State with non-US Country Invalid.' }],
		],
		[
			'Zip - No Zip',
			'?loc=1&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'zip', message: 'Invalid Parameter' }],
		],
		[
			'Zip - Bad Zip',
			'?loc=1&z=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'zip', message: 'Invalid Parameter' }],
		],
		[
			'Zip - Multizip',
			'?loc=1&z=20852&z=20874&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'zip', message: 'Invalid Parameter' }],
		],
		[
			'Zip - Missing Zip',
			'?loc=1&z=99999&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'zipCoords', message: 'Invalid Coordinates' }],
		],
		[
			'Zip - bad proximity',
			'?loc=1&z=20852&zp=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'zipRadius', message: 'Invalid Parameter' }],
		],
		[
			'Zip - bad proximity',
			'?loc=1&z=20852&zp=-1&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'zipRadius', message: 'Invalid Parameter' }],
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
