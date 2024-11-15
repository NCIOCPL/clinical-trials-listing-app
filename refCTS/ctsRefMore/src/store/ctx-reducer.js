import { CTX_LOAD_GLOBAL, CTX_LOAD_GLOBALS } from './ctx-actions';

// Reducer
const ctx_reducer = (state = {}, action) => {
	switch (action.type) {
		case CTX_LOAD_GLOBAL:
			return {
				...state,
				[action.payload.field]: action.payload.value,
			};

		case CTX_LOAD_GLOBALS:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};

export default ctx_reducer;
