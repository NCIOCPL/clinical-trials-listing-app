Feature: As a user, I expect the first results page to appear when accessing a non-existent page

	Scenario: Navigating to a non-existent results page should redirect to the first page
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/breast-cancer?cfg=0&pn=41"
		Then the user is navigated to "/breast-cancer" with query parameters "pn=1" without redirect

