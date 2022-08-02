Feature: As a user I would like to have the Sample page displayed

	Scenario: User visits manual trials listing page with no trials
		Given "trialListingPageType" is set to "Manual"
		And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to null
		And "requestFilters" is set as a json string to "{'diseases.nci_thesaurus_concept_id': ['chicken', 'foo', 'oknn'], 'primary_purpose': 'treatment'}"
		When the user navigates to "/"
		Then the page title is "Clinical Trials for Adult Metastatic Brain Tumors"
		And the system displays message "There are currently no available trials."
		And delighter is displayed with link "https://cancer.gov/about-cancer/treatment/clinical-trials/search"
