import axios from 'axios';

export const createApiClient = (baseURL, config = {}) => {
	return axios.create({
		baseURL,
		headers: {
			'Content-Type': 'application/json',
		},
		timeout: 15000,
		...config,
	});
};
