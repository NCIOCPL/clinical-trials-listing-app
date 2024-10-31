@skip
Feature: As a user, I should expect a No Trials Found Page to appear when accessing a non-existent page

	Scenario: Navigating to a non-existent page should bring up the No Trials Found banner
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/breast-cancer?cfg=0&pn=41"
		Then the user is redirected to "/notrials" with query parameters "p1=breast-cancer"

