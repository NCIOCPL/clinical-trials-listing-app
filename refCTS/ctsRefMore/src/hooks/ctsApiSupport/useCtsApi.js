import { useEffect, useReducer, useRef, useCallback } from 'react';

import {
	setSuccessfulFetch,
	setFailedFetch,
	setLoading,
	setAborted,
} from './actions';
import reducer from './reducer';
import {
	getClinicalTrialDescription,
	getClinicalTrials,
	ctsapiDiseaseFetcher,
	ctsapiInterventionFetcher,
} from '../../services/api/clinical-trials-search-api';
import { convertObjectToBase64 } from '../../utilities/objects';
import { useAppSettings } from '../../store/store';

/**
 * An action representing a CTS API request.
 * @typedef {Object} CtsApiRequestAction
 * @property {string} type - The type of request (fetchTrials).
 * @property {Object} payload - the CTS API query object.
 */

/**
 * The hook response for the CTS API. Each property of the object is a state value.
 * @typedef {Object} CtsApiResponse
 * @property {bool} loading - is the request currently loading.
 * @property {Array<object>} payload the responses from the api.
 * @property {Error} error The first error to have been returned.
 */

/**
 * Internal async method to handle the fetches so it is easier to read.
 * @param {import('axios').AxiosInstance} clinicalTrialsSearchClient the axios client
 * @param {Array<ListingSupportRequestAction>} actions a collection of request items.
 */
const internalFetch = async (clinicalTrialsSearchClientV2, actions) => {
	// TODO: Pass in an abort token to internalFetch
	// We want this function to return a single object we can use
	try {
		const requests = actions.map((req) => {
			switch (req.type) {
				case 'getClinicalTrials': {
					return getClinicalTrials(clinicalTrialsSearchClientV2, req.payload);
				}
				case 'trialDescription': {
					return getClinicalTrialDescription(
						clinicalTrialsSearchClientV2,
						req.payload
					);
				}
				case 'ctsApiDiseaseFetcher': {
					return ctsapiDiseaseFetcher(
						clinicalTrialsSearchClientV2,
						req.payload
					);
				}
				case 'ctsApiInterventionFetcher': {
					return ctsapiInterventionFetcher(
						clinicalTrialsSearchClientV2,
						req.payload
					);
				}
				default: {
					throw new Error(`Unknown CTS API request`);
				}
			}
		});
		const responses = await Promise.all(requests);
		return responses;
	} catch (error) {
		return {
			errorObject: error,
		};
	}
};

/**
 * Given a fetch trial action this will fetch results from the CTS API.
 *
 * This was borrowed heavily from React Fetching Library's useQuery hook. We did not implement
 * any of the abort controlling as it would not work with Axios. See
 * https://github.com/marcin-piela/react-fetching-library/blob/1.7.6/src/hooks/useQuery/useQuery.ts
 *
 * @param {Array<CtsApiRequestAction>} fetchActions a fetchTrials action, this is basically the CTS API request.
 * @returns {CtsApiResponse} the stateful data
 */
export const useCtsApi = (fetchActions) => {
	const [
		{
			apiClients: { clinicalTrialsSearchClientV2 },
		},
	] = useAppSettings();

	// Indicates if the component this was called from is
	// still mounted or not. Important to avoid
	// "Can only update a mounted..." errors.
	const isMounted = useRef(true);

	const [state, dispatch] = useReducer(reducer, {
		loading: true,
		payload: null,
		error: null,
		aborted: false,
	});

	const fetchActionsHash = convertObjectToBase64(fetchActions);

	// This call back handles the fetch to the api. We use is call back
	// so the query does not execute except when any of the actions have
	// changed. Otherwise this gets called pretty much an infinite amount
	// of times.
	const handleQuery = useCallback(async () => {
		//TODO: Abort any pending requests.

		// If we are handling the query, but the component that called this
		// affect is no longer being referenced, then we need to leave quickly.
		if (!isMounted.current) {
			return { error: false };
		}

		// Reset our state to the loading state.
		dispatch(setLoading());

		// Make the request, the response object will either be the payload
		// or it will be an error object. This allows us to have one object
		// that we return for the useCallback to "cache".
		const response = await internalFetch(
			clinicalTrialsSearchClientV2,
			fetchActions
		);

		if (
			isMounted.current &&
			!(response.errorObject && response.errorObject.name === 'AbortError')
		) {
			if (response.errorObject) {
				dispatch(setFailedFetch(response.errorObject));
			} else {
				dispatch(setSuccessfulFetch(response));
			}
		}

		// NOTE: The original react fetching code handle a condition here in which the
		// calling component was still mounted and the request was aborted. In this
		// case it reset the reducer state to the default state, which is not loading
		// and queryResponse is an object with a false error.
		//
		// We will just return a state with aborted, which really should not be called
		// unless our component unmounted AND a fetch was in progress, in which case
		// we really don't care about the response. So we can set an aborted flag in
		// case we will.
		if (
			isMounted.current &&
			response.errorObject &&
			response.errorObject.name === 'AbortError'
		) {
			dispatch(setAborted());
		}

		// We should return the response here for useCallback to cache
		return response;
	}, [fetchActionsHash]);

	// This callback is for aborting the requests.
	const handleAbort = useCallback(() => {
		// TODO: We should cancel the Axios request here.
	}, []);

	// We only want to fire this the first time useCtsApi
	// is called.
	useEffect(() => {
		isMounted.current = true;

		// Fire off the query.
		handleQuery();

		// This is a function to be called when the component is
		// unmounted.
		return () => {
			isMounted.current = false;
			handleAbort();
		};
	}, [handleQuery]);

	return state;
};
