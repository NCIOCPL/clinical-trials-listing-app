import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills';

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import listingSupportApiFactory from './services/api/trial-listing-support-api';
import clinicalTrialsSearchClientFactory from './services/api/clinical-trials-search-api';

import * as serviceWorker from './serviceWorker';
import reducer from './store/reducer';
import { StateProvider } from './store/store';
import { AnalyticsProvider, EddlAnalyticsProvider } from './tracking';
import { getProductTestBase } from './utils';
import { ErrorBoundary } from './views';

/**
 * Initializes the Clinical Trials Listing App.
 * @param {any} params - Configuration for the app
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
	canonicalHost = 'https://www.cancer.gov',
	cisBannerImgUrlLarge = null,
	cisBannerImgUrlSmall = null,
	ctsApiHostname = 'clinicaltrialsapi.cancer.gov',
	ctsPort = null,
	ctsProtocol = 'https',
	browserTitle = '{{disease_label}} Clinical Trials',
	dynamicListingPatterns = null,
	detailedViewPagePrettyUrlFormatter = '',
	introText = '',
	itemsPerPage = 25,
	language = 'en',
	listingApiEndpoint = 'https://webapis.cancer.gov/triallistingsupport/v1/',
	liveHelpUrl = null,
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

	// Set up Clinical Trials API URL using given parameters.
	const setupTrialsAPIEndpoint = () => {
		if (ctsProtocol === null || ctsApiHostname === null) {
			throw new Error('ctsProtocol and ctsApiHostname must be set.');
		} else {
			return (
				(ctsProtocol !== '' ? ctsProtocol + '://' : '') +
				ctsApiHostname +
				(ctsPort && ctsPort !== '' ? ':' + ctsPort : '') +
				'/api/v2/'
			);
		}
	};

	// Setup API clients
	const trialListingSupportClient = listingSupportApiFactory(
		listingApiEndpoint
	);

	const clinicalTrialsSearchClient = clinicalTrialsSearchClientFactory(
		setupTrialsAPIEndpoint()
	);

	// populate global state with init params
	const initialState = {
		appId,
		analyticsChannel,
		analyticsContentGroup,
		analyticsPublishedDate,
		baseHost,
		basePath,
		cisBannerImgUrlLarge,
		cisBannerImgUrlSmall,
		ctsApiHostname,
		ctsPort,
		ctsProtocol,
		detailedViewPagePrettyUrlFormatter,
		dynamicListingPatterns,
		browserTitle,
		canonicalHost,
		introText,
		itemsPerPage,
		language,
		apiClients: {
			trialListingSupportClient,
			clinicalTrialsSearchClient,
		},
		listingApiEndpoint,
		liveHelpUrl,
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
					<ErrorBoundary>
						<App />
					</ErrorBoundary>
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
	const ctlSettings = {
		...appParams,
		...integrationTestOverrides,
	};
	initialize(ctlSettings);
} else if (window?.location?.host === 'react-app-dev.cancer.gov') {
	// This is for product testing
	const ctlSettings = {
		...appParams,
		...integrationTestOverrides,
		...{ basePath: getProductTestBase() },
	};
	initialize(ctlSettings);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
