export const isEmptyObj = (objToCheck) => {
	return (
		Object.entries(objToCheck).length === 0 && objToCheck.constructor === Object
	);
};
