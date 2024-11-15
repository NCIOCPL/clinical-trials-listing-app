import { queryStringToSearchCriteria } from '../queryStringToSearchCriteria';
import { getInterventionFetcher } from './queryStringToSearchCriteria.common';

describe('Advanced - Interventions - Negative - queryStringToSearchCriteria maps query to form', () => {
	const errorMappingTestCases = [
		[
			'bad drug id',
			'?d=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'drugs', message: 'Please enter a valid parameter' }],
		],
		[
			'bad drug id with one good',
			'd=C1111&d=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'drugs',
					message: 'Please enter a valid parameter',
				},
			],
		],
		[
			'unknown drugid',
			'd=C9999&rl=2',
			async () => [],
			getInterventionFetcher(['C9999'], []),
			async () => null,
			[
				{
					fieldName: 'drugs',
					message: 'Unknown intervention ID',
				},
			],
		],
		[
			'bad category for drug',
			'd=C6666&rl=2',
			async () => [],
			getInterventionFetcher(['C6666'], ['Treatment A']),
			async () => null,
			[
				{
					fieldName: 'drugs',
					message: 'Incorrect intervention category',
				},
			],
		],
		// Other Treatments
		[
			'bad treatment id',
			'?i=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[{ fieldName: 'treatments', message: 'Please enter a valid parameter' }],
		],
		[
			'bad treatment id with one good',
			'i=C1111&i=chicken&rl=2',
			async () => [],
			async () => [],
			async () => null,
			[
				{
					fieldName: 'treatments',
					message: 'Please enter a valid parameter',
				},
			],
		],
		[
			'unknown treatment id',
			'i=C9999&rl=2',
			async () => [],
			getInterventionFetcher(['C9999'], []),
			async () => null,
			[
				{
					fieldName: 'treatments',
					message: 'Unknown intervention ID',
				},
			],
		],
		[
			'bad category for treatment',
			'i=C5555&rl=2',
			async () => [],
			getInterventionFetcher(['C5555'], ['Drug A']),
			async () => null,
			[
				{
					fieldName: 'treatments',
					message: 'Incorrect intervention category',
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
