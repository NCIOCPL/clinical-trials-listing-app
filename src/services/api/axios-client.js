import axios from 'axios';
import { createClient } from 'react-fetching-library';

import { buildAxiosRequest } from './buildAxiosRequest';
import { setAPIEndpoint, setLanguage } from './endpoints';

const axiosInstance = axios.create({
	timeout: 15000,
});

export const getAxiosClient = (initialize) => {
	const { apiEndpoint, language } = initialize;

	setAPIEndpoint(apiEndpoint);
	setLanguage(language);

	return createClient({
		fetch: buildAxiosRequest(axiosInstance),
	});
};
