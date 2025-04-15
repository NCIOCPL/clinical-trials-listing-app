Feature: Filter Buttons Functionality

	Scenario: Apply button is disabled by default with no filter changes
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		Then the "Apply Filters" button is disabled
		And the "Clear Filters" button is disabled

	Scenario: Apply button enables when filters are modified
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "65" in the age filter
		Then the "Apply Filters" button is enabled
		When clicks the "Apply Filters" button
		Then the "Apply Filters" button is disabled
		And the "Clear Filters" button is enabled

	Scenario: Clear button enables when filters are applied
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "65" in the age filter
		And clicks the "Apply Filters" button
		Then the "Clear Filters" button is enabled
		When clicks the "Clear Filters" button
		Then the "Clear Filters" button is disabled
		And the "Apply Filters" button is disabled

	Scenario: Multiple filters can be applied together
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "65" in the age filter
		And enters "20850" in the zip code filter
		And selects "50" from the radius dropdown
		Then the "Apply Filters" button is enabled
		When clicks the "Apply Filters" button
		Then the page URL includes "a=65"
		And the page URL includes "z=20850"
		And the page URL includes "zr=50"
		And the "Clear Filters" button is enabled
		And the "Apply Filters" button is disabled

	Scenario: Clear button removes all applied filters
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?a=65&z=20850&zr=50&cfg=0"
		Then the age filter shows "65"
		And the zip code filter shows "20850"
		And the radius dropdown shows "50"
		When clicks the "Clear Filters" button
		Then the age filter is empty
		And the zip code filter is empty
		And the radius dropdown is disabled
		And the page URL does not include "a"
		And the page URL does not include "z"
		And the page URL does not include "zr"

	Scenario: Apply button stays disabled after applying filters until new changes
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "65" in the age filter
		And clicks the "Apply Filters" button
		Then the "Apply Filters" button is disabled
		When enters "70" in the age filter
		Then the "Apply Filters" button is enabled

	Scenario: Button states persist during page navigation
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "65" in the age filter
		And clicks the "Apply Filters" button
		And clicks on "Next" button
		Then the "Clear Filters" button is enabled
		And the "Apply Filters" button is disabled
