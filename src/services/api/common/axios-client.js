import axios from 'axios';
import { createClient } from 'react-fetching-library';

import { buildAxiosRequest } from './buildAxiosRequest';

const axiosInstance = axios.create({
	timeout: 15000,
});

/**
 * Gets an instance of an Axios client prepped for RFL
 *
 * You will want to create requestInterceptors that transform the endpoint
 * parameter for the fetch action. Use these interceptors to add in application
 * specific variables, such as hostname, that are not available to you in the
 * actions themselves.
 *
 * @param {Array<requestInterceptor>} requestInterceptors a collection of request interceptors
 */
export const getAxiosClient = (requestInterceptors) => {
	return createClient({
		requestInterceptors,
		fetch: buildAxiosRequest(axiosInstance),
	});
};
