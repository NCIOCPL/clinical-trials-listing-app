import axios from 'axios';

// export const apiClient = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

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
