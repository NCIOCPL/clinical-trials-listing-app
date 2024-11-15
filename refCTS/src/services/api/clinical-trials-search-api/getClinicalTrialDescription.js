/**
 * Fetches trial description information matching trial id
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {object} query the cts query
 */

export const getClinicalTrialDescription = async (client, query) => {
	try {
		const res = await client.get(`/trials/${query}`);
		if (res.status !== 200) {
			// ie. Either a non-200 2xx status code or 3xx redirect
			throw new Error(
				`Unexpected status ${res.status} for fetching clinical trial description`
			);
		}
		return res.data;
	} catch (error) {
		// 4xx or 5xx error
		if (error.response) {
			// We want to clarify the default message but propogate the extra data
			error.message = `Unexpected status ${error.response.status} for fetching clinical trial description`;
		}
		throw error;
	}
};
