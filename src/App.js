import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/app.scss';

import { useAppPaths } from './hooks';
import { useStateValue } from './store/store';
import {
	CTLViewsHoC,
	Disease,
	Intervention,
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

	const WrappedNoTrials = CTLViewsHoC(NoTrialsFound);

	switch (trialListingPageType) {
		case 'Disease': {
			const WrappedDisease = CTLViewsHoC(Disease);

			// This is a map of the parameters and types of params that is
			// used by the HoC to fetch information from the listing support
			// service. The names should be just like they are in the route
			// and the type is either listing-information, trial-type, or
			// whatever future info type there could be returned by the API.
			// Additionally the textReplacementKey is used by NoTrialsFound
			// to setup the replacement text context vars.
			// Order matters!
			const diseaseRouteParamMap = [
				{
					paramName: 'codeOrPurl',
					textReplacementKey: 'disease',
					type: 'listing-information',
				},
			];

			// If both banner images are present, set the disease routes.
			if (hasBannerImages) {
				dynamicRoutes = (
					<Routes>
						<Route
							path={NoTrialsPath()}
							element={
								<WrappedNoTrials
									redirectPath={NoTrialsPath}
									routeParamMap={diseaseRouteParamMap}
								/>
							}
							exact
						/>
						<Route
							path={CodeOrPurlPath()}
							element={
								<WrappedDisease
									redirectPath={CodeOrPurlPath}
									routeParamMap={diseaseRouteParamMap}
								/>
							}
						/>
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
		}
		case 'Intervention': {
			const WrappedIntervention = CTLViewsHoC(Intervention);

			// This is a map of the parameters and types of params that is
			// used by the HoC to fetch information from the listing support
			// service. The names should be just like they are in the route
			// and the type is either listing-information, trial-type, or
			// whatever future info type there could be returned by the API.
			// Additionally the textReplacementKey is used by NoTrialsFound
			// to setup the replacement text context vars.
			// Order matters!
			const interventionRouteParamMap = [
				{
					paramName: 'codeOrPurl',
					textReplacementKey: 'intervention',
					type: 'listing-information',
				},
			];

			// If both banner images are present, set the intervention routes.
			if (hasBannerImages) {
				dynamicRoutes = (
					<Routes>
						<Route
							path={NoTrialsPath()}
							element={
								<WrappedNoTrials
									redirectPath={NoTrialsPath}
									routeParamMap={interventionRouteParamMap}
								/>
							}
							exact
						/>
						<Route
							path={CodeOrPurlPath()}
							element={
								<WrappedIntervention
									redirectPath={CodeOrPurlPath}
									routeParamMap={interventionRouteParamMap}
								/>
							}
						/>
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
		}

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

	return (
		<>
			<div className="page-options-container" />
			<Router>{dynamicRoutes}</Router>;
		</>
	);
};

App.propTypes = {
	tracking: PropTypes.object,
};

export default App;
