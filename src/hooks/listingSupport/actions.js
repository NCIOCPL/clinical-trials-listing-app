// Action type declarations
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
		error,
	};
};
