import axios from 'axios';
import Qs from 'qs';

/**
 * Gets an instance of a Clinical Trial Listing Support API client
 *
 * @param {string} apiBase the base url of the API
 */
const trialListingClientFactory = (apiBase) => {
	return axios.create({
		baseURL: apiBase,
		timeout: 15000,
		paramsSerializer: (params) =>
			Qs.stringify(params, { arrayFormat: 'repeat' }),
	});
};

export default trialListingClientFactory;
