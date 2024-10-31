import querystring from 'query-string';

/**
 * Fetches subtypes based on ancestor id of main type to populate the Subtypes field
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {object} query the cts query
 */
export const getSubtypes = async (client, query) => {
	try {
		const res = await client.get(`/diseases?${querystring.stringify(query)}`);
		if (res.status === 200) {
			return res.data;
		} else {
			// This condition will be hit for anything < 300.
			throw new Error(`Unexpected status ${res.status} for fetching subtypes`);
		}
	} catch (error) {
		// This conditional will be hit for any status >= 300.
		if (error.response) {
			throw new Error(`Unexpected status ${error.response.status} for fetching subtypes`);
		}
		throw error;
	}
};
