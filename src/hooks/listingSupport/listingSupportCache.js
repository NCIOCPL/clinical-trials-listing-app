/**
 * Simple class to encapsulate a collection of cache items.
 */
export default class ListingSupportCache {
	/**
	 * Create an instance of ListingSupportCache
	 */
	constructor() {
		this._cache = {};
	}

	/**
	 * Adds or updates an item in the cache
	 * @param {string} key the key for the item
	 * @param {Object} value the value to cache
	 */
	add(key, value) {
		this._cache[key] = value;
	}

	/**
	 * Gets an item from the cache
	 * @param {string} key the key for the item
	 */
	get(key) {
		return this._cache[key];
	}

	/**
	 * Gets all the keys from the cache.
	 */
	keys() {
		return Object.keys(this._cache);
	}
}
