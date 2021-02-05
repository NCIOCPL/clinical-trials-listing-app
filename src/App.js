import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/app.scss';

import { useAppPaths } from './hooks';
import { Home, ItemDetails, PageNotFound } from './views';

const App = () => {
	// this should be a DUMB component that just displays our display(group) components
	const { HomePath, ItemDetailsPath } = useAppPaths();

	return (
		<Router>
			<Routes>
				<Route path={HomePath()} element={<Home />} />
				<Route path={ItemDetailsPath()} element={<ItemDetails />} />
				<Route path="/*" element={<PageNotFound />} />
			</Routes>
		</Router>
	);
};

App.propTypes = {
	tracking: PropTypes.object,
};

export default App;
