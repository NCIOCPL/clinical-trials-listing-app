import { convertObjectToBase64 } from '../../utilities/objects';
import * as actions from './resultsPageActions';

// Action type declarations
// Let's use some constants for our state var so we can handle
// loading, loaded, 404 and error, without resorting to a reducer.
export const pageStates = Object.freeze({
	LOADING_STATE: 'loading_state',
	LOADED_STATE: 'loaded_state',
	NOTFOUND_STATE: 'notfound_state',
	ERROR_STATE: 'error_state',
	REDIR_STATE: 'redir_state',
});

const initialState = {
	selectAll: false,
	pageIsLoading: true,
	isLoading: true,
	isPageLoadReady: false,
	pageErrors: [],
	searchCriteriaObject: null,
	trialResults: null,
	actionsHash: '',
	fetchActions: [],
	error: [],
	currentPage: 1,
};

const handleSuccessfulFetch = (state, action) => {
	const newResponseHash = convertObjectToBase64(action.payload.fetchResponse);
	const oldResponseHash = convertObjectToBase64(state.trialResults);

	if (
		newResponseHash === oldResponseHash &&
		action.payload.fetchActionsHash === state.actionsHash
	) {
		return state;
	}

	return {
		...state,
		selectAll: false,
		pageIsLoading: false,
		isLoading: false,
		isPageLoadReady: true,
		trialResults: action.payload.fetchResponse,
		actionsHash: action.payload.fetchActionsHash,
	};
};

const handleSetProp = (state, action) => ({
	...state,
	[action.prop]: action.payload,
});

const handleStopLoading = (state) => ({
	...state,
	isLoadingPage: false,
	isLoading: false,
});

const handleStatusChange = (state, status) => ({
	...state,
	status,
	listingData: null,
	actionsHash: '',
});

export default function resultsPageReducer(state = initialState, action) {
	switch (action.type) {
		case actions.SUCCESSFUL_FETCH:
			return handleSuccessfulFetch(state, action);
		case actions.SET_PROP:
			return handleSetProp(state, action);
		case actions.STOP_LOADING:
			return handleStopLoading(state);
		case actions.RESET_LOADING:
			return handleStatusChange(state, pageStates.LOADING_STATE);
		case actions.ERROR_OCCURRED:
			return handleStatusChange(state, pageStates.ERROR_STATE);
		case actions.REDIRECT_NEEDED:
			return handleStatusChange(state, pageStates.REDIR_STATE);
		default:
			return state;
	}
}
