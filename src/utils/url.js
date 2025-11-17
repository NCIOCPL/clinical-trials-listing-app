import { URL_PARAM_MAPPING } from '../features/filters/constants/urlParams';

/**
 * Validates URL parameters and returns an object indicating validation results
 * @param {URLSearchParams} params - The URL parameters to validate
 * @param {boolean} hasMainType - Whether a main type parameter exists (for dependency validation)
 * @returns {object} Validation result with isValid flag and invalidParams array
 */
export const validateURLParams = (params, hasMainType = false) => {
	const invalidParams = [];

	// Validate age parameter
	const ageValues = params.getAll(URL_PARAM_MAPPING.age.shortCode);
	if (ageValues.length > 0) {
		const hasInvalidAge = ageValues.some((age) => {
			// Check if the string contains only digits
			if (!/^\d+$/.test(age)) {
				return true; // Invalid: contains non-numeric characters
			}
			const numAge = parseInt(age, 10);
			return isNaN(numAge) || numAge < 0 || numAge > 120;
		});
		if (hasInvalidAge) {
			invalidParams.push(URL_PARAM_MAPPING.age.shortCode);
		}
	}

	// Validate subtype - invalid if present without maintype
	const subtypeValue = params.get(URL_PARAM_MAPPING.subtype.shortCode);
	if (subtypeValue && !hasMainType) {
		invalidParams.push(URL_PARAM_MAPPING.subtype.shortCode);
	}

	// Validate stage - invalid if present without maintype
	const stageValue = params.get(URL_PARAM_MAPPING.stage.shortCode);
	if (stageValue && !hasMainType) {
		invalidParams.push(URL_PARAM_MAPPING.stage.shortCode);
	}

	return {
		isValid: invalidParams.length === 0,
		invalidParams,
	};
};

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
			// Check if the string contains only digits
			if (!/^\d+$/.test(age)) {
				return false; // Invalid: contains non-numeric characters
			}
			const numAge = parseInt(age, 10);
			return !isNaN(numAge) && numAge >= 0 && numAge <= 120;
		});

		if (validAgeValues.length) {
			filters.age = validAgeValues;
		} else {
			console.warn('Invalid age values in URL:', ageValues);
		}
	}

	// Handle maintype param
	const maintypeValue = params.get(URL_PARAM_MAPPING.maintype.shortCode);
	if (maintypeValue) {
		filters.maintype = [maintypeValue]; // Store as array to match filter state structure
	}

	// Handle subtype param
	const subtypeValue = params.get(URL_PARAM_MAPPING.subtype.shortCode);
	if (subtypeValue) {
		filters.subtype = [subtypeValue]; // Store as array to match filter state structure
	}

	// Handle stage param
	const stageValue = params.get(URL_PARAM_MAPPING.stage.shortCode);
	if (stageValue) {
		filters.stage = [stageValue]; // Store as array to match filter state structure
	}

	// Handle drugIntervention param (comma-separated concept codes)
	const drugInterventionValue = params.get(URL_PARAM_MAPPING.drugIntervention.shortCode);
	if (drugInterventionValue) {
		// Store as concept codes only - the DrugInterventionFilter will handle loading full drug data
		const codes = drugInterventionValue.split(',').filter((code) => code.trim());
		if (codes.length > 0) {
			// Store just the concept codes, DrugInterventionFilter will fetch drug details
			filters.drugIntervention = codes;
		}
	}

	// Handle zip and radius params with validation
	const zip = params.get(URL_PARAM_MAPPING.zipCode.shortCode);
	const radius = params.get(URL_PARAM_MAPPING.radius.shortCode);

	// Only process location if we have a zip code
	if (zip) {
		// Only add valid zipcodes to filters
		const validZip = /^\d{5}$/.test(zip);

		if (validZip) {
			filters.location = {
				zipCode: zip,
				radius: radius || '100',
			};
		}
	}

	return filters;
};

export const updateURLWithFilters = (filters, existingSearch) => {
	// Start with existing params
	const params = new URLSearchParams(existingSearch);

	// Clear any existing filter params
	params.delete(URL_PARAM_MAPPING.age.shortCode);
	params.delete(URL_PARAM_MAPPING.maintype.shortCode);
	// We can add other filter param deletions here as needed

	// Add new filter params
	if (filters.age?.length) {
		filters.age.forEach((age) => params.append(URL_PARAM_MAPPING.age.shortCode, age));
	}

	// Add maintype param if it exists
	if (filters.maintype?.length && filters.maintype[0]) {
		params.set(URL_PARAM_MAPPING.maintype.shortCode, filters.maintype[0]);
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

/**
 * Removes multiple query parameters from a query string
 * @param {string} queryString - The query string to process
 * @param {string[]} keysToRemove - Array of parameter keys to remove
 * @returns {string} Updated query string with parameters removed
 */
export const removeMultipleQueryParams = (queryString, keysToRemove) => {
	const params = new URLSearchParams(queryString);
	keysToRemove.forEach((key) => params.delete(key));
	const newSearch = params.toString();
	return newSearch ? `?${newSearch}` : '';
};
