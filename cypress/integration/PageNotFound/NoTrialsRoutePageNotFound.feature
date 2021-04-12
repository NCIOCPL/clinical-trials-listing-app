Feature: As a user, I would like to see the Page Not Found page when I visit a dynamic listing page with invalid parameters.

	Scenario: User visits the no trials found page with invalid c-code
		Given "trialListingPageType" is set to "Disease"
		When user navigates to non-existent page "/notrials?p1=c123455&cfg=0"
		Then page title on error page is "Page Not Found"
    And the text "We can't find the page you're looking for." appears on the page
    And the link "homepage" to "https://www.cancer.gov" appears on the page
    And the link "cancer type" to "https://www.cancer.gov/types" appears on the page
    And the link "Get in touch" to "https://www.cancer.gov/contact" appears on the page
    And the search bar appears below
		And the page contains meta tags with the following names
				| name                  | content 	 |
				| prerender-status-code | 404     	 |

	Scenario: User visits the no trials found page with invalid pretty url name
		Given "trialListingPageType" is set to "Disease"
		When user navigates to non-existent page "/notrials?p1=chicken-nuggets&cfg=0"
		Then page title on error page is "Page Not Found"
    And the text "We can't find the page you're looking for." appears on the page
    And the link "homepage" to "https://www.cancer.gov" appears on the page
    And the link "cancer type" to "https://www.cancer.gov/types" appears on the page
    And the link "Get in touch" to "https://www.cancer.gov/contact" appears on the page
    And the search bar appears below
		And the page contains meta tags with the following names
				| name                  | content 	 |
				| prerender-status-code | 404     	 |
