import { useReducer } from 'react';
import { setCaching } from './cacheActions';

function reducer(state, action) {
	switch (action.set_cache.type) {
		case 'SET_CACHE':
			return {
				...state,
				[action.key]: action.payload,
			};
		default:
			return null;
	}
}

export const useCache = () => {
	const [cache, dispatch] = useReducer(reducer, {});

	const getCacheItem = (key) => {
		var foundItem;
		//checks to see if the key is an array of c-codes
		if (Array.isArray(key) && key.length > 1) {
			for (var i = 0; i < key.length; i++) {
				var cachedKey = key[i];
				if (cache[cachedKey]) {
					foundItem = cache[cachedKey];
				}
			}
		} else {
			foundItem = cache[key];
		}
		if (foundItem == undefined) {
			return false;
		}
		return foundItem;
	};
	const cacheItem = (payload, key) => {
		//console.log('thing about to be cached is:', key, 'payload is: ', payload);
		var set_cache = setCaching();
		dispatch({ set_cache, payload: payload, key: key });
	};
	return {
		getCacheItem,
		cacheItem,
	};
};
