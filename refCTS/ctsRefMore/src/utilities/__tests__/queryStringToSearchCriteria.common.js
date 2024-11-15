// Mocks for what the API /disease endpoint will return
// eslint-disable-next-line jest/no-export
export const API_DISEASE_MOCKS = {
	'Main Type A': { name: 'Main Type A', codes: ['C1111'], type: ['maintype'] },
	'Main Type B': {
		name: 'Main Type B',
		codes: ['C1112', 'C1113'],
		type: ['maintype'],
	},
	'Main Type C': {
		name: 'Main Type C',
		codes: ['C1114'],
		type: ['maintype', 'subtype'],
	},
	'Subtype A': { name: 'Subtype A', codes: ['C2222'], type: ['subtype'] },
	'Subtype B': {
		name: 'Subtype B',
		codes: ['C2223', 'C2224'],
		type: ['subtype'],
	},
	'Stage A': { name: 'Stage A', codes: ['C3333'], type: ['stage'] },
	'Stage B': { name: 'Stage B', codes: ['C3334', 'C3335'], type: ['stage'] },
	'Stage C': {
		name: 'Stage C',
		codes: ['C3336', 'C3337', 'C3338'],
		type: ['grade', 'subtype', 'stage'],
	},
	'Finding A': { name: 'Finding A', codes: ['C4444'], type: ['finding'] },
	'Finding B': {
		name: 'Finding B',
		codes: ['C4445', 'C4446'],
		type: ['finding'],
	},
};
// eslint-disable-next-line jest/no-export
export const API_INTERVENTION_MOCKS = {
	'Drug A': { name: 'Drug A', codes: ['C5555'], category: 'agent' },
	'Drug B': { name: 'Drug B', codes: ['C5556', 'C5557'], category: 'agent' },
	'Drug Category A': {
		name: 'Drug Category A',
		codes: ['C5558'],
		category: 'agent category',
	},
	'Treatment A': { name: 'Treatment A', codes: ['C6666'], category: 'none' },
	'Treatment B': {
		name: 'Treatment B',
		codes: ['C6667', 'C6668'],
		category: 'other',
	},
};

// Expected objects for the disease & intervention elements in the form state.
// NOTE: for now they are exactly the same as the API_XXXXX_MOCKS
// This is here so if they have to change we don't have to change
// all the code below.
// eslint-disable-next-line jest/no-export
export const TYPE_EXPECTATION = API_DISEASE_MOCKS;
// eslint-disable-next-line jest/no-export
export const INTERVENTION_EXPECTATION = API_INTERVENTION_MOCKS;

/**
 * Helper to get a diseaseFetcher mock.
 * @param {array} ids - The expected IDs.
 * @param {array} rtnDiseases - An array of the API_DISEASE_MOCKS to return.
 */
// eslint-disable-next-line jest/no-export
export const getDiseaseFetcher = (ids, rtnDiseases) => {
	return async () =>
		Object.entries(API_DISEASE_MOCKS)
			.filter((pair) => rtnDiseases.includes(pair[0]))
			.map((pair) => pair[1]);
};

/**
 * Helper to get a interventions Fetcher mock.
 * @param {array} ids - The expected IDs.
 * @param {array} rtnInterventions - An array of the API_INTERVENTION_MOCKS to return.
 */
// eslint-disable-next-line jest/no-export
export const getInterventionFetcher = (ids, rtnInterventions) => {
	return async () =>
		Object.entries(API_INTERVENTION_MOCKS)
			.filter((pair) => rtnInterventions.includes(pair[0]))
			.map((pair) => pair[1]);
};

const fetcherTests = [
	[
		'Single Disease',
		getDiseaseFetcher(['C1111'], ['Main Type A']),
		[API_DISEASE_MOCKS['Main Type A']],
	],
	[
		'Multi Diseases',
		getDiseaseFetcher(['C1111', 'C1112'], ['Main Type A', 'Main Type B']),
		[API_DISEASE_MOCKS['Main Type A'], API_DISEASE_MOCKS['Main Type B']],
	],
];

describe('fetch disease', () => {
	it.each(fetcherTests)(
		'getDiseaseFetcher - %s',
		async (name, diseaseFetcher, expected) => {
			const actual = await diseaseFetcher(['C1111', 'C1112']);
			expect(actual).toEqual(expected);
		}
	);
});
