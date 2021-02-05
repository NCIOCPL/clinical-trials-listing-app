// Action type declarations
export const LOAD_GLOBAL = 'LOAD_GLOBAL';
export const LOAD_GLOBALS = 'LOAD_GLOBALS';

// Actions
export const updateGlobalValue = (payload) => {
	return {
		type: LOAD_GLOBAL,
		payload,
	};
};
