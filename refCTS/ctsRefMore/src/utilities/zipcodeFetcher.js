import axios from 'axios';

export const zipcodeFetcher = async (baseUrl, zipcode) => {
	// TODO: Add check for trailing slash...
	const url = `${baseUrl}/${zipcode}`;

	try {
		const response = await axios.get(url);
		// if we don't get back a message, good to go
		if (
			response &&
			response.data &&
			response.status === 200 &&
			!response.data.message
		) {
			return response.data;
		}
		//disabling lint here as we do not care if there was an error or it was empty
		//so I dont see any need for action inside catch
		/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
	} catch (error) {}
	// If there was an error, or it was not found, it is all
	// the same to us -- no zipcode.
	return null;
};
