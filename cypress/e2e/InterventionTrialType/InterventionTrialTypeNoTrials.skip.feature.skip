Feature: As a user, I should expect a No Trials Found Page to appear when accessing a non-existent page

	Scenario: Navigating to a non-existent page should bring up No Trials Found banner
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		Given the user navigates to "/trastuzumab?cfg=0&pn=4"
		Then the user is redirected to "/notrials" with query parameters "p1=trastuzumab"

