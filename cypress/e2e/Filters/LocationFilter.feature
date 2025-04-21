Feature: Location Filter Functionality

	Scenario: Location filter displays correctly
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		Then the location filter components are displayed
		And the zip code input placeholder text is "Enter U.S. ZIP Code"
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

	Scenario: Location filter should only update results after Apply button is clicked
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And captures the current trial results
		And enters "1234" in the zip code filter
		Then the zip code field shows validation error
		And the trial results remain unchanged
		When enters "20850" in the zip code filter
		Then the radius dropdown is enabled
		And the trial results still remain unchanged
		When clicks the "Apply Filters" button
		Then the page URL includes "z=20850"
		And the page URL includes "zr=100"
		And the trial results are updated

  Scenario: ZIP Code input enforces 5-character limit
    Given user is viewing the preview site for disease pages
    When the user navigates to "/breast-cancer?cfg=0"
    Then Location by ZIP Code filter displays in the Filter Trials section
      And Location by ZIP Code filter is a text input
    When user tries to type "100000" in the zip code filter
    Then the zip code input value is "10000"
      And the zip code input does not accept further input

  Scenario: User can select Radius using mouse after entering ZIP
    Given user is viewing the preview site for disease pages
    When the user navigates to "/breast-cancer?cfg=0"
    Then Radius filter displays in the Filter Trials section
      And Radius filter is a dropdown
      And Radius filter is disabled
    When user enters "20850" in the zip code filter
    Then the Radius filter becomes enabled
      And Radius filter has the options 20 miles, 50 miles, 100 miles, 200 miles, 500 miles
      And the radius dropdown shows "100" as default value
    When user clicks on the Radius dropdown
      And user selects "20 miles" from the Radius dropdown options
    Then the radius dropdown shows "20"
    When user clicks on the Radius dropdown
      And user selects "500 miles" from the Radius dropdown options
    Then the radius dropdown shows "500"

  Scenario: User can select Radius using keyboard after entering ZIP
    Given the user navigates to "/breast-cancer?cfg=0"
    When user enters "20850" in the zip code filter
    Then Radius filter becomes enabled
      And the radius dropdown shows "100" as default value
    When user tabs to the Radius filter
      And user hits the down arrow key
    Then the radius dropdown shows "200"
    When user hits the up arrow key twice
    Then the radius dropdown shows "50"
