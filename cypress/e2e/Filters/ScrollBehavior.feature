@filters
Feature: Scroll Behavior on Filter Changes

  Scenario: Page scrolls to top when applying filters on desktop
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    And screen breakpoint is set to "desktop"
    When the user navigates to "/breast-cancer?cfg=0"
    And the user scrolls down the page
    And the user types "65" into the Age filter input
    And the user waits for the filter to auto-apply
    Then the page should be scrolled to the top

  Scenario: Page maintains scroll position when applying filters on mobile
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    And screen breakpoint is set to "mobile"
    When the user navigates to "/breast-cancer?cfg=0"
    And the user scrolls down the page
    And the user types "65" into the Age filter input
    And the user waits for the filter to auto-apply
    Then the page should maintain its scroll position

  Scenario: Page maintains scroll position when applying filters on tablet
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    And screen breakpoint is set to "tablet"
    When the user navigates to "/breast-cancer?cfg=0"
    And the user scrolls down the page
    And the user types "65" into the Age filter input
    And the user waits for the filter to auto-apply
    Then the page should maintain its scroll position

  Scenario: Page maintains scroll position when clearing filters on mobile
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    And screen breakpoint is set to "mobile"
    When the user navigates to "/breast-cancer?a=65&cfg=0"
    And the user scrolls down the page
    And the user clicks the Clear Filters button
    And the user waits for the filter to auto-apply
    Then the page should maintain its scroll position
