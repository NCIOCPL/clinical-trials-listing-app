/**
 * Fetches listing information by name.
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {string} type - the trial type to fetch
 */
export const getTrialType = async (client, type) => {
	if (!type.match(/[a-zA-Z0-9-_]+/)) {
		throw new Error('Name does not match valid string, can only include a-z,0-9, dashes (-), and underscores (_)');
	}

	try {
		const res = await client.get(`/trial-type/${type}`);

		if (res.status === 200) {
			return res.data;
		} else {
			throw new Error(`Unexpected status ${res.status} for fetching name`);
		}
	} catch (error) {
		// I don't see a need to log here or anything, so we can just throw.
		if (error.response) {
			if (error.response.status === 404) {
				return null;
			} else {
				throw new Error(`Unexpected status ${error.response.status} for fetching name`);
			}
		}
		throw error;
	}
};
