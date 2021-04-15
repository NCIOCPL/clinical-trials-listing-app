import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/app.scss';

import { useAppPaths } from './hooks';
import { useStateValue } from './store/store';
import { pageTypePatterns, textProperties } from './constants';
import {
	CTLViewsHoC,
	Disease,
	InvalidParameters,
	Manual,
	PageNotFound,
} from './views';

const App = () => {
	let dynamicRoutes;
	const { BasePath, CodeOrPurlPath } = useAppPaths();

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
						// The pattern has all text propertes expected.
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

	const patternParams = 'dynamicListingPatterns';
	const imageParams = 'cisBannerImgUrlLarge, cisBannerImgUrlSmall';

	const getInvalidParams = (patterns, images) => {
		if (!patterns && !images) {
			return patternParams + ', ' + imageParams;
		} else if (!patterns && images) {
			return patternParams;
		} else if (patterns && !images) {
			return imageParams;
		}
	};

	// Set up CTLViewsHoC-wrapped routes.
	const WrappedDisease = CTLViewsHoC(Disease);
	//const WrappedDiseaseTrialType = CTLViewsHoC(DiseaseTrialType);

	switch (trialListingPageType) {
		case 'Disease': {
			const hasDiseasePatterns = hasAllDynamicListingPatterns(
				trialListingPageType
			);

			// If all dynamic listing patterns and both banner images are present,
			// set the disease routes.
			if (hasDiseasePatterns && hasBannerImages) {
				dynamicRoutes = (
					<Routes>
						<Route path={CodeOrPurlPath()} element={<WrappedDisease />} />
						<Route path={CodeOrPurlWithTypePath()} element={<WrappedDisease />} />
						<Route path="/*" element={<PageNotFound />} />
					</Routes>
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
