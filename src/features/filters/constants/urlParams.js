/**
 * URL parameter mappings for filters
 * Maps between short codes used in URLs and their corresponding long names
 */
export const URL_PARAM_MAPPING = {
	age: {
		shortCode: 'a',
		longName: 'age',
	},
	zipCode: {
		shortCode: 'z',
		longName: 'zipcode',
	},
	radius: {
		shortCode: 'zr',
		longName: 'radius',
	},
	page: {
		shortCode: 'pn',
		longName: 'page',
	},
};

/**
 * Get the short code for a given parameter long name
 */
export const getShortCode = (longName) => {
	const param = Object.values(URL_PARAM_MAPPING).find((p) => p.longName === longName);
	return param?.shortCode;
};

/**
 * Get the long name for a given parameter short code
 */
export const getLongName = (shortCode) => {
	const param = Object.values(URL_PARAM_MAPPING).find((p) => p.shortCode === shortCode);
	return param?.longName;
};
