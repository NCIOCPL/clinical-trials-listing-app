export const deepSearchObject = (cacheKey, object, result = []) => {
	Object.keys(object).forEach((key) => {
		// does the key match what we're looking for?
		if (key === cacheKey) {
			result.push(object[key]);
			return result;
		}
		if (typeof object[key] === 'object' && object[key] !== null) {
			deepSearchObject(cacheKey, object[key], result);
		}
	});
	return result;
};
