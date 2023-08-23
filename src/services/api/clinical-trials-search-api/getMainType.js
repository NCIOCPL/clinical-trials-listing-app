import querystring from 'query-string';

/**
 * Fetches disease main types to populate the Primary Cancer Type/Condition field
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {object} query the cts query
 */
export const getMainType = async (client, query) => {
	try {
		const res = await client.get(`/diseases?${querystring.stringify(query)}`);
		if (res.status === 200) {
			return res.data;
		} else {
			// This condition will be hit for anything < 300.
			throw new Error(`Unexpected status ${res.status} for fetching main types`);
		}
	} catch (error) {
		// This conditional will be hit for any status >= 300.
		if (error.response) {
			throw new Error(`Unexpected status ${error.response.status} for fetching main types`);
		}
		throw error;
	}
};
