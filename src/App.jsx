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
