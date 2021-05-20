Feature: As a user, I would like to see the Page Not Found page when I visit a dynamic listing page without parameters.

	Scenario: User visits disease trials listing page with no parameters
		Given "trialListingPageType" is set to "Disease"
		When the user navigates to "/?cfg=0"
		Then page title on error page is "Page Not Found"
    And the text "We can't find the page you're looking for." appears on the page
    And the link "homepage" to "https://www.cancer.gov" appears on the page
    And the link "cancer type" to "https://www.cancer.gov/types" appears on the page
    And the link "Get in touch" to "https://www.cancer.gov/contact" appears on the page
    And the search bar appears below

	Scenario: User visits intervention trials listing page with no parameters
		Given "trialListingPageType" is set to "Intervention"
		When the user navigates to "/?cfg=1"
		Then page title on error page is "Page Not Found"
    And the text "We can't find the page you're looking for." appears on the page
    And the link "homepage" to "https://www.cancer.gov" appears on the page
    And the link "cancer type" to "https://www.cancer.gov/types" appears on the page
    And the link "Get in touch" to "https://www.cancer.gov/contact" appears on the page
    And the search bar appears below
    And delighter is not displayed
