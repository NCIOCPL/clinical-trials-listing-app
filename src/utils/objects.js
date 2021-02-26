export const getKeyValueFromObject = (key, obj) => {
	let retValue;
	Object.keys(obj).forEach((thisKey) => {
		if (thisKey === key) {
			retValue = obj[key];
		}
	});
	return retValue;
};
