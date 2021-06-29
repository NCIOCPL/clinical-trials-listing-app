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

export const setRedirecting = () => {
	return {
		type: REDIRECT_NEEDED,
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
	if (action.type === SUCCESSFUL_FETCH) {
		// If the status has changed, then the data must have changed
		// so return a new object
		if (state.status !== hocStates.LOADED_STATE) {
			return {
				status: hocStates.LOADED_STATE,
				listingData: action.payload.fetchResponse,
				actionsHash: action.payload.fetchActionsHash,
			};
		} else {
			// Status is the same, did the payload change, or are we trying to update
			// the same object?
			const newResponseHash = convertObjectToBase64(
				action.payload.fetchResponse
			);
			const oldResponseHash = convertObjectToBase64(state.listingData);
			if (
				newResponseHash === oldResponseHash &&
				action.payload.fetchActionsHash === state.actionsHash
			) {
				// Same status, same object, same state
				return state;
			} else {
				return {
					status: hocStates.LOADED_STATE,
					listingData: action.payload.fetchResponse,
					actionsHash: action.payload.fetchActionsHash,
				};
			}
		}
	} else {
		switch (action.type) {
			case RESET_LOADING:
			case ENCOUNTERED_NOTFOUND:
			case ERROR_OCCURRED:
			case REDIRECT_NEEDED: {
				const status = getNonLoadedStatusByAction(action.type);
				if (
					state.status === status &&
					state.listingData === null &&
					state.actionsHash === ''
				) {
					return state;
				} else {
					return {
						status,
						listingData: null,
						actionsHash: '',
					};
				}
			}
			default:
				return state;
		}
	}
};
