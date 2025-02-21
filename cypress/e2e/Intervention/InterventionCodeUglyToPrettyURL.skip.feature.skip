Feature: As the system, I want to be able to redirect users to pretty URLs for the dynamic listing pages, so that the pages are more user and SEO friendly.

	Scenario: Page redirects to pretty URL if codes are given for Intervention
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		Given the user navigates to "/C1647?cfg=1"
		Then the user is redirected to "/trastuzumab?cfg=1&pn=1&redirect=true"
		And the page contains meta tags with the following names
				| name                  | content 																	  |
				| prerender-status-code | 301     																	  |
				| prerender-header		  | Location: http://localhost:3000/trastuzumab |

	Scenario: Page goes to prettyURL, without appending redirect=true, when not given a c-code
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		Given the user navigates to "/trastuzumab?cfg=1"
		Then the redirect parameter is not appended
