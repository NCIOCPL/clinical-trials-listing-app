import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

export const StateContext = createContext();
export const StateProvider = ({ reducer, initialState, children }) => {
	const [state, updateAppSettings] = useReducer(reducer, initialState);
	return (
		<StateContext.Provider value={[state, updateAppSettings]}>
			{children}
		</StateContext.Provider>
	);
};

StateProvider.propTypes = {
	reducer: PropTypes.func,
	initialState: PropTypes.object,
	children: PropTypes.node,
};

export const useAppSettings = () => useContext(StateContext);
