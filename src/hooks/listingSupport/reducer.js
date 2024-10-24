import { FETCH_SUCCESS, FETCH_ERROR, SET_LOADING, SET_ABORTED } from './actions';

// Reducer
const reducer = (state = { _cache: {} }, action) => {
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
			return {
				loading: true,
				payload: null,
				error: null,
				aborted: false,
			};
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
