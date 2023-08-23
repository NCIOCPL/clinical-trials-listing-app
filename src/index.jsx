import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills';

import PropTypes from 'prop-types';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App';
import listingSupportApiFactory from './services/api/trial-listing-support-api';
import * as serviceWorker from './serviceWorker';
import reducer from './store/reducer';
import { StateProvider } from './store/store';
import { AnalyticsProvider, EddlAnalyticsProvider } from './tracking';
import { getProductTestBase } from './utils';
import { ErrorBoundary } from './views';

import clinicalTrialsSearchClientFactory from './services/api/clinical-trials-search-api/clinicalTrialsSearchClientFactory';

// TODO Do we still want this?
// /**
//  * Imports the NCI Extended Header with Mega Menu component auto initializer.
//  * Note: this should output a console warning for mega menu.
//  */
// import '@nciocpl/ncids-js/nci-header/extended-with-mega-menu/auto-init';
//
// /**
//  * Imports the NCI Big Footer component auto initializer.
//  */
import '@nciocpl/ncids-js/usa-footer/nci-big/auto-init';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			retry: 1,
		},
	},
});

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
	ctsApiEndpoint = 'https://clinicaltrialsapi.cancer.gov/api/v2',
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
	zipConversionEndpoint = '/cts_api/zip_code_lookup',
} = {}) => {
	const appRootDOMNode = document.getElementById(rootId);
	const isRehydrating = appRootDOMNode.getAttribute('data-isRehydrating');

	// Setup API clients
	const trialListingSupportClient = listingSupportApiFactory(listingApiEndpoint);

	// Set up Clinical Trials API URL using given parameters.
	const clinicalTrialsSearchClient = clinicalTrialsSearchClientFactory(ctsApiEndpoint);

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
		ctsApiEndpoint,
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
		zipConversionEndpoint,
	};

	// Determine the analytics HoC we are going to use.
	// The following allows the app to be more portable, cgov will
	// default to using EDDL Analytics. Other sites could supplier
	// their own custom handler.
	const AnalyticsHoC = ({ children }) =>
		analyticsHandler === 'EddlAnalyticsHandler' ? (
			<EddlAnalyticsProvider pageLanguage={language === 'es' ? 'spanish' : 'english'} pageChannel={analyticsChannel} pageContentGroup={analyticsContentGroup} publishedDate={analyticsPublishedDate}>
				{children}
			</EddlAnalyticsProvider>
		) : (
			<AnalyticsProvider analyticsHandler={analyticsHandler}>{children}</AnalyticsProvider>
		);

	AnalyticsHoC.propTypes = {
		children: PropTypes.node,
	};

	const AppBlock = () => {
		return (
			<QueryClientProvider client={queryClient}>
				<StateProvider initialState={initialState} reducer={reducer}>
					<AnalyticsHoC>
						<ErrorBoundary>
							<App />
						</ErrorBoundary>
					</AnalyticsHoC>
				</StateProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		);
	};

	const root = createRoot(appRootDOMNode);
	// Render the app
	if (isRehydrating) {
		root.hydrate(<AppBlock />);
	} else {
		root.render(<AppBlock />);
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
		ctsApiEndpoint: 'http://localhost:3000/cts/proxy-api/v2',
		...integrationTestOverrides,
		zipConversionEndpoint: 'http://localhost:3000/mock-api/zip_code_lookup',
	};
	initialize(ctlSettings);
} else if (window?.location?.host === 'react-app-dev.cancer.gov') {
	// This is for product testing
	const ctlSettings = {
		...appParams,
		ctsApiEndpoint: 'https://clinicaltrialsapi.cancer.gov/api/v2',
		...integrationTestOverrides,
		...{ basePath: getProductTestBase() },
	};
	initialize(ctlSettings);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
