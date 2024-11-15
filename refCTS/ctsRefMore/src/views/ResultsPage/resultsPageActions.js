/**
 * Contains action creators and action types for managing the state
 * of ResultsPage. It includes actions for handling API fetches, updating search criteria, managing loading
 * states, and other UI-related actions specific to the results page.
 *
 * Used in conjunction with the resultsPageReducer to maintain
 * and update the component's state.
 */

export const SET_PROP = 'SET_PROP';
export const SUCCESSFUL_FETCH = 'SUCCESSFUL_FETCH';
export const ERROR_OCCURRED = 'ERROR_OCCURRED';
export const RESET_LOADING = 'RESET_LOADING';
export const REDIRECT_NEEDED = 'REDIRECT_NEEDED';
export const STOP_LOADING = 'STOP_LOADING';

export const setProp = (prop, payload) => ({
	type: SET_PROP,
	prop,
	payload,
});

export const setSuccessfulFetch = (fetchActionsHash, fetchResponse) => ({
	type: SUCCESSFUL_FETCH,
	payload: { fetchActionsHash, fetchResponse },
});

export const setFailedFetch = (error) => ({
	type: ERROR_OCCURRED,
	payload: { error },
});

export const setLoading = () => ({
	type: RESET_LOADING,
});

export const setRedirectNeeded = () => ({
	type: REDIRECT_NEEDED,
});

export const stopLoading = () => ({
	type: STOP_LOADING,
});

export const setFetchActions = (fetchAction) =>
	setProp('fetchActions', [fetchAction]);
export const setSearchCriteriaObject = (searchCriteria) =>
	setProp('searchCriteriaObject', searchCriteria);
export const setSelectAll = (value) => setProp('selectAll', value);
