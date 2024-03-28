import axios from 'axios';

/**
 * Gets an instance of a Clinical Trial Search API client
 *
 * @param {string} apiBase the base url of the API
 */
const clinicalTrialsSearchClientFactory = (apiBase) => {
	return axios.create({
		baseURL: apiBase,
		timeout: 15000,
		adapter: 'http',
	});
};

export default clinicalTrialsSearchClientFactory;
