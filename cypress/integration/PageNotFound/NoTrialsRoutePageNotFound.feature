Feature: As a user, I would like to see the Page Not Found page when I visit a dynamic listing page without parameters.

	Scenario: User visits the no trials found page directly without redirect
		Given "trialListingPageType" is set to "Disease"
		When the user navigates to "/notrials?p1=C3037"
		Then page title on error page is "Page Not Found"
    And the text "We can't find the page you're looking for." appears on the page
    And the link "homepage" to "https://www.cancer.gov" appears on the page
    And the link "cancer type" to "https://www.cancer.gov/types" appears on the page
    And the link "Get in touch" to "https://www.cancer.gov/contact" appears on the page
    And the search bar appears below
