/**
 * Gets a listing information from the Listing Information API matching the requested concept ID(s)
 *
 * @param {Object} params the parameters to fetch
 * @param {string[]} params.queryParam the concept ID(s) to match
 */
export const getListingInformationById = ({ queryParam = {} }) => {
	// Set up query params for Listing Information API.
	const queryString = Object.keys(queryParam).map(function(key) {
    return 'ccode=' + queryParam[key]
	}).join('&');

	return {
		interceptorName: 'listing-information-api',
		method: 'GET',
		endpoint: `{{API_HOST}}/listing-information/get?${queryString}`
	};
};
