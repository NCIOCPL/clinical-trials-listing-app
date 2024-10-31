#Feature: Direct Filter Navigation
#
#	Scenario: Age filter is correctly applied when navigating directly to URL
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		When the user navigates to "/breast-cancer?a=65&cfg=0"
#		Then the age filter shows "65"
#		And the "Clear Filters" button is enabled
#		And the "Apply Filters" button is disabled
#		And the system displays filtered trial results
#		And the page maintains "a=65" in the URL
#
#	Scenario: Location filters are correctly applied when navigating directly to URL
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		When the user navigates to "/breast-cancer?z=20850&zr=50&cfg=0"
#		Then the zip code filter shows "20850"
#		And the radius dropdown shows "50"
#		And the "Clear Filters" button is enabled
#		And the "Apply Filters" button is disabled
#		And the system displays filtered trial results
#		And the page maintains "z=20850" in the URL
#		And the page maintains "zr=50" in the URL
#
#	Scenario: Multiple filters are correctly applied when navigating directly to URL
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		When the user navigates to "/breast-cancer?a=65&z=20850&zr=50&cfg=0"
#		Then the age filter shows "65"
#		And the zip code filter shows "20850"
#		And the radius dropdown shows "50"
#		And the "Clear Filters" button is enabled
#		And the "Apply Filters" button is disabled
#		And the system displays filtered trial results
#		And the page maintains "a=65" in the URL
#		And the page maintains "z=20850" in the URL
#		And the page maintains "zr=50" in the URL
#
#	Scenario: Filter state persists after pagination when navigating directly to URL with filters
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		When the user navigates to "/breast-cancer?a=65&z=20850&zr=50&cfg=0"
#		And clicks on "Next" button
#		Then the age filter shows "65"
#		And the zip code filter shows "20850"
#		And the radius dropdown shows "50"
#		And the "Clear Filters" button is enabled
#		And the "Apply Filters" button is disabled
#		And the page maintains "a=65" in the URL
#		And the page maintains "z=20850" in the URL
#		And the page maintains "zr=50" in the URL
#
#	Scenario: Invalid filter values in URL are handled gracefully
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		When the user navigates to "/breast-cancer?a=invalid&z=invalid&zr=invalid&cfg=0"
#		Then the age filter is empty
#		And the zip code filter is empty
#		And the radius dropdown is disabled
#		And the "Clear Filters" button is disabled
#		And the "Apply Filters" button is disabled
#		And the page URL does not include "age"
#		And the page URL does not include "zip"
#		And the page URL does not include "radius"
#
#	Scenario: Partial filter values in URL are handled correctly
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		When the user navigates to "/breast-cancer?z=20850&cfg=0"
#		Then the zip code filter shows "20850"
#		And the radius dropdown shows "100"
#		And the "Clear Filters" button is enabled
#		And the "Apply Filters" button is disabled
#		And the page maintains "z=20850" in the URL
#		And the page maintains "zr=100" in the URL
