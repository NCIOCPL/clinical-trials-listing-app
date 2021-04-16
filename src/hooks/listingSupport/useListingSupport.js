import { useReducer } from 'react';
import { useStateValue } from '../../store/store';
import {
	getListingInformationById,
	getListingInformationByName,
} from '../../services/api/trial-listing-support-api';
import reducer from './reducer';
import { setSuccessfulFetch, setFailedFetch } from './actions';

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
const internalFetch = async (trialListingSupportClient, actions) => {
	const requests = actions.map((req) => {
		console.log(req);
		switch (req.type) {
			case 'id': {
				return getListingInformationById(
					trialListingSupportClient,
					req.payload
				);
			}
			case 'name': {
				return getListingInformationByName(
					trialListingSupportClient,
					req.payload
				);
			}
			default: {
				throw new Error(`Unknown trial listing support request`);
			}
		}
	});

	const responses = await Promise.all(requests);
	return responses;
};

/**
 * Given a collection of requests for the listing support service, this will fetch them all.
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
	const [state, dispatch] = useReducer(reducer, {
		loading: true,
		payload: null,
		error: null,
	});

	internalFetch(trialListingSupportClient, actions)
		.then((payload) => {
			dispatch(setSuccessfulFetch(payload));
		})
		.catch((error) => {
			dispatch(setFailedFetch(error));
		});

	return state;
};
