import axios from 'axios';

export const buildAxiosRequest = (axiosInstance) => async (init, options) => {
	const cancelSource = axios.CancelToken.source();
	const config = {
		url: init,
		method: options && options.method ? options.method : 'GET',
		data: options && options.body ? options.body : undefined,
		headers:
			options && options.headers
				? Object.keys(options.headers).reduce((destination, key) => {
						destination[key.toLowerCase()] = options.headers[key];
						return destination;
				  }, {})
				: undefined,
		validateStatus: () => true,
		cancelToken: cancelSource.token,
	};

	if (options && options.signal) {
		options.signal.onabort = () => {
			cancelSource.cancel('Operation canceled from hook');
		};
	}

	const result = await axiosInstance.request(config);
	const responseBody =
		typeof result.data === `object`
			? JSON.stringify(result.data)
			: result.data.toString();
	const headers = new Headers();

	Object.entries(result.headers).forEach(function ([key, value]) {
		headers.append(key, `${value}`);
	});

	return new Response(responseBody, {
		status: result.status,
		statusText: result.statusText,
		headers,
	});
};
