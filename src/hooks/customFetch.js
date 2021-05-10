import { useEffect, useState } from 'react';
import { useQuery } from 'react-fetching-library';

export const useCustomQuery = (action, shouldFetch = true) => {
	const [error, setError] = useState(null);
	const response = useQuery(action, shouldFetch);

	useEffect(() => {
		if (response.error) {
			const responseError = response.errorObject
				? response.errorObject
				: response.status
				? `${action.endpoint} returned a ${response.status}`
				: `Unknown error occurred for ${action.endpoint}`;
			setError(responseError);
		}
	}, [action, response.error, response.errorObject, response.status]);

	if (error) {
		throw error;
	}

	return response;
};
