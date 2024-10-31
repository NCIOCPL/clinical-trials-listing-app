const viewports = {
	mobile: 'mobile',
	tablet: 'tablet',
	desktop: [1029, 720],
};
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
			cisBannerImgUrlLarge: '%PUBLIC_URL%/images/cts-cis-banner-xl.jpeg',
			cisBannerImgUrlSmall: '%PUBLIC_URL%/images/cts-cis-banner-smartphone.jpeg',
			dynamicListingPatterns: {
				Disease: {
					Disease: {
						browserTitle: '{{disease_label}} Clinical Trials',
						introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
						metaDescription: 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for {{disease_normalized}}.',
						noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
						pageTitle: '{{disease_label}} Clinical Trials',
					},
					DiseaseTrialType: {
						browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
						introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}} {{trial_type_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
						metaDescription: 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find {{trial_type_normalized}} clinical trials for {{disease_normalized}}.',
						noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
						pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
					},
					DiseaseTrialTypeIntervention: {
						browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
						introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods for {{disease_normalized}} that use {{intervention_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
						metaDescription: 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials testing {{intervention_normalized}} in the {{trial_type_normalized}} of {{disease_normalized}}.',
						noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
						pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
					},
				},

				Intervention: {
					Intervention: {
						pageTitle: 'Clinical Trials Using {{intervention_label}}',
						browserTitle: 'Clinical Trials Using {{intervention_label}}',
						metaDescription: 'NCI supports clinical trials that test new and more effective ways to treat cancer. Find clinical trials studying {{intervention_normalized}}.',
						introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying {{intervention_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
						noTrialsHtml: '<p>There are no NCI-supported clinical trials studying {{intervention_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
					},
					InterventionTrialType: {
						pageTitle: '{{trial_type_label}} Clinical Trials Using {{intervention_label}}',
						browserTitle: '{{trial_type_label}} Clinical Trials Using {{intervention_label}}',
						metaDescription: 'NCI supports clinical trials studying new and more effective ways to treat cancer. Find clinical trials testing {{trial_type_normalized}} methods that use {{intervention_normalized}}.',
						introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods that use {{intervention_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
						noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
					},
				},
			},
			itemsPerPage: 25,
			trialListingPageType: 'Disease',
			listingApiEndpoint: '/api/',
			ctsApiEndpoint: '/cts/mock-api/v2',
			rootId: 'NCI-app-root',
			pageTitle: '{{disease_name}} Clinical Trials',
			requestFilters: {
				'diseases.nci_thesaurus_concept_id': ['C5816', 'C8550', 'C3813'],
				primary_purpose: 'treatment',
			},
			detailedViewPagePrettyUrlFormatter: '/clinicaltrials/{{nci_id}}',
			introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are for breast cancer. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
		};
		console.log(win.INT_TEST_APP_PARAMS);

		// Set up viewport based on test configuration
		if (win.testConfig && win.testConfig.viewport) {
			const viewport = viewports[win.testConfig.viewport];
			if (Array.isArray(viewport)) {
				cy.viewport(viewport[0], viewport[1]);
			} else {
				cy.viewport(viewport);
			}
		}
	});

	cy.get('.nci-spinner').should('not.exist');
});
