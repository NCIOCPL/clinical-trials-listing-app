/**
 * Gets a listing information from the Listing Information API matching the requested pretty URL name
 *
 * @param {string} queryParam the pretty URL name to match
 */
export const getListingInformationByName = ({ name = '' }) => {
	return {
		type: 'name',
		payload: name,
	};
};
