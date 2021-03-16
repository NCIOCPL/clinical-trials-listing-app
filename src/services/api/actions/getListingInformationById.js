/**
 * Gets a listing information from the Listing Information API matching the requested concept ID(s)
 *
 * @param {Array} queryParam the concept ID(s) to match
 */
export const getListingInformationById = ({ queryParam = [] }) => {
	// Set up query params for Listing Information API.
	const queryString = queryParam
		.map((param) => {
			return 'ccode=' + param;
		})
		.join('&');

	return {
		interceptorName: 'listing-information-api',
		method: 'GET',
		endpoint: `{{API_HOST}}/listing-information/get?${queryString}`,
	};
};
