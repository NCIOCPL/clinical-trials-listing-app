Feature: Mobile Accordion Functionality

	Scenario: Filters section starts expanded on desktop
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And screen breakpoint is set to "desktop"
		When the user navigates to "/breast-cancer?cfg=0"
		Then the filter content is visible
		And the filter button does not show expand/collapse icon

	Scenario: Filters section starts collapsed on mobile
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And screen breakpoint is set to "mobile"
		When the user navigates to "/breast-cancer?cfg=0"
		Then the filter content is hidden
		And the filter button shows expand icon

	Scenario: Clicking filter button toggles content visibility on mobile
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And screen breakpoint is set to "mobile"
		When the user navigates to "/breast-cancer?cfg=0"
		Then the filter content is hidden
		When clicks the filter toggle button
		Then the filter content is visible
		And the filter button shows collapse icon
		When clicks the filter toggle button
		Then the filter content is hidden
		And the filter button shows expand icon

	Scenario: Filter section maintains visibility state after applying filters on mobile
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And screen breakpoint is set to "mobile"
		When the user navigates to "/breast-cancer?cfg=0"
		And clicks the filter toggle button
		And enters "65" in the age filter
		And clicks the "Apply Filters" button
		Then the filter content remains visible
		And the filter button shows collapse icon

	Scenario: Filter section maintains visibility state after clearing filters on mobile
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And screen breakpoint is set to "mobile"
		When the user navigates to "/breast-cancer?age=65&cfg=0"
		And clicks the filter toggle button
		And clicks the "Clear All" button
		Then the filter content remains visible
		And the filter button shows collapse icon

	Scenario: Filter section state persists during page navigation on mobile
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And screen breakpoint is set to "mobile"
		When the user navigates to "/breast-cancer?cfg=0"
		And clicks the filter toggle button
		And enters "65" in the age filter
		And clicks the "Apply Filters" button
		And clicks on "Next" button
		Then the filter content remains visible
		And the age filter shows "65"
		And the filter button shows collapse icon
