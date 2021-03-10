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
			canonicalHost: 'https://www.cancer.gov',
			itemsPerPage: 25,
			trialListingPageType: 'Disease',
			listingApiEndpoint: '/api/',
			rootId: 'NCI-app-root',
			siteName: 'National Cancer Institute',
			pageTitle: '{{disease_name}} Clinical Trials',
			requestFilters: {
				'diseases.nci_thesaurus_concept_id': ['C5816', 'C8550', 'C3813'],
				'primary_purpose.primary_purpose_code': 'treatment',
			},
			resultsItemTitleLink:
				'https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v',
				introText:
				'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for breast cancer. All trials on the list are <a class="definition" href="/Common/PopUps/popDefinition.aspx?id=CDR0000776051&amp;version=Patient&amp;language=English" onclick="javascript:popWindow("defbyid","CDR0000776051&amp;version=Patient&amp;language=English"); return false;">supported by NCI</a>.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				trialsApiEndpoint: '/api/',
		};
		console.log(win.INT_TEST_APP_PARAMS);
	});
});
