/**
 * Gets an object with the correct keys/values for this concept to be cached
 * @param {Object} concept a listing-information response from the API
 */
const getCacheForConcept = (concept) => {
	if (concept === null) {
		return {};
	} else {
		return {
			...concept.conceptId.reduce((ac, curr) => ({ ...ac, [curr]: concept }), {}),
			...(concept.prettyUrlName ? { [concept.prettyUrlName]: concept } : {}),
		};
	}
};

/**
 * Gets an object with the correct keys/values for this trialType to be cached
 * @param {Object} trialType a trial-type response from the API
 */
const getCacheForTrialType = (trialType) => {
	if (trialType === null) {
		return {};
	} else {
		return {
			[trialType.idString]: trialType,
			...(trialType.prettyUrlName !== trialType.idString ? { [trialType.prettyUrlName]: trialType } : {}),
		};
	}
};

/**
 * Adds any responses from the API on the cache object that don't exist.
 * @param {ListingSupportCache} cache an instance of a ListingSupportCache
 * @param {Array<Object>} payload the collection of API responses.
 */
export const updateCache = (cache, fetchActions, fetchResponse) => {
	// Get all the cache items for this set of fetches.
	const cacheItems = fetchActions.reduce((ac, curr, idx) => {
		switch (curr.type) {
			case 'id':
			case 'name': {
				return {
					...ac,
					...getCacheForConcept(fetchResponse[idx]),
				};
			}
			case 'trialType': {
				return {
					...ac,
					...getCacheForTrialType(fetchResponse[idx]),
				};
			}
			default:
				throw new Error(`Unknown fetch action ${curr.type}`);
		}
	}, {});

	// Get the keys for the existing cache.
	const currentCacheKeys = cache.keys();

	// Pluck out those items that are not currently in the cache.
	const newCacheItems = Object.entries(cacheItems)
		.filter(([key]) => !currentCacheKeys.includes(key))
		.reduce((ac, [key, val]) => {
			return {
				...ac,
				[key]: val,
			};
		}, {});

	// Now we only want to update the cache if we have items to update.
	for (const [key, val] of Object.entries(newCacheItems)) {
		cache.add(key, val);
	}
};
