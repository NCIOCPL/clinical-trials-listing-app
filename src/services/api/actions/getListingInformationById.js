/**
 * Gets a listing information from the Listing Information API matching the requested concept ID(s)
 *
 * @param {Array<string>} ids the concept ID(s) to match
 */
export const getListingInformationById = ({ ids = [] }) => {
	return {
		type: 'id',
		payload: ids,
	};
};
