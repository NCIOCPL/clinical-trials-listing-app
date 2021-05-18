/**
 * Gets a listing information from the Listing Information API matching the requested pretty URL name
 *
 * @param {string} queryParam the pretty URL name to match
 */
export const getListingInformationByName = ({ name = '' }) => {
	if (!name || name === '') {
		throw new Error('You must specify a name in order to fetch it.');
	}

	return {
		type: 'name',
		payload: name,
	};
};
