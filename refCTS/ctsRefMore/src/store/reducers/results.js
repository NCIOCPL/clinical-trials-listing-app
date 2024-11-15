import { RECEIVE_DATA, UPDATE_RESULTS } from '../identifiers';

const defaultState = {
	search: null,
};

export const updateResults = (key, value) => ({
	type: UPDATE_RESULTS,
	payload: {
		key,
		value,
	},
});

export const reducer = (state = defaultState, action) => {
	const { cacheKey } = action.payload;
	switch (action.type) {
		case RECEIVE_DATA: {
			// All we need to do is store the cache key. The view will select and reconstitute the cached
			// items.
			return {
				...state,
				cacheKey,
			};
		}
		// restore data from cache hit
		case UPDATE_RESULTS:
			return {
				...state,
				cacheKey,
			};
		default:
			return state;
	}
};
