export const getKeyValueFromQueryString = (key, queryString) => {
	const keyValueDelimiter = '=';
	const queryStrArray = queryString.replace('?', '').split('&');
	const queryStr = queryStrArray.filter((queryStr) =>
		queryStr.includes(`${key}${keyValueDelimiter}`)
	);
	return queryStr.length > 0 ? queryStr[0].split(keyValueDelimiter)[1] : null;
};
