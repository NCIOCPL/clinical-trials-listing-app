import { getEndpoint } from '../endpoints';

export const getSampleCallResults = ({ id }) => {
	const endpoint = getEndpoint('sampleCall');
	return {
		method: 'GET',
		endpoint: `${endpoint}/${id}`,
	};
};
