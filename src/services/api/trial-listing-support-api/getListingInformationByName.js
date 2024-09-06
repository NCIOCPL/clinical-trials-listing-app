/**
 * Fetches listing information by name.
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {string} name the name to fetch
 */
export const getListingInformationByName = async (client, name) => {
	if (!name.match(/[a-zA-Z0-9-]+/)) {
		throw new Error('Name does not match valid string, can only include a-z,0-9 and dashes (-)');
	}

	try {
		const res = await client.get(`/listing-information/${name}`);

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
