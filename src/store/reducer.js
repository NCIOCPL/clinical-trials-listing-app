import { LOAD_GLOBAL, LOAD_GLOBALS } from './actions';

// Reducer
const reducer = (state = {}, action) => {
	switch (action.type) {
		case LOAD_GLOBAL:
			return {
				...state,
				[action.payload.field]: action.payload.value,
			};

		case LOAD_GLOBALS:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};

export default reducer;
