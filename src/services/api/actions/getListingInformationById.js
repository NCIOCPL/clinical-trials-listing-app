/**
 * Gets a listing information from the Clinical Trials Listing API matching the requested concept ID(s)
 *
 * @param {Array} queryParam the concept ID(s) to match
 */
export const getListingInformationById = ({ queryParam = [] }) => {
	// Set up query params for Clinical Trials Listing API.
	const queryString = queryParam
		.map((param) => {
			return 'ccode=' + param;
		})
		.join('&');

	return {
		interceptorName: 'listing-api',
		method: 'GET',
		endpoint: `{{API_HOST}}/listing-information/get?${queryString}`,
	};
};
