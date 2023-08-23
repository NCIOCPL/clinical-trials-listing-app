import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return <StateContext.Provider value={[state, dispatch]}>{children}</StateContext.Provider>;
};

StateProvider.propTypes = {
	reducer: PropTypes.func,
	initialState: PropTypes.object,
	children: PropTypes.node,
};

export const useStateValue = () => {
	const context = useContext(StateContext);
	if (context === undefined) {
		throw new Error('useStateValue must be used within a StateProvider');
	}
	return context;
};
