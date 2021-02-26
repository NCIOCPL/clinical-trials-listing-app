export const requestHostInterceptor = (host) => () => async (action) => {
	return {
		...action,
		endpoint: `${host}${action.endpoint}`,
		signal: null,
	};
};
