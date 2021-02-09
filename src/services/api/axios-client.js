import axios from 'axios';
import { createClient } from 'react-fetching-library';

import { buildAxiosRequest } from './buildAxiosRequest';
import { setAPIEndpoint } from './endpoints';
import { requestHostInterceptor } from './requestInterceptors/requestHostInterceptor';

const axiosInstance = axios.create({
	timeout: 15000,
});

export const getAxiosClient = (initialize) => {
	const { apiEndpoint } = initialize;

	setAPIEndpoint(apiEndpoint);

	const HOST =
		apiEndpoint && apiEndpoint.length > 1
			? apiEndpoint.replace(/\/$/, '')
			: '/api';

	return createClient({
		requestInterceptors: [requestHostInterceptor(HOST)],
		fetch: buildAxiosRequest(axiosInstance),
	});
};
