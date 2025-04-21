import { convertObjectToBase64 } from '../utils/objects';

// Action type declarations
// Let's use some constants for our state var so we can handle
// loading, loaded, 404 and error, without resorting to a reducer.
export const hocStates = Object.freeze({
	LOADING_STATE: 'loading_state',
	LOADED_STATE: 'loaded_state',
	NOTFOUND_STATE: 'notfound_state',
	ERROR_STATE: 'error_state',
	REDIR_STATE: 'redir_state',
});

// Action Names
const SUCCESSFUL_FETCH = 'successful_fetch';
const ERROR_OCCURRED = 'error_occurred';
const RESET_LOADING = 'reset_loading';
const REDIRECT_NEEDED = 'redirect_needed';
const ENCOUNTERED_NOTFOUND = 'encountered_notfound';

// Actions
export const setLoading = () => {
	return {
		type: RESET_LOADING,
	};
};

/**
 * Updates the state to reflect a successful fetch from the API.
 * @param {string} fetchActionsHash a hash of the actions array representing the API calls
 * @param {Array<object>} fetchResponse the objects returned by the API for those calls
 */
export const setSuccessfulFetch = (fetchActionsHash, fetchResponse) => {
	return {
		type: SUCCESSFUL_FETCH,
		payload: {
			fetchActionsHash,
			fetchResponse,
		},
	};
};

export const setRedirecting = (redirectStatus) => {
	return {
		type: REDIRECT_NEEDED,
		payload: {
			redirectStatus,
		},
	};
};

export const setFailedFetch = () => {
	return {
		type: ERROR_OCCURRED,
	};
};

export const setNotFound = () => {
	return {
		type: ENCOUNTERED_NOTFOUND,
	};
};

const getNonLoadedStatusByAction = (type) => {
	switch (type) {
		case RESET_LOADING:
			return hocStates.LOADING_STATE;
		case ENCOUNTERED_NOTFOUND:
			return hocStates.NOTFOUND_STATE;
		case ERROR_OCCURRED:
			return hocStates.ERROR_STATE;
		case REDIRECT_NEEDED:
			return hocStates.REDIR_STATE;
	}
};

// Reducer
export const hocReducer = (state = {}, action) => {
	// console.log('[hocReducer] Incoming State:', JSON.stringify(state, null, 2));
	// console.log('[hocReducer] Action:', JSON.stringify(action, null, 2));
	let nextState; // Define nextState variable

	switch (action.type) {
		case SUCCESSFUL_FETCH: {
			// If the status has changed, then the data must have changed
			// so return a new object
			if (state.status !== hocStates.LOADED_STATE) {
				nextState = {
					status: hocStates.LOADED_STATE,
					listingData: action.payload.fetchResponse,
					actionsHash: action.payload.fetchActionsHash,
					redirectStatus: null, // Reset immediate status
					// Persist the status from the last HoC redirect
					lastHoCRedirectStatus: state.lastHoCRedirectStatus,
				};
			} else {
				// Status is the same, did the payload change, or are we trying to update
				// the same object?
				const newResponseHash = convertObjectToBase64(action.payload.fetchResponse);
				const oldResponseHash = convertObjectToBase64(state.listingData);
				if (newResponseHash === oldResponseHash && action.payload.fetchActionsHash === state.actionsHash) {
					// Same status, same object, same state
					nextState = state; // Assign to nextState
				} else {
					nextState = {
						status: hocStates.LOADED_STATE,
						listingData: action.payload.fetchResponse,
						actionsHash: action.payload.fetchActionsHash,
						redirectStatus: null, // Reset immediate status
						// Persist the status from the last HoC redirect
						lastHoCRedirectStatus: state.lastHoCRedirectStatus,
					};
				}
			}
			break; // Add break for SUCCESSFUL_FETCH case
		}
		case RESET_LOADING:
		case ENCOUNTERED_NOTFOUND:
		case ERROR_OCCURRED:
		case REDIRECT_NEEDED: {
			const status = getNonLoadedStatusByAction(action.type);
			if (state.status === status && state.listingData === null && state.actionsHash === '') {
				nextState = state; // Assign to nextState
			} else {
				nextState = {
					status: action.type === REDIRECT_NEEDED ? hocStates.REDIR_STATE : status,
					listingData: null,
					actionsHash: '',
					redirectStatus: action.type === REDIRECT_NEEDED ? action.payload.redirectStatus : null,
					// Persist lastHoCRedirectStatus unless it's a new redirect action
					lastHoCRedirectStatus: action.type === REDIRECT_NEEDED ? action.payload.redirectStatus : state.lastHoCRedirectStatus,
				};
			}
			break; // Add break to prevent fall-through
		}
		default:
			nextState = state; // Assign default
	}
	// console.log('[hocReducer] Outgoing nextState:', JSON.stringify(nextState, null, 2));
	return nextState; // Return the final state
};
