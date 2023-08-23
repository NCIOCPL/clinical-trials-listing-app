import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FilterProvider } from './features/filters/context/FilterContext/FilterContext';
import './styles/app.scss';
import { pageTypePatterns, textProperties } from './constants';
import { useAppPaths } from './hooks';
import { ListingSupportContextProvider } from './hooks/listingSupport';
import { useStateValue } from './store/store';
import { CTLViewsHoC, Disease, Intervention, InvalidParameters, Manual, NoTrialsFound, PageNotFound } from './views';

const App = () => {
	let dynamicRoutes;
	const { BasePath, CodeOrPurlPath, CodeOrPurlWithTypePath, CodeOrPurlWithTypeAndInterCodeOrPurlPath, NoTrialsPath } = useAppPaths();

	const [{ cisBannerImgUrlLarge, cisBannerImgUrlSmall, dynamicListingPatterns, trialListingPageType }] = useStateValue();

	const hasAllDynamicListingPatterns = (pageType) => {
		if (dynamicListingPatterns == null) {
			return false;
		} else {
			return pageTypePatterns[pageType].every((pattern) => Object.keys(dynamicListingPatterns).includes(pattern)) && Object.keys(dynamicListingPatterns).every((pattern) => textProperties.every((property) => Object.keys(dynamicListingPatterns[pattern]).includes(property)) && !Object.values(dynamicListingPatterns[pattern]).some((textProperty) => textProperty == null));
		}
	};

	const hasBannerImages = cisBannerImgUrlLarge !== null && cisBannerImgUrlSmall !== null;
	const imageParams = 'cisBannerImgUrlLarge, cisBannerImgUrlSmall';
	const patternParams = 'dynamicListingPatterns';

	const getInvalidParams = (patterns, images) => {
		if (!patterns && !images) {
			return patternParams + ', ' + imageParams;
		} else if (!patterns && images) {
			return patternParams;
		} else if (patterns && !images) {
			return imageParams;
		}
	};

	const WrappedNoTrials = CTLViewsHoC(NoTrialsFound);

	switch (trialListingPageType) {
		case 'Disease': {
			const hasDiseasePatterns = hasAllDynamicListingPatterns(trialListingPageType);
			const WrappedDisease = CTLViewsHoC(Disease);

			// Note: This Configuration should be moved somewhere more prominent. TODO
			// This is a map of the parameters and types of params that is
			// used by the HoC to fetch information from the listing support
			// service. The names should be just like they are in the route
			// and the type is either listing-information, trial-type, or
			// whatever future info type there could be returned by the API.
			// Additionally, the textReplacementKey is used by NoTrialsFound
			// to setup the replacement text context vars.
			// Order matters!
			const diseaseRouteParamMap = [
				{
					paramName: 'codeOrPurl',
					textReplacementKey: 'disease',
					type: 'listing-information',
				},
				{
					paramName: 'type',
					textReplacementKey: 'trial_type',
					type: 'trial-type',
				},
				{
					paramName: 'interCodeOrPurl',
					textReplacementKey: 'intervention',
					type: 'listing-information',
				},
			];

			// If all dynamic listing patterns and corresponding params
			// and both banner images are present, set the disease routes.
			if (hasDiseasePatterns && hasBannerImages) {
				dynamicRoutes = (
					<ListingSupportContextProvider>
						<Routes>
							<Route path={NoTrialsPath()} element={<WrappedNoTrials redirectPath={NoTrialsPath} routeParamMap={diseaseRouteParamMap} />} exact />
							<Route
								path={CodeOrPurlPath()}
								element={
									<FilterProvider pageType={'Disease'}>
										<WrappedDisease redirectPath={CodeOrPurlPath} routeParamMap={diseaseRouteParamMap} />
									</FilterProvider>
								}
							/>
							<Route
								path={CodeOrPurlWithTypePath()}
								element={
									<FilterProvider pageType={'Disease'}>
										<WrappedDisease redirectPath={CodeOrPurlWithTypePath} routeParamMap={diseaseRouteParamMap} />
									</FilterProvider>
								}
							/>
							<Route
								path={CodeOrPurlWithTypeAndInterCodeOrPurlPath()}
								element={
									<FilterProvider pageType={'Disease'}>
										<WrappedDisease redirectPath={CodeOrPurlWithTypeAndInterCodeOrPurlPath} routeParamMap={diseaseRouteParamMap} />
									</FilterProvider>
								}
							/>
							<Route path="/*" element={<PageNotFound />} />
						</Routes>
					</ListingSupportContextProvider>
				);
			} else {
				const params = getInvalidParams(hasDiseasePatterns, hasBannerImages);
				dynamicRoutes = (
					<Routes>
						<Route path="/*" element={<InvalidParameters paramName={params} />} />
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
				{
					paramName: 'type',
					textReplacementKey: 'trial_type',
					type: 'trial-type',
				},
			];

			// If both banner images are present, set the intervention routes.
			if (hasBannerImages) {
				dynamicRoutes = (
					<ListingSupportContextProvider>
						<Routes>
							<Route path={NoTrialsPath()} element={<WrappedNoTrials redirectPath={NoTrialsPath} routeParamMap={interventionRouteParamMap} />} exact />
							<Route
								path={CodeOrPurlPath()}
								element={
									<FilterProvider pageType={'Intervention'}>
										<WrappedIntervention redirectPath={CodeOrPurlPath} routeParamMap={interventionRouteParamMap} />
									</FilterProvider>
								}
							/>
							<Route
								path={CodeOrPurlWithTypePath()}
								element={
									<FilterProvider pageType={'Intervention'}>
										<WrappedIntervention redirectPath={CodeOrPurlWithTypePath} routeParamMap={interventionRouteParamMap} />
									</FilterProvider>
								}
							/>
							<Route path="/*" element={<PageNotFound />} />
						</Routes>
					</ListingSupportContextProvider>
				);
			} else {
				dynamicRoutes = (
					<Routes>
						<Route path="/*" element={<InvalidParameters paramName={imageParams} />} />
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
						<FilterProvider pageType={'Manual'}>
							<Route path={BasePath()} element={<Manual />} />
						</FilterProvider>
						<Route path="/*" element={<PageNotFound />} />
					</Routes>
				);
			} else {
				dynamicRoutes = (
					<Routes>
						<Route path="/*" element={<InvalidParameters paramName={imageParams} />} />
					</Routes>
				);
			}
			break;

		default:
			dynamicRoutes = (
				<Routes>
					<Route path="/*" element={<InvalidParameters paramName="trialListingPageType" />} />
				</Routes>
			);
	}

	return (
		<Router>
			<div className="app">
				<div className="app-content">{dynamicRoutes}</div>
			</div>
		</Router>
	);
};

export default App;
