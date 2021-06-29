import { ListingSupportCache } from '../index';
import { updateCache } from '../updateCache';
import { getListingInformationById as IdAction } from '../../../services/api/actions/getListingInformationById';
import { getListingInformationByName as NameAction } from '../../../services/api/actions/getListingInformationByName';
import { getTrialType as TrialTypeAction } from '../../../services/api/actions/getTrialType';

describe('updateCache', () => {
	// Let's set up some API responses that we are going to reuse all over
	// the place, which is end up being hard to read.
	const CONCEPT_BREAST_CANCER = {
		conceptId: ['C4872'],
		name: {
			label: 'Breast Cancer',
			normalized: 'breast cancer',
		},
		prettyUrlName: 'breast-cancer',
	};

	const CONCEPT_MULTI_ID = {
		conceptId: ['C1111', 'C2222'],
		name: {
			label: 'Multi-id Concept',
			normalized: 'multi-id concept',
		},
		prettyUrlName: 'multi-id-concept',
	};

	const CONCEPT_NO_PURL = {
		conceptId: ['C99999'],
		name: {
			label: 'No Purl Concept',
			normalized: 'no purl concept',
		},
		prettyUrlName: null,
	};

	const TRIAL_TYPE_TREATMENT = {
		prettyUrlName: 'treatment',
		idString: 'treatment',
		label: 'Treatment',
	};

	const TRIAL_TYPE_SUPP_CARE = {
		prettyUrlName: 'supportive-care',
		idString: 'supportive_care',
		label: 'Supportive Care',
	};

	const DEFAULT_FETCH_RESPONSE = [
		CONCEPT_MULTI_ID,
		TRIAL_TYPE_TREATMENT,
		CONCEPT_NO_PURL,
	];

	const DEFAULT_FETCH_ACTIONS = [
		NameAction({ name: 'multi-id-concept' }),
		TrialTypeAction({ trialType: 'treatment' }),
		IdAction({ ids: ['C99999'] }),
	];

	// HACK: We should not be looking at ._cache, but for now to get this out
	// the door it can stay. (Seeing as how this is the only thing that ever
	// updates the cache...)

	it('caches multiple responses correctly, with empty initial', () => {
		const cache = new ListingSupportCache();

		const expected = {
			C1111: CONCEPT_MULTI_ID,
			C2222: CONCEPT_MULTI_ID,
			'multi-id-concept': CONCEPT_MULTI_ID,
			treatment: TRIAL_TYPE_TREATMENT,
			C99999: CONCEPT_NO_PURL,
		};

		updateCache(cache, DEFAULT_FETCH_ACTIONS, DEFAULT_FETCH_RESPONSE);
		expect(cache._cache).toEqual(expected);
	});

	it('handles trials types with different id and pretty url', () => {
		const cache = new ListingSupportCache();

		const expected = {
			supportive_care: TRIAL_TYPE_SUPP_CARE,
			'supportive-care': TRIAL_TYPE_SUPP_CARE,
		};

		updateCache(
			cache,
			[TrialTypeAction({ trialType: 'supportive-care' })],
			[TRIAL_TYPE_SUPP_CARE]
		);
		expect(cache._cache).toEqual(expected);
	});

	it('caches multiple responses correctly, when adding', () => {
		const cache = new ListingSupportCache();
		cache.add(CONCEPT_BREAST_CANCER.prettyUrlName, CONCEPT_BREAST_CANCER);
		cache.add(CONCEPT_BREAST_CANCER.conceptId[0], CONCEPT_BREAST_CANCER);

		const expected = {
			'breast-cancer': CONCEPT_BREAST_CANCER,
			C4872: CONCEPT_BREAST_CANCER,
			C1111: CONCEPT_MULTI_ID,
			C2222: CONCEPT_MULTI_ID,
			'multi-id-concept': CONCEPT_MULTI_ID,
			treatment: TRIAL_TYPE_TREATMENT,
			C99999: CONCEPT_NO_PURL,
		};

		updateCache(cache, DEFAULT_FETCH_ACTIONS, DEFAULT_FETCH_RESPONSE);
		expect(cache._cache).toEqual(expected);
	});

	it('handles cases when there are nothing to add', () => {
		const cache = new ListingSupportCache();
		cache.add('C99999', CONCEPT_NO_PURL);

		updateCache(cache, [DEFAULT_FETCH_ACTIONS[2]], [DEFAULT_FETCH_RESPONSE[2]]);
		// NOTE: This really should be "toBe" we want the memory address to be the same
		expect(cache._cache).toEqual({ C99999: CONCEPT_NO_PURL });
	});

	it('caches multiple responses correctly, handles 404 for TT', () => {
		const cache = new ListingSupportCache();

		const expected = {
			C1111: CONCEPT_MULTI_ID,
			C2222: CONCEPT_MULTI_ID,
			'multi-id-concept': CONCEPT_MULTI_ID,
			C99999: CONCEPT_NO_PURL,
		};

		updateCache(cache, DEFAULT_FETCH_ACTIONS, [
			CONCEPT_MULTI_ID,
			null,
			CONCEPT_NO_PURL,
		]);
		expect(cache._cache).toEqual(expected);
	});

	it('throws an error when fetch type is unknown', () => {
		expect(() => {
			updateCache({}, [{ type: 'chicken' }], [{}]);
		}).toThrow('Unknown fetch action chicken');
	});
});
