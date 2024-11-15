import { zipcodeFetcher } from './index';
import {
	getCtsApiDiseaseFetcherAction,
	getCtsApiInterventionFetcherAction,
} from '../services/api/actions';
import {
	ctsapiDiseaseFetcher,
	ctsapiInterventionFetcher,
} from '../services/api/clinical-trials-search-api';

export const runQueryFetchers = async (
	clinicalTrialsSearchClientV2,
	zipcodeEndpoint
) => {
	const diseaseFetcher = async (ids) => {
		const { payload } = getCtsApiDiseaseFetcherAction(ids);
		return await ctsapiDiseaseFetcher(clinicalTrialsSearchClientV2, payload);
	};
	const interventionFetcher = async (ids) => {
		const { payload } = getCtsApiInterventionFetcherAction(ids);
		return await ctsapiInterventionFetcher(
			clinicalTrialsSearchClientV2,
			payload
		);
	};
	const zipFetcher = async (zipcode) =>
		await zipcodeFetcher(zipcodeEndpoint, zipcode);

	return { diseaseFetcher, interventionFetcher, zipFetcher };
};
