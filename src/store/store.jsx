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
	const [state] = context;
	if (!state) {
		throw new Error('State is undefined. Ensure StateProvider has been initialized with initialState.');
	}
	// Ensure trialListingPageType is always defined, default to null if not set
	if (state.trialListingPageType === undefined) {
		state.trialListingPageType = null;
	}
	if (!state.trialListingPageType) {
		console.error('State is missing required trialListingPageType. Current state:', state);
		throw new Error('trialListingPageType is required in app configuration but is missing from state.');
	}
	return context;
};
