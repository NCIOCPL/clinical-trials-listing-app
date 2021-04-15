/**
 * Gets a listing information from the Clinical Trials Listing API matching the requested pretty URL name
 *
 * @param {string} queryParam the pretty URL name to match
 */
export const getListingInformationByName = ({ queryParam = '' }) => {
	return {
		interceptorName: 'listing-api',
		method: 'GET',
		endpoint: `{{API_HOST}}/listing-information/${queryParam}`,
	};
};
