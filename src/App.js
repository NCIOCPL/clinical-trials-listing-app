import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/app.scss';

import { useAppPaths } from './hooks';
import { useStateValue } from './store/store';
import { Manual, NoListingType, PageNotFound } from './views';

const App = () => {
	let dynamicRoutes;
	const { BasePath } = useAppPaths();
	const [{ trialListingPageType }] = useStateValue();

	switch (trialListingPageType) {
		case 'Disease':
			dynamicRoutes = <Routes>
				<Route path="/*" element={<PageNotFound />} />
			</Routes>;
			break;

		case 'Intervention':
			dynamicRoutes = <Routes>
				<Route path="/*" element={<PageNotFound />} />
			</Routes>;
			break;

		case 'Manual':
			dynamicRoutes = <Routes>
				<Route path={BasePath()} element={<Manual />} />
				<Route path="/*" element={<PageNotFound />} />
			</Routes>;
			break;

		default:
			dynamicRoutes = <Routes>
				<Route path="/*" element={<NoListingType />} />
			</Routes>;

	}

	return (
		<Router>
			{dynamicRoutes}
		</Router>
	);
};

App.propTypes = {
	tracking: PropTypes.object,
};

export default App;
