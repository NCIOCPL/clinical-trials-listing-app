import { URL_PARAM_MAPPING } from '../features/filters/constants/urlParams';

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

	const ageValues = params.getAll(URL_PARAM_MAPPING.age.shortCode);
	if (ageValues.length) {
		filters.age = ageValues;
	}

	// Handle zip and radius params
	const zip = params.get(URL_PARAM_MAPPING.zipCode.shortCode);
	const radius = params.get(URL_PARAM_MAPPING.radius.shortCode);
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
	params.delete(URL_PARAM_MAPPING.age.shortCode);
	// We can add other filter param deletions here as needed

	// Add new filter params
	if (filters.age?.length) {
		filters.age.forEach((age) => params.append(URL_PARAM_MAPPING.age.shortCode, age));
	}

	// Add location params if they exist
	if (filters.location?.zipCode) {
		params.set(URL_PARAM_MAPPING.zipCode.shortCode, filters.location.zipCode);
	}
	if (filters.location?.radius) {
		params.set(URL_PARAM_MAPPING.radius.shortCode, filters.location.radius.toString());
	}

	// Return the full query string
	return params.toString();
};
