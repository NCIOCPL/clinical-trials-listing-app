import React from 'react';

import { useCustomQuery } from '../customFetch';
import { getClinicalTrials } from '../../services/api/actions';

const UseCustomQuerySample = () => {
	const { loading, payload } = useCustomQuery(
		getClinicalTrials({ requestFilters: { "diseases.nci_thesaurus_concept_id": [ "test" ] } })
	);
	return <>{!loading && payload && <h1>{payload.contentMessage}</h1>}</>;
};

export default UseCustomQuerySample;
