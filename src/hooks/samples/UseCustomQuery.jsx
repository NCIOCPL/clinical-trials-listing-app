import React from 'react';

import { useCustomQuery } from '../customFetch';
import { setAPIEndpoint } from '../../services/api/endpoints';

const UseCustomQuerySample = (id) => {
	const apiBaseEndpoint = 'http://localhost:3000/api';
	setAPIEndpoint(`${apiBaseEndpoint}/sampleapi/v1/sampleendpoint`);
	const { loading, payload } = useCustomQuery(getSampleCallResults());
	return <>{!loading && payload && <h1>{payload.contentMessage}</h1>}</>;
};

const getSampleCallResults = () => {
	return {
		method: 'GET',
		endpoint: `/sampleendpoint`,
	};
};

export default UseCustomQuerySample;
