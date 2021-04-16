import { FETCH_SUCCESS, FETCH_ERROR } from './actions';

// Reducer
const reducer = (state = {}, action) => {
	switch (action.type) {
		case FETCH_SUCCESS:
			return {
				...state,
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
		default:
			return state;
	}
};

export default reducer;
