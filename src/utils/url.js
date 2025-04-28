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
		// Validate age values
		const validAgeValues = ageValues.filter((age) => {
			const numAge = parseInt(age, 10);
			return !isNaN(numAge) && numAge >= 0 && numAge <= 120;
		});

		if (validAgeValues.length) {
			filters.age = validAgeValues;
		} else {
			console.warn('Invalid age values in URL:', ageValues);
		}
	}

	// Handle zip and radius params with validation
	const zip = params.get(URL_PARAM_MAPPING.zipCode.shortCode);
	const radius = params.get(URL_PARAM_MAPPING.radius.shortCode);

	if (zip || radius) {
		// Validate ZIP format if present
		const validZip = zip ? /^\d{5}$/.test(zip) : true;

		if (validZip) {
			filters.location = {
				zipCode: zip || '',
				radius: radius || (zip ? '100' : ''),
			};
		} else {
			console.warn('Invalid ZIP code in URL:', zip);
		}
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

export const removeQueryParam = (queryString, keyToRemove) => {
	const params = new URLSearchParams(queryString);
	params.delete(keyToRemove);
	const newSearch = params.toString();
	// Return with '?' prefix if there are still params, otherwise empty string
	return newSearch ? `?${newSearch}` : '';
};
