/**
 * Fetches listing information matching the requested concept ID(s)
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {Array<string>} conceptIds the concept ID(s) to match
 */
export const getListingInformationById = async (client, conceptIds) => {
	try {
		const res = await client.get(`/listing-information/get`, {
			params: {
				ccode: [conceptIds],
			},
		});

		if (res.status === 200) {
			return res.data;
		} else {
			throw new Error(`Unexpected status ${res.status} for fetching ids`);
		}
	} catch (error) {
		// I don't see a need to log here or anything, so we can just throw.
		if (error.response) {
			if (error.response.status === 404) {
				return null;
			} else {
				throw new Error(
					`Unexpected status ${error.response.status} for fetching ids`
				);
			}
		}
		throw error;
	}
};
