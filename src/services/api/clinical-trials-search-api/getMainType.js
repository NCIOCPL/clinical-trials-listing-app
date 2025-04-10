import qs from 'qs';

/**
 * Fetches disease main types to populate the Primary Cancer Type/Condition field
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {object} query the cts query
 */
export const getMainType = async (client, query) => {
	try {
		// Using arrayFormat: 'repeat' to ensure arrays are serialized as repeated parameters
		// e.g., &current_trial_status=A&current_trial_status=B instead of &current_trial_status=A,B
		const queryString = qs.stringify(query, { arrayFormat: 'repeat' });

		const res = await client.get(`/diseases?${queryString}`);
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
