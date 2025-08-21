import qs from 'qs';

/**
 * Fetches Drugs to populate the drug field in the Drug/Drug Family section
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {object} query the cts query
 */
export const searchDrug = async (client, query) => {
	try {
		const queryString = qs.stringify(query, { arrayFormat: 'repeat' });

		const res = await client.get(`/interventions?${queryString}`);
		if (res.status === 200) {
			return res.data;
		} else {
			// This condition will be hit for anything < 300.
			throw new Error(`Unexpected status ${res.status} for fetching drugs`);
		}
	} catch (error) {
		// This conditional will be hit for any status >= 300.
		if (error.response) {
			throw new Error(`Unexpected status ${error.response.status} for fetching drugs`);
		}
		throw error;
	}
};
