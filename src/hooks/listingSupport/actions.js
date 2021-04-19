// Action type declarations
export const SET_LOADING = 'SET_LOADING';
export const RESET_LOADING = 'RESET_LOADING';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_ERROR = 'FETCH_ERROR';

// Actions
export const setSuccessfulFetch = (payload) => {
	return {
		type: FETCH_SUCCESS,
		payload,
	};
};

export const setFailedFetch = (error) => {
	return {
		type: FETCH_ERROR,
		payload: error,
	};
};

export const setLoading = () => {
	return {
		type: SET_LOADING,
	};
};

export const resetLoading = () => {
	return {
		type: RESET_LOADING,
	};
};