// Call to reinitialize application.

beforeEach(() => {
	cy.on('window:before:load', (win) => {
		// This is the only setting that needs to be set across each application
		// load. this needs to occur before cy.visit() which will request the
		// page. Setting all defaults in order to make sure that a change
		// to development defaults does not break a bunch of texts.
		win.INT_TEST_APP_PARAMS = {
			analyticsName: 'TrialListingApp',
			analyticsContentGroup: 'Clinical Trials: Custom',
			analyticsPublishedDate: 'unknown',
			appId: '@@/DEFAULT_REACT_APP_ID',
			baseHost: 'http://localhost:3000',
			basePath: '/',
			browserTitle: null,
			canonicalHost: 'https://www.cancer.gov',
			cisBannerImgUrlLarge: '%PUBLIC_URL%/images/cts-cis-banner-xl.jpeg',
			cisBannerImgUrlSmall: '%PUBLIC_URL%/images/cts-cis-banner-smartphone.jpeg',
			detailedViewPagePrettyUrlFormatter:
				'/clinicaltrials/{{nci_id}}',
			dynamicListingPatterns: {
				Disease: {
					browserTitle: '{{disease_label}} Clinical Trials',
					introText:
						'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}. All trials on the list are <a class=\"definition\" href=\"/Common/PopUps/popDefinition.aspx?id=CDR0000776051&amp;version=Patient&amp;language=English\" onclick=\"javascript:popWindow(\'defbyid\',\'CDR0000776051&amp;version=Patient&amp;language=English\'); return false;\">supported by NCI</a>.</p><p>NCI’s <a href=\"/about-cancer/treatment/clinical-trials/what-are-trials\">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
					metaDescription:
						'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for {{disease_normalized}}.',
					noTrialsHtml:
						'<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
					pageTitle: '{{disease_label}} Clinical Trials',
				},
				DiseaseTrialType: {
					browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
					introText:
						'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}} {{trial_type_normalized}}. All trials on the list are <a class=\"definition\" href=\"/Common/PopUps/popDefinition.aspx?id=CDR0000776051&amp;version=Patient&amp;language=English\" onclick=\"javascript:popWindow(\'defbyid\',\'CDR0000776051&amp;version=Patient&amp;language=English\'); return false;\">supported by NCI</a>.</p><p>NCI’s <a href=\"/about-cancer/treatment/clinical-trials/what-are-trials\">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
					metaDescription:
						'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find {{trial_type_normalized}} clinical trials for {{disease_normalized}}.',
					noTrialsHtml:
						'<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
					pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
				},
				DiseaseTrialTypeIntervention: {
					browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
					introText:
						'<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods for {{disease_normalized}} that use {{intervention_normalized}}. All trials on the list are <a class=\"definition\" href=\"/Common/PopUps/popDefinition.aspx?id=CDR0000776051&amp;version=Patient&amp;language=English\" onclick=\"javascript:popWindow(\'defbyid\',\'CDR0000776051&amp;version=Patient&amp;language=English\'); return false;\">supported by NCI</a>.</p><p>NCI’s <a href=\"/about-cancer/treatment/clinical-trials/what-are-trials\">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
					metaDescription:
						'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials testing {{intervention_normalized}} in the {{trial_type_normalized}} of {{disease_normalized}}.',
					noTrialsHtml:
						'<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
					pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
				},
			},
			introText:
				'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for adult metastatic brain tumor treatment. All trials on the list are <a class="definition" href="/Common/PopUps/popDefinition.aspx?id=CDR0000776051&amp;version=Patient&amp;language=English" onclick="javascript:popWindow("defbyid","CDR0000776051&amp;version=Patient&amp;language=English"); return false;">supported by NCI</a>.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
			itemsPerPage: 25,
			listingApiEndpoint: '/api/',
			metaDescription: null,
			noTrialsHtml: null,
			pageTitle: null,
			requestFilters: {
				'diseases.nci_thesaurus_concept_id': ['C5816', 'C8550', 'C3813'],
				'primary_purpose.primary_purpose_code': 'treatment',
			},
			rootId: 'NCI-app-root',
			siteName: 'National Cancer Institute',
			title: 'NCI Clinical Trials',
			trialListingPageType: 'Disease',
			trialsApiEndpoint: '/api/',
		};
		console.log(win.INT_TEST_APP_PARAMS);
	});
});
