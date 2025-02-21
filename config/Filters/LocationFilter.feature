Feature: Location Filter Functionality

	Scenario: Location filter displays correctly
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		Then the location filter components are displayed
		And the zip code input placeholder text is "Enter U.S. Zip Code"
		And the radius dropdown is disabled
		And the radius dropdown has the following options
			| label      | value |
			| 20 miles  | 20    |
			| 50 miles  | 50    |
			| 100 miles | 100   |
			| 200 miles | 200   |
			| 500 miles | 500   |

	Scenario: Radius dropdown enables when zip code is entered
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		Then the radius dropdown is disabled
		When enters "20850" in the zip code filter
		Then the radius dropdown is enabled
		And the radius dropdown shows "100" as default value

	Scenario: Location filter updates results when applied
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "20850" in the zip code filter
		And selects "50" from the radius dropdown
		And clicks the "Apply Filters" button
		Then the page URL includes "z=20850"
		And the page URL includes "zr=50"
		And the system displays updated trial results
		And "Clear Filters" button is enabled

	Scenario: Location filter clears correctly
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?z=20850&zr=50&cfg=0"
		Then the zip code filter shows "20850"
		And the radius dropdown shows "50"
		When clicks the "Clear Filters" button
		Then the zip code filter is empty
		And the radius dropdown is disabled
		And the page URL does not include "z"
		And the page URL does not include "zr"
		And "Clear Filters" button is disabled

	Scenario: Location filter validates zip code format
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "abcde" in the zip code filter
		Then the radius dropdown remains disabled
		When enters "1234" in the zip code filter
		Then the radius dropdown remains disabled
		When enters "20850" in the zip code filter
		Then the radius dropdown is enabled
		And the radius dropdown shows "100" as default value

	Scenario: Location filter persists across page navigation
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "20850" in the zip code filter
		And selects "50" from the radius dropdown
		And clicks the "Apply Filters" button
		And clicks on "Next" button
		Then the zip code filter shows "20850"
		And the radius dropdown shows "50"
		And the page URL includes "z=20850"
		And the page URL includes "zr=50"
