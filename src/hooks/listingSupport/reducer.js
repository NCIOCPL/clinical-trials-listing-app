import {
	FETCH_SUCCESS,
	FETCH_ERROR,
	SET_LOADING,
	RESET_LOADING,
} from './actions';

// Reducer
const reducer = (state = {}, action) => {
	switch (action.type) {
		case FETCH_SUCCESS:
			return {
				loading: false,
				payload: action.payload,
				error: null,
			};

		case FETCH_ERROR:
			return {
				loading: false,
				payload: null,
				error: action.payload,
			};
		case SET_LOADING:
			return {
				...state,
				loading: true,
			};
		case RESET_LOADING:
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
};

export default reducer;
