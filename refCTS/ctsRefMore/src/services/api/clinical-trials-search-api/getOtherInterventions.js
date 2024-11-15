import querystring from 'query-string';

/**
 * Fetches treatments to populate the Other Treatments field
 *
 * @param {import("axios").AxiosInstance} client An axios instance with the correct baseURL
 * @param {object} query the cts query
 */
export const getOtherInterventions = async (client, query) => {
	try {
		const res = await client.get(
			`/interventions?${querystring.stringify(query)}`
		);
		if (res.status === 200) {
			const filteredResults = Array.isArray(res.data?.data)
				? res.data.data.map((intervention) => {
						return {
							...intervention,
							synonyms: intervention.synonyms.filter(
								(s) => s !== intervention.name
							),
						};
				  })
				: res.data?.data;
			return { data: filteredResults };
		} else {
			// This condition will be hit for anything < 300.
			throw new Error(
				`Unexpected status ${res.status} for fetching other treatments`
			);
		}
	} catch (error) {
		// This conditional will be hit for any status >= 300.
		if (error.response) {
			throw new Error(
				`Unexpected status ${error.response.status} for fetching other treatments`
			);
		}
		throw error;
	}
};
