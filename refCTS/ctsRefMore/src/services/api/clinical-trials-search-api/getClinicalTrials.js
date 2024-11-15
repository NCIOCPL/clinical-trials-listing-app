/**
 * Fetches listing information matching the requested concept ID(s)
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {object} query the cts query
 */
export const getClinicalTrials = async (client, query) => {
	try {
		const res = await client.post(`/trials`, query);
		if (res.status === 200) {
			if (
				res.data.total === null ||
				typeof res.data.total === 'undefined' ||
				(res.data.total > 0 && !res.data?.data?.length) ||
				(res.data.total === 0 && res.data?.data?.length !== 0)
			) {
				throw new Error(`Trial count mismatch from the API`);
			} else {
				return res.data;
			}
		} else {
			// This condition will be hit for anything < 300.
			throw new Error(
				`Unexpected status ${res.status} for fetching clinical trials`
			);
		}
	} catch (error) {
		// This conditional will be hit for any status >= 300.
		if (error.response) {
			throw new Error(
				`Unexpected status ${error.response.status} for fetching clinical trials`
			);
		}
		throw error;
	}
};
