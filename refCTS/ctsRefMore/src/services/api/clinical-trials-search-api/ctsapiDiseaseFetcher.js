/**
 * Fetch a list of diseases from the API matching the disease ids
 * @param {Axios} client - Axios service instance (clinicalTrialsSearchClientV2)
 * @param {String} query - an url query to make up the request
 */

import querystring from 'query-string';

export const ctsapiDiseaseFetcher = async (client, query) => {
	try {
		const res = await client.get(`/diseases?${querystring.stringify(query)}`);
		if (res.status === 200) {
			return res.data.data.map((disease) => ({
				name: disease.name,
				codes: disease.codes,
				parentDiseaseID: disease.parent_ids,
				type: disease.type,
			}));
		} else {
			// This condition will be hit for anything < 300.
			throw new Error(
				`Unexpected status ${res.status} for fetching disease code(s)`
			);
		}
	} catch (error) {
		// This conditional will be hit for any status >= 300.
		if (error.response) {
			throw new Error(
				`Unexpected status ${error.response.status} for fetching disease code(s)`
			);
		}
		throw error;
	}
};
