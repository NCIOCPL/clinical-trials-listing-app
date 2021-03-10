/**
 * Request Interceptor that can be used to make replacements
 *
 * This interceptor will match ocurrances of {{key}} and replace it
 * with val. It will only make replacements if the action's payload
 * has a matching interceptorName. The interceptors should be
 * instantated from index.js, setting the replacements from the
 * initialize parameters.
 *
 * @param {string} interceptorName The name of the interceptor to match against actions
 * @param {Object} replacements A collection of Key/Value pairs to be used in the replacements
 */
export const replacingRequestInterceptor = (
	interceptorName,
	replacements
) => () => async (action) => {
	if (action.interceptorName === interceptorName) {
		const newEndpoint = Object.entries(replacements).reduce(
			(ac, [key, val]) => ac.replace(`{{${key}}}`, val),
			action.endpoint
		);
		return {
			...action,
			endpoint: newEndpoint,
			signal: null,
		};
	} else {
		// Pass it through
		return action;
	}
};
