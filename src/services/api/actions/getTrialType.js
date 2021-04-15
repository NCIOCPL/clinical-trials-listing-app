/**
 * Gets a trial type from the Clinical Trials Listing API matching the requested trial type
 *
 * @param {Array} queryParam the trial type to match
 */
export const getTrialType = ({ queryParam = '' }) => {
	return {
		interceptorName: 'listing-api',
		method: 'GET',
		endpoint: `{{API_HOST}}/trial-type/${queryParam}`,
	};
};
