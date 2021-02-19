Feature: As a user I would like to have the Sample page displayed

	Scenario: User visits manual trials listing page with no trials
		Given "trialListingPageType" is set to "Manual"
		And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		When the user navigates to "/"
		Then the page title is "Clinical Trials for Adult Metastatic Brain Tumors"
		And the system displays message "There are currently no available trials."
