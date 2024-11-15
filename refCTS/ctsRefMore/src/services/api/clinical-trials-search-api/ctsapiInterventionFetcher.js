/**
 * Fetch a list of interventions from the API matching the intervention ids
 *  @param {Object} client - clinicalTrialsSearchClientV2
 *  @param {String} query - a url query to build a request
 */

import querystring from 'query-string';

export const ctsapiInterventionFetcher = async (client, query) => {
	try {
		const res = await client.get(
			`/interventions?${querystring.stringify(query)}`
		);
		if (res.status === 200) {
			return res.data.data.map((intervention) => ({
				name: intervention.name,
				codes: intervention.codes,
				synonyms: intervention.synonyms,
				category: intervention.category,
				type: intervention.type,
			}));
		} else {
			// This condition will be hit for anything < 300.
			throw new Error(
				`Unexpected status ${res.status} for fetching interventions code(s)`
			);
		}
	} catch (error) {
		// This conditional will be hit for any status >= 300.
		if (error.response) {
			throw new Error(
				`Unexpected status ${error.response.status} for fetching interventions code(s)`
			);
		}
		throw error;
	}
};
