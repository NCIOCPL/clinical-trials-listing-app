import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/app.scss';

import { useAppPaths } from './hooks';
import { useStateValue } from './store/store';
import {
	CTLViewsHoC,
	Disease,
	InvalidParameters,
	Manual,
	NoTrialsFound,
	PageNotFound,
} from './views';

const App = () => {
	let dynamicRoutes;
	const { BasePath, CodeOrPurlPath, NoTrialsPath } = useAppPaths();
	const [
		{ cisBannerImgUrlLarge, cisBannerImgUrlSmall, trialListingPageType },
	] = useStateValue();

	// Check for image parameters, and set string for invalid parameters page.
	const hasBannerImages =
		cisBannerImgUrlLarge !== null && cisBannerImgUrlSmall !== null;
	const imageParams = 'cisBannerImgUrlLarge, cisBannerImgUrlSmall';

	const WrappedDisease = CTLViewsHoC(Disease);
	const WrappedNoTrials = CTLViewsHoC(NoTrialsFound);

	switch (trialListingPageType) {
		case 'Disease':
			// If both banner images are present, set the disease routes.
			if (hasBannerImages) {
				dynamicRoutes = (
					<Routes>
						<Route path={NoTrialsPath()} element={<WrappedNoTrials />} exact />
						<Route path={CodeOrPurlPath()} element={<WrappedDisease />} />
						<Route path="/*" element={<PageNotFound />} />
					</Routes>
				);
			} else {
				dynamicRoutes = (
					<Routes>
						<Route
							path="/*"
							element={<InvalidParameters paramName={imageParams} />}
						/>
					</Routes>
				);
			}
			break;

		case 'Intervention':
			// If both banner images are present, set the intervention routes.
			if (hasBannerImages) {
				dynamicRoutes = (
					<Routes>
						<Route path="/*" element={<PageNotFound />} />
					</Routes>
				);
			} else {
				dynamicRoutes = (
					<Routes>
						<Route
							path="/*"
							element={<InvalidParameters paramName={imageParams} />}
						/>
					</Routes>
				);
			}
			break;

		case 'Manual':
			// If both banner images aren't present, set the manual routes.
			if (cisBannerImgUrlLarge == null && cisBannerImgUrlSmall == null) {
				dynamicRoutes = (
					<Routes>
						<Route path={BasePath()} element={<Manual />} />
						<Route path="/*" element={<PageNotFound />} />
					</Routes>
				);
			} else {
				dynamicRoutes = (
					<Routes>
						<Route
							path="/*"
							element={<InvalidParameters paramName={imageParams} />}
						/>
					</Routes>
				);
			}
			break;

		default:
			dynamicRoutes = (
				<Routes>
					<Route
						path="/*"
						element={<InvalidParameters paramName="trialListingPageType" />}
					/>
				</Routes>
			);
	}

	return <Router>{dynamicRoutes}</Router>;
};

App.propTypes = {
	tracking: PropTypes.object,
};

export default App;
