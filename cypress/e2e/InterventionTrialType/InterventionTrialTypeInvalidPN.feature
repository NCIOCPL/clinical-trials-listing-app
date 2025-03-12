Feature: As a user, I expect the first results page to appear when accessing a non-existent page

	Scenario: Navigating to a non-existent results page should redirect to the first page
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		Given the user navigates to "/trastuzumab?cfg=1&pn=54"
		Then the user is navigated to "/trastuzumab" with query parameters "pn=1" without redirect

