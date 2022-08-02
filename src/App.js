import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/app.scss';

import { pageTypePatterns, textProperties } from './constants';
import { useAppPaths } from './hooks';
import { ListingSupportContextProvider } from './hooks/listingSupport';
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
	const {
		BasePath,
		CodeOrPurlPath,
		CodeOrPurlWithTypePath,
		CodeOrPurlWithTypeAndInterCodeOrPurlPath,
		NoTrialsPath,
	} = useAppPaths();
	const [
		{
			cisBannerImgUrlLarge,
			cisBannerImgUrlSmall,
			dynamicListingPatterns,
			trialListingPageType,
		},
	] = useStateValue();

	const hasAllDynamicListingPatterns = (pageType) => {
		if (dynamicListingPatterns == null) {
			return false;
		} else {
			return (
				// The dynamicListingPatterns have all patterns that are
				// expected for the given page type.
				pageTypePatterns[pageType].every((pattern) =>
					Object.keys(dynamicListingPatterns).includes(pattern)
				) &&
				// Each pattern within the dynamicListingPatterns has all text
				// properties set that are expected.
				Object.keys(dynamicListingPatterns).every(
					(pattern) =>
						// The pattern has all text properties expected.
						textProperties.every((property) =>
							Object.keys(dynamicListingPatterns[pattern]).includes(property)
						) &&
						// Each text property is set, and not null or undefined.
						!Object.values(dynamicListingPatterns[pattern]).some(
							(textProperty) => textProperty == null
						)
				)
			);
		}
	};

	// Check for image parameters, and set string for invalid parameters page.
	const hasBannerImages =
		cisBannerImgUrlLarge !== null && cisBannerImgUrlSmall !== null;
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
			const hasDiseasePatterns = hasAllDynamicListingPatterns(
				trialListingPageType
			);
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
							<Route
								path={CodeOrPurlWithTypePath()}
								element={
									<WrappedDisease
										redirectPath={CodeOrPurlWithTypePath}
										routeParamMap={diseaseRouteParamMap}
									/>
								}
							/>
							<Route
								path={CodeOrPurlWithTypeAndInterCodeOrPurlPath()}
								element={
									<WrappedDisease
										redirectPath={CodeOrPurlWithTypeAndInterCodeOrPurlPath}
										routeParamMap={diseaseRouteParamMap}
									/>
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
						<Route
							path="/*"
							element={<InvalidParameters paramName={params} />}
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
							<Route
								path={CodeOrPurlWithTypePath()}
								element={
									<WrappedIntervention
										redirectPath={CodeOrPurlWithTypePath}
										routeParamMap={interventionRouteParamMap}
									/>
								}
							/>
							<Route path="/*" element={<PageNotFound />} />
						</Routes>
					</ListingSupportContextProvider>
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

	return <Router>{dynamicRoutes}</Router>;
};

App.propTypes = {
	tracking: PropTypes.object,
};

export default App;
