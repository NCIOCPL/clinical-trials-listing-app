/**
 * Gets a listing information from the Listing Information API matching the requested concept ID(s)
 *
 * @param {Array<string>} ids the concept ID(s) to match
 */
export const getListingInformationById = ({ ids = [] }) => {
	if (!ids || !Array.isArray(ids) || ids.length === 0) {
		throw new Error('You must specify ids in order to fetch them.');
	}

	return {
		type: 'id',
		payload: ids,
	};
};
