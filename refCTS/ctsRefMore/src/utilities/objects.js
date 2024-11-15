export const getKeyValueFromObject = (key, obj) => {
	let retValue;
	Object.keys(obj).forEach((thisKey) => {
		if (thisKey === key) {
			retValue = obj[key];
		}
	});
	return retValue;
};

/**
 * Gets a hash for an object.
 *
 * @param {object} obj the object to hash
 */
export const convertObjectToBase64 = (obj) => {
	return Buffer.from(JSON.stringify(obj)).toString('base64');
};
