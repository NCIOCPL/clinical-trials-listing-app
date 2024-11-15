import { receiveData } from '../store/actions';
import {
	getCountries,
	getDiseasesForTypeAhead,
	getFindings,
	getHospitals,
	getLeadOrg,
	getMainType,
	getOtherInterventions,
	getStages,
	getSubtypes,
	searchDrug,
	searchTrialInvestigators,
} from '../services/api/clinical-trials-search-api';

/**
 * This middleware serves two purposes (and could perhaps be broken into two pieces).
 * 1. To set up API requests with all the appropriate settings
 * 2. To handle the attendant responses and failures. Successful requests will need to be cached and then
 * sent to the store. Failures will need to be taken round back and shot.
 * @param {Object} services
 */
const createCTSMiddlewareV2 =
	(client) =>
	({ dispatch }) =>
	(next) =>
	async (action) => {
		next(action);

		if (action.type !== '@@api/CTSv2') {
			return;
		}

		const getAllRequests = async (fetchAction) => {
			const requests = () => {
				const { method, requestParams } = fetchAction.payload;

				// Switch block for api calls with default case
				switch (method) {
					case 'getCountries': {
						return getCountries(client, requestParams);
					}
					case 'getDiseases': {
						return getDiseasesForTypeAhead(client, requestParams);
					}
					case 'getFindings': {
						return getFindings(client, requestParams);
					}
					case 'getHospital': {
						return getHospitals(client, requestParams);
					}
					case 'getOtherInterventions': {
						return getOtherInterventions(client, requestParams);
					}
					case 'getLeadOrg': {
						return getLeadOrg(client, requestParams);
					}
					case 'getMainType': {
						return getMainType(client, requestParams);
					}
					case 'getSubtypes': {
						return getSubtypes(client, requestParams);
					}
					case 'getStages': {
						return getStages(client, requestParams);
					}
					case 'searchDrug': {
						return searchDrug(client, requestParams);
					}
					case 'searchTrialInvestigators': {
						return searchTrialInvestigators(client, requestParams);
					}
					default: {
						throw new Error(`Unknown CTS API request`);
					}
				}
			};
			const responses = await requests();
			return responses;
		};

		if (client !== null && action.payload) {
			try {
				const results = await getAllRequests(action);
				dispatch(receiveData(action.payload.cacheKey, results));
			} catch (err) {
				console.log(err);
			}
		}
	};

export default createCTSMiddlewareV2;
