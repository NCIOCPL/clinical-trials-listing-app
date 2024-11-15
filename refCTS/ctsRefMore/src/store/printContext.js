import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const PrintContext = createContext({ selectedResults: [] });
export const PrintContextProvider = ({ children }) => {
	const [selectedResults, setSelectedResults] = useState([]);

	const value = {
		selectedResults,
		setSelectedResults,
		clearSelectedTrials: () => {
			setSelectedResults([]);
		},
	};

	return (
		<PrintContext.Provider value={value}>{children}</PrintContext.Provider>
	);
};

PrintContextProvider.propTypes = {
	reducer: PropTypes.func,
	initialState: PropTypes.object,
	children: PropTypes.node,
};

export const usePrintContext = () => useContext(PrintContext);
