/**
 * appendOrUpdateToQueryString - Appends or updates params to query string
 *
 * @param {string} queryString
 * @param {string} key
 * @param {string} val
 * @return {string}
 */
// export const appendOrUpdateToQueryString = (queryString, key, val) => {
// 	// Strip out "?" char
// 	queryString = queryString.replace('?', '');
//
// 	if (!queryString.length) {
// 		return `?${key}=${val}`;
// 	}
//
// 	// Convert query string to array by splitting
// 	const paramsArray = queryString.split('&');
//
// 	// Filter out "pn" param if any
// 	const retArray = paramsArray.filter((param) => !param.includes(`${key}=`));
//
// 	// Add param key-value
// 	retArray.push(`${key}=${val}`);
//
// 	// Convert array back to string with join
// 	const retQueryString = `?${retArray.join('&')}`;
//
// 	// Return value
// 	return retQueryString;
// };
//

export const appendOrUpdateToQueryString = (queryString, key, val) => {
	const params = new URLSearchParams(queryString);
	params.set(key, val);
	return `?${params.toString()}`;
};

export const getKeyValueFromQueryString = (key, queryString) => {
	const keyValueDelimiter = '=';
	const queryStrArray = queryString.replace('?', '').split('&');
	const queryStr = queryStrArray.filter((queryStr) => queryStr.includes(`${key}${keyValueDelimiter}`));
	return queryStr.length > 0 ? queryStr[0].split(keyValueDelimiter)[1] : null;
};

export const getFiltersFromURL = (search) => {
	const params = new URLSearchParams(search);
	const filters = {};
	//
	// // Handle age filter params
	// const ageValues = params.getAll('age');
	// if (ageValues.length) {
	// 	filters.age = ageValues;
	// }
	const ageValues = params.getAll('age');
	if (ageValues.length) {
		filters.age = ageValues;
	}

	// Handle zip and radius params
	const zip = params.get('zip');
	const radius = params.get('radius');
	if (zip || radius) {
		filters.location = {
			zipCode: zip || '',
			radius: radius || (zip ? '100' : ''),
		};
	}

	return filters;
};

export const updateURLWithFilters = (filters, existingSearch) => {
	// Start with existing params
	const params = new URLSearchParams(existingSearch);

	// Clear any existing filter params
	params.delete('age');
	// Add other filter param deletions here as needed

	// Add new filter params
	if (filters.age?.length) {
		filters.age.forEach((age) => params.append('age', age));
	}

	// Add location params if they exist
	if (filters.location?.zipCode) {
		params.set('zip', filters.location.zipCode);
	}
	if (filters.location?.radius) {
		params.set('radius', filters.location.radius.toString());
	}

	// Return the full query string
	return params.toString();
};
