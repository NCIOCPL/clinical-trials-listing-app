/**
 * Creates an array of objects with "term" and "termKey" as object properties
 * populated with value of the "keyName" property provided from an array of objects provided as parameter
 * @param {array} data - An array containing objects with a "keyName" property
 * @return {({termKey: *, term: *})[]|*[]}
 */
export const createTermDataFromArrayObj = (data = [], keyName = '') => {
	if (typeof keyName !== 'string') {
		throw new Error('keyName parameter should be a string');
	} else if (keyName.length < 1) {
		throw new Error('You have to provide a keyName parameter');
	}

	const retArray = data
		.map((dataObj) => {
			const dataKey = dataObj[keyName];

			// Early exit and return null if dataKey is undefined
			if (!dataKey) {
				return null;
			}

			const retObj = { term: dataKey, termKey: dataKey };
			return retObj;
		})
		.filter(Boolean);

	return retArray.length ? retArray : [];
};
