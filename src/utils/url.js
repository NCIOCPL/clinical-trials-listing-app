/**
 * appendOrUpdateToQueryString - Appends or updates params to query string
 *
 * @param {string} queryString
 * @param {string} key
 * @param {string} val
 * @return {string}
 */
export const appendOrUpdateToQueryString = (queryString, key, val) => {
	// Strip out "?" char
	queryString = queryString.replace('?', '');

	if (!queryString.length) {
		return `?${key}=${val}`;
	}

	// Convert query string to array by splitting
	const paramsArray = queryString.split('&');

	// Filter out "pn" param if any
	const retArray = paramsArray.filter((param) => !param.includes(`${key}=`));

	// Add param key-value
	retArray.push(`${key}=${val}`);

	// Convert array back to string with join
	const retQueryString = `?${retArray.join('&')}`;

	// Return value
	return retQueryString;
};

export const getKeyValueFromQueryString = (key, queryString) => {
	const keyValueDelimiter = '=';
	const queryStrArray = queryString.replace('?', '').split('&');
	const queryStr = queryStrArray.filter((queryStr) => queryStr.includes(`${key}${keyValueDelimiter}`));
	return queryStr.length > 0 ? queryStr[0].split(keyValueDelimiter)[1] : null;
};
