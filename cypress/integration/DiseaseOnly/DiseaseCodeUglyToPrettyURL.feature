Feature: As the system, I want to be able to redirect users to pretty URLs for the dynamic listing pages, so that the pages are more user and SEO friendly.

	Scenario: Page redirects to pretty URL if codes are given for Disease
		Given "trialListingPageType" is set to "Disease"
		And "pageTitle" is set to "{{disease_label}} Clinical Trials"
		Given the user navigates to "/C4872"
		Then the user is redirected to "/breast-cancer?redirect=true"
