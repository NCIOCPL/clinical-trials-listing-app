Feature: As the system, I want to be able to redirect users to pretty URLs for the dynamic listing pages, so that the pages are more user and SEO friendly.

	Scenario: Page redirects to pretty URL if codes are given for Disease
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/C4872/treatment/C1647?cfg=0"
		Then the user is redirected to "/breast-cancer/treatment/trastuzumab?cfg=0&pn=1&redirect=true"
		And the page contains meta tags with the following names
			| name                  | content                                       |
			| prerender-status-code | 301                                           |
			| prerender-header      | Location: http://localhost:3000/breast-cancer/treatment/trastuzumab |

	Scenario: Page goes to prettyURL, without appending redirect=true, when not given a c-code
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/breast-cancer/treatment/trastuzumab?cfg=0"
		Then the redirect parameter is not appended
