import { FETCH_SUCCESS, FETCH_ERROR, SET_LOADING, SET_ABORTED } from './actions';

// Reducer
const reducer = (state = {}, action) => {
	switch (action.type) {
		case FETCH_SUCCESS:
			return {
				loading: false,
				payload: action.payload.fetchResponse,
				error: null,
				aborted: false,
			};
		case FETCH_ERROR:
			return {
				loading: false,
				payload: null,
				error: action.payload,
				aborted: false,
			};
		case SET_LOADING:
			if (state.loading === true && state.payload === null && state.error === null && state.aborted === false) {
				return state;
			} else {
				return {
					loading: true,
					payload: null,
					error: null,
					aborted: false,
				};
			}
		case SET_ABORTED:
			return {
				loading: false,
				payload: null,
				error: null,
				aborted: true,
			};
		default:
			return state;
	}
};

export default reducer;
