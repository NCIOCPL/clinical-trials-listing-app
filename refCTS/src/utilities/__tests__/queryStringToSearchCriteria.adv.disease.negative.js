import { queryStringToSearchCriteria } from '../queryStringToSearchCriteria';
import { getDiseaseFetcher } from './queryStringToSearchCriteria.common';

describe('Adv - Disease - Negative - queryStringToSearchCriteria maps query to form', () => {
	const errorMappingTestCases = [
		[
			'adv - bad main type',
			't=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'cancerType',
					message: 'Please enter a valid parameter',
				},
			],
		],
		[
			'adv - bad multiple main types',
			't=C1111&t=C1112&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'cancerType',
					message: 'Please include only one main cancer type in your search.',
				},
			],
		],
		[
			'adv - unknown type',
			't=C9999&rl=2',
			getDiseaseFetcher(['C9999'], []),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'cancerType',
					message: 'Unknown disease ID',
				},
			],
		],
		[
			'adv - only allow main type - test subtype',
			't=C2222&rl=2',
			getDiseaseFetcher(['C2222'], ['Subtype A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'cancerType',
					message: 'Incorrect disease type',
				},
			],
		],
		[
			'adv - only allow main type - test stage',
			't=C3333&rl=2',
			getDiseaseFetcher(['C3333'], ['Stage A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'cancerType',
					message: 'Incorrect disease type',
				},
			],
		],
		[
			'adv - only allow main type - test finding',
			't=C4444&rl=2',
			getDiseaseFetcher(['C4444'], ['Finding A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'cancerType',
					message: 'Incorrect disease type',
				},
			],
		],
		// Subtype
		[
			'adv - bad subtype',
			'st=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'subtypes',
					message: 'Please enter a valid parameter',
				},
			],
		],
		[
			'adv - bad subtypes with 1 good',
			'st=C1111&st=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'subtypes',
					message: 'Please enter a valid parameter',
				},
			],
		],
		[
			'adv - unknown subtype',
			'st=C9999&rl=2',
			getDiseaseFetcher(['C9999'], []),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'subtypes',
					message: 'Unknown disease ID',
				},
			],
		],
		[
			'adv - only allow subtypes - test maintype',
			'st=C1111&rl=2',
			getDiseaseFetcher(['C1111'], ['Main Type A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'subtypes',
					message: 'Incorrect disease type',
				},
			],
		],
		[
			'adv - only allow subtype - test stage',
			'st=C3333&rl=2',
			getDiseaseFetcher(['C3333'], ['Stage A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'subtypes',
					message: 'Incorrect disease type',
				},
			],
		],
		[
			'adv - only allow subtype - test finding',
			'st=C4444&rl=2',
			getDiseaseFetcher(['C4444'], ['Finding A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'subtypes',
					message: 'Incorrect disease type',
				},
			],
		],
		// Stages
		[
			'adv - bad stage',
			'stg=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'stages',
					message: 'Please enter a valid parameter',
				},
			],
		],
		[
			'adv - bad stage after good',
			'stg=C1111&stg=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'stages',
					message: 'Please enter a valid parameter',
				},
			],
		],
		[
			'adv - unknown stage',
			'stg=C9999&rl=2',
			getDiseaseFetcher(['C9999'], []),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'stages',
					message: 'Unknown disease ID',
				},
			],
		],
		[
			'adv - only allow stages - test maintype',
			'stg=C1111&rl=2',
			getDiseaseFetcher(['C1111'], ['Main Type A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'stages',
					message: 'Incorrect disease type',
				},
			],
		],
		[
			'adv - only allow stage - test subtype',
			'stg=C2222&rl=2',
			getDiseaseFetcher(['C2222'], ['Subtype A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'stages',
					message: 'Incorrect disease type',
				},
			],
		],
		[
			'adv - only allow stage - test finding',
			'stg=C4444&rl=2',
			getDiseaseFetcher(['C4444'], ['Finding A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'stages',
					message: 'Incorrect disease type',
				},
			],
		],
		// Findings
		[
			'adv - bad finding',
			'fin=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'findings',
					message: 'Please enter a valid parameter',
				},
			],
		],
		[
			'adv - bad finding following good',
			'fin=C4444&fin=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'findings',
					message: 'Please enter a valid parameter',
				},
			],
		],
		[
			'adv - unknown stage',
			'fin=C9999&rl=2',
			getDiseaseFetcher(['C9999'], []),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'findings',
					message: 'Unknown disease ID',
				},
			],
		],
		[
			'adv - only allow findings - test maintype',
			'fin=C1111&rl=2',
			getDiseaseFetcher(['C1111'], ['Main Type A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'findings',
					message: 'Incorrect disease type',
				},
			],
		],
		[
			'adv - only allow findings - test subtype',
			'fin=C2222&rl=2',
			getDiseaseFetcher(['C2222'], ['Subtype A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'findings',
					message: 'Incorrect disease type',
				},
			],
		],
		[
			'adv - only allow findings - test stage',
			'fin=C3333&rl=2',
			getDiseaseFetcher(['C3333'], ['Stage A']),
			async () => [],
			async () => null,
			[
				{
					fieldName: 'findings',
					message: 'Incorrect disease type',
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
