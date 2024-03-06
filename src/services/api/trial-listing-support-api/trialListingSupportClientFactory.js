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
		adapter: 'http',
		paramsSerializer: (params) =>
			// The listing api requires multiple parameters with the same name
			// to be in the format '?foo=1&foo=2&foo=3'. The default serializer
			// for Axios uses '?foo[]=1&foo[]=2&foo[]=3'.
			Qs.stringify(params, { arrayFormat: 'repeat' }),
	});
};

export default trialListingClientFactory;
