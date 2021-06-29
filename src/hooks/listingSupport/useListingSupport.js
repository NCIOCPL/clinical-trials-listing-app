import { useEffect, useReducer, useRef, useCallback, useContext } from 'react';

import {
	setSuccessfulFetch,
	setFailedFetch,
	setLoading,
	setAborted,
} from './actions';
import reducer from './reducer';
import { updateCache } from './updateCache';
import {
	getListingInformationById,
	getListingInformationByName,
	getTrialType,
} from '../../services/api/trial-listing-support-api';
import { convertObjectToBase64 } from '../../utils/objects';
import { useStateValue } from '../../store/store';
import { ListingSupportContext } from './listingSupportContext';

/**
 * An action representing a listing support API request.
 * @typedef {Object} ListingSupportRequestAction
 * @property {string} type - The type of request (name|id).
 * @property {string|Array<string>} payload - the request parameters. This is a string for name, and a array of c-codes for Ids.
 */

/**
 * The hook response for the listing support API. Each property of the object is a state value.
 * @typedef {Object} ListingSupportResponse
 * @property {bool} loading - is the request currently loading.
 * @property {Array<object>} payload the responses from the api in the order of the original action array.
 * @property {Error} error The first error to have been returned.
 */

/**
 * Internal async method to handle the fetches so it is easier to read.
 * @param {import('axios').AxiosInstance} trialListingSupportClient the axios client
 * @param {Array<ListingSupportRequestAction>} actions a collection of request items.
 */
const internalFetch = async (trialListingSupportClient, actions, cache) => {
	// TODO: Pass in an abort token to internalFetch
	// We want this function to return a single object we can use
	try {
		const requests = actions.map((req) => {
			switch (req.type) {
				case 'id': {
					//check Cache
					for (const id of req.payload) {
						if (cache.get(id)) {
							return cache.get(id);
						}
					}
					// TODO: Add an abort token to getListingInformationById
					return getListingInformationById(
						trialListingSupportClient,
						req.payload
					);
				}
				case 'name': {
					//check Cache
					if (cache.get(req.payload)) {
						return cache.get(req.payload);
					} else {
						// TODO: Add an abort token to getListingInformationByName
						return getListingInformationByName(
							trialListingSupportClient,
							req.payload
						);
					}
				}
				case 'trialType': {
					//check Cache
					if (cache.get(req.payload)) {
						return cache.get(req.payload);
					} else {
						// the cache key should just be req.payload
						return getTrialType(trialListingSupportClient, req.payload);
					}
				}
				default: {
					throw new Error(`Unknown trial listing support request`);
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
 * Given a collection of requests for the listing support service, this will fetch them all.
 *
 * This was borrowed heavily from React Fetching Library's useQuery hook. We did not implement
 * any of the abort controlling as it would not work with Axios. See
 * https://github.com/marcin-piela/react-fetching-library/blob/1.7.6/src/hooks/useQuery/useQuery.ts
 *
 * @param {Array<ListingSupportRequestAction>} actions a collection of request items.
 * @returns {ListingSupportResponse} the stateful data
 */
export const useListingSupport = (actions) => {
	const [
		{
			apiClients: { trialListingSupportClient },
		},
	] = useStateValue();

	// Get the cache for fetched terms
	const { cache } = useContext(ListingSupportContext);

	// Indicates if the component this was called from is
	// still mounted or not. Important to avoid
	// "Can only update a mounted..." errors.
	const isMounted = useRef(true);

	const [state, dispatch] = useReducer(reducer, {
		loading: true,
		payload: null,
		error: null,
		aborted: false,
		_cache: {},
	});

	const actionsHash = convertObjectToBase64(actions);

	// We onlu want to fire this the first time useListingSupport
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
	}, [actionsHash]);

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
		// TODO: Pass in a cancellation token for this request to handle aborts
		const response = await internalFetch(
			trialListingSupportClient,
			actions,
			cache
		);

		// So if we did not abort, then we should dispatch an update for the state.
		if (
			isMounted.current &&
			!(response.errorObject && response.errorObject.name === 'AbortError')
		) {
			if (response.errorObject) {
				dispatch(setFailedFetch(response.errorObject));
			} else {
				updateCache(cache, actions, response);
				dispatch(setSuccessfulFetch(actions, response));
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
	}, [actions]);

	// This callback is for aborting the requests.
	const handleAbort = useCallback(() => {
		// TODO: We should cancel the Axios request here.
	}, []);

	return state;
};
