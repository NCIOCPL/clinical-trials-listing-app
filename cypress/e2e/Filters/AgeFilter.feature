Feature: Age Filter Functionality

	Scenario: Age filter displays correctly on Disease page
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		Then the age filter is displayed
		And the age filter has a numeric input
		And the age input placeholder text is "Enter the age of the participant."

	Scenario: Age filter updates results when applied
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "65" in the age filter
		And clicks the "Apply Filters" button
		Then the page URL includes "age=65"
		And the system displays updated trial results
		And "Clear All" button is enabled

	Scenario: Age filter clears correctly
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?age=65&cfg=0"
		Then the age filter shows "65"
		When clicks the "Clear All" button
		Then the age filter is empty
		And the page URL does not include "age"
		And "Clear All" button is disabled

	Scenario: Age filter validates input range
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "-1" in the age filter
		Then the age input value remains empty
		When enters "121" in the age filter
		Then the age input value remains empty
		When enters "50" in the age filter
		Then the age input value is "50"

	Scenario: Age filter persists across page navigation
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "65" in the age filter
		And clicks the "Apply Filters" button
		And clicks on "Next" button
		Then the age filter shows "65"
		And the page URL includes "age=65"
