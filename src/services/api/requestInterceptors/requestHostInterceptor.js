export const requestHostInterceptor = (host) => (client) => async (action) => {
	return {
		...action,
		endpoint: `${host}${action.endpoint}`,
		signal: null,
	};
};
