// CTX Action type declarations
export const CTX_LOAD_GLOBAL = 'CTX_LOAD_GLOBAL';
export const CTX_LOAD_GLOBALS = 'CTX_LOAD_GLOBALS';

// CTX Actions
export const updateCTXGlobalValue = (payload) => {
	return {
		type: CTX_LOAD_GLOBAL,
		payload,
	};
};

export const updateCTXGlobalsValue = (payload) => {
	return {
		type: CTX_LOAD_GLOBALS,
		payload,
	};
};
