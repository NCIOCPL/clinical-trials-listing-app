export const getPageOffset = (page, resultsPerPage) => {
	return page * resultsPerPage - resultsPerPage;
};
