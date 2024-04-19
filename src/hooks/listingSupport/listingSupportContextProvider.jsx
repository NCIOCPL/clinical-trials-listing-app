import React from 'react';
import PropTypes from 'prop-types';
import { ListingSupportContext } from './listingSupportContext';
import ListingSupportCache from './listingSupportCache';

// Create an instance of the cache to be used by the context.
const cache = new ListingSupportCache();

/**
 * Provider that sets up the ListingSupportContext for useListingSupport.
 * @param {Object} props.children the child controls
 */
export const ListingSupportContextProvider = ({ children }) => {
	return (
		<ListingSupportContext.Provider value={{ cache }}>
			{children}
		</ListingSupportContext.Provider>
	);
};

ListingSupportContextProvider.propTypes = {
	children: PropTypes.node,
};
