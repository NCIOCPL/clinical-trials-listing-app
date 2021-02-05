let API_ENDPOINT;
let LANGUAGE;

function cleanURI(uri) {
	return uri.replace(/\/$/, '');
}

/**
 * Sets the base API endpoint
 *
 * @param {string} endpoint - Base API endpoint
 * @return void
 */
export function setAPIEndpoint(endpoint) {
	API_ENDPOINT = cleanURI(endpoint);
}

/**
 * Sets the current language
 *
 * @param {string} language - Two character ISO language code
 * @return void
 */
export function setLanguage(language) {
	LANGUAGE = language;
}

/**
 * Sets and returns defined API endpoint URL based on service name passed in
 *
 * @param {string} serviceName - Given name of defined API service endpoint
 * @return {string} endpoint - Endpoint URL
 */
export const getEndpoint = (serviceName) => {
	// Define api endpoints here
	const endpoints = {
		sampleCall: `${API_ENDPOINT}/sampleendpoint`,
	};
	return endpoints[serviceName];
};
