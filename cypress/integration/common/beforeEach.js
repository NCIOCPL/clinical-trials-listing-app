// Call to reinitialize application.

beforeEach(() => {
	cy.on('window:before:load', (win) => {
		// This is the only setting that needs to be set across each application
		// load. this needs to occur before cy.visit() which will request the
		// page. Setting all defaults in order to make sure that a change
		// to development defaults does not break a bunch of texts.
		win.INT_TEST_APP_PARAMS = {
				analyticsName: 'TrialListingApp',
				siteName: 'National Cancer Institute',
				title: 'NCI Clinical Trials',
				analyticsContentGroup: 'Clinical Trials: Custom',
				analyticsPublishedDate: 'unknown',
				appId: '@@/DEFAULT_REACT_APP_ID',
				baseHost: 'http://localhost:3000',
				basePath: '/',
				apiEndpoint: '/api/sampleapi/v1/',
				canonicalHost: 'https://www.cancer.gov',
				itemsPerPage: 25,
				trialListingPageType: 'Disease',
				rootId: 'NCI-app-root',
				siteName: 'National Cancer Institute',
				title: 'NCI Clinical Trials',
		};
		console.log(win.INT_TEST_APP_PARAMS);
	});
});
