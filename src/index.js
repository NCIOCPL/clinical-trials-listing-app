import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills';

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { ClientContextProvider } from 'react-fetching-library';

import App from './App';
import { getAxiosClient } from './services/api/axios-client';
import * as serviceWorker from './serviceWorker';
import reducer from './store/reducer';
import { StateProvider } from './store/store';
import { AnalyticsProvider, EddlAnalyticsProvider } from './tracking';
import { getProductTestBase } from './utils';
import { ErrorBoundary } from './views';

/**
 * Initializes the Clinical Trials Listing App.
 * @param {object} params - Configuration for the app
 * @param {string} params.analyticsName - The name of the dictionary for analytics purposes.
 */
const initialize = ({
	analyticsChannel = 'Clinical Trials',
	// This should still be configurable in case someone is hosting
	// this outside of the digital platform, and wants to hookup
	// their own analytics. See index.html for an overly complicated
	// configuration that handles logging to the console.
	analyticsHandler = 'EddlAnalyticsHandler',
	analyticsContentGroup = 'Clinical Trials: Custom',
	analyticsPublishedDate = 'unknown',
	appId = '@@/DEFAULT_REACT_APP_ID',
	baseHost = 'http://localhost:3000',
	basePath = '/',
	apiEndpoint = 'https://clinicaltrialsapi.cancer.gov/v1/',
	canonicalHost = 'https://www.cancer.gov',
	browserTitle = '{{disease_label}} Clinical Trials',
	detailedViewPagePrettyUrlFormatter = '',
	introText = '',
	itemsPerPage = 25,
	language = 'en',
	metaDescription = 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for {{disease_normalized}}.',
	noTrialsHtml = '<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href=\\"/about-cancer/treatment/clinical-trials/search\\">new search</a> or <a href=\\"/contact\\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
	pageTitle = '{{disease_label}} Clinical Trials',
	trialListingPageType = 'Manual',
	requestFilters = '',
	rootId = 'NCI-app-root',
	siteName = 'National Cancer Institute',
	title = 'NCI Clinical Trials',
	viewPageUrlFormatter = '/clinicaltrials/{0}',
} = {}) => {
	const appRootDOMNode = document.getElementById(rootId);
	const isRehydrating = appRootDOMNode.getAttribute('data-isRehydrating');

	// populate global state with init params
	const initialState = {
		apiEndpoint,
		appId,
		analyticsChannel,
		analyticsContentGroup,
		analyticsPublishedDate,
		baseHost,
		basePath,
		detailedViewPagePrettyUrlFormatter,
		browserTitle,
		canonicalHost,
		introText,
		itemsPerPage,
		language,
		metaDescription,
		noTrialsHtml,
		pageTitle,
		requestFilters,
		trialListingPageType,
		siteName,
		title,
		viewPageUrlFormatter,
	};

	// Determine the analytics HoC we are going to use.
	// The following allows the app to be more portable, cgov will
	// default to using EDDL Analytics. Other sites could supplier
	// their own custom handler.
	const AnalyticsHoC = ({ children }) =>
		analyticsHandler === 'EddlAnalyticsHandler' ? (
			<EddlAnalyticsProvider
				pageLanguage={language === 'es' ? 'spanish' : 'english'}
				pageChannel={analyticsChannel}
				pageContentGroup={analyticsContentGroup}
				publishedDate={analyticsPublishedDate}>
				{children}
			</EddlAnalyticsProvider>
		) : (
			<AnalyticsProvider analyticsHandler={analyticsHandler}>
				{children}
			</AnalyticsProvider>
		);

	AnalyticsHoC.propTypes = {
		children: PropTypes.node,
	};

	const AppBlock = () => {
		return (
			<StateProvider initialState={initialState} reducer={reducer}>
				<AnalyticsHoC>
					<ClientContextProvider client={getAxiosClient(initialState)}>
						<ErrorBoundary>
							<App />
						</ErrorBoundary>
					</ClientContextProvider>
				</AnalyticsHoC>
			</StateProvider>
		);
	};

	if (isRehydrating) {
		ReactDOM.hydrate(<AppBlock />, appRootDOMNode);
	} else {
		ReactDOM.render(<AppBlock />, appRootDOMNode);
	}
	return appRootDOMNode;
};

export default initialize;

//add initialize to window
window.ClinicalTrialsListingApp = initialize;

// The following lets us run the app in dev not in situ as would normally be the case.
const appParams = window.APP_PARAMS || {};
const integrationTestOverrides = window.INT_TEST_APP_PARAMS || {};
if (process.env.NODE_ENV !== 'production') {
	//This is DEV
	const dictSettings = {
		...appParams,
		...integrationTestOverrides,
	};
	initialize(dictSettings);
} else if (window?.location?.host === 'react-app-dev.cancer.gov') {
	// This is for product testing
	const dictSettings = {
		...appParams,
		...integrationTestOverrides,
		...{ basePath: getProductTestBase() },
	};
	initialize(dictSettings);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
