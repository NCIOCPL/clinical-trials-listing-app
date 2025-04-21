Feature: Filter Buttons Functionality
  Scenario: User can apply filters when loading page without filters
    Given user is viewing the preview site for disease pages
      And user navigates to /breast-cancer?cfg=0
    When user enters 18 in the Age text input
    Then Apply Filters button is enabled
    When user enters 22201 in the Location by ZIP Code text input
      And user selects 50 miles for Radius dropdown
      And user clicks Apply Filters
    Then page reloads at page 1
      And Age text input is 18
      And Location by ZIP Code input is 22201
      And Radius dropdown displays 50 miles
      And page shows 81 trial results
      And Apply Filters button is disabled
      And Clear Filters button is enabled

  Scenario: User can apply filters when loading page with filters and changing them
    Given user is viewing the preview site for disease pages
    When user navigates to /breast-cancer?cfg=0&a=18&z=22201&zr=100
    Then the page loads
      And Age text input has the value 18
      And Location by ZIP Code input has the value 22201
      And Radius dropdown has 100 miles selected
      And page shows 103 trial results
      And Apply Filters button is disabled
    When user enters 35 in the Age text input
      And user selects 50 miles in the Radius dropdown
    Then Apply Filters button becomes enabled
    When user clicks Apply Filters
    Then page reloads at page 1
      And Age text input is 35
      And Location by ZIP Code input is 22201
      And Radius dropdown displays 50 miles
      And page shows 87 trial results
      And Apply Filters button is disabled
      And Clear Filters button is enabled

  Scenario: User applies filters from second page of results
    Given user is viewing the preview site for disease pages
    When user navigates to /breast-cancer?cfg=0&pn=2&a=18&z=22201&zr=100
    Then page loads at page 2 of results
      And Age text input has the value 18
      And Location by ZIP Code input has the value 22201
      And Radius dropdown has 100 miles selected
      And Apply Filters button is disabled
      And page shows 103 trial results
    When user enters 35 in the Age text input
      And user selects 50 miles in the Radius dropdown
    Then Apply Filters button becomes enabled
    When user clicks Apply Filters
    Then the page reloads at page 1
      And Age text input is 35
      And Location by ZIP Code input is 22201
      And Radius dropdown displays 50 miles
      And page shows 87 trial results
      And Apply Filters button is disabled
      And Clear Filters button is enabled

  Scenario: User can clear filters using Clear Filters button when loading page without filters
    Given user is viewing the preview site for disease pages
      And user navigates to /breast-cancer?cfg=0
    When user enters 18 in the Age text input
    Then Clear Filters button is enabled
    When user enters 22201 in the Location by ZIP Code text input
      And user selects 50 miles for Radius dropdown
      And user clicks Clear Filters
    Then page reloads at page 1
      And Age text input is cleared
      And Location by ZIP Code input is cleared
      And Radius dropdown displays Select and is disabled
      And page shows 935 trial results
      And Apply Filters button is disabled
      And Clear Filters button is disabled

  Scenario: User can clear filters using Clear Filters button when loading page with filters
    Given user is viewing the preview site for disease pages
    When user navigates to /breast-cancer?cfg=0&a=18&z=22201&zr=100
    Then the page loads
      And Age text input has the value 18
      And Location by ZIP Code input has the value 22201
      And Radius dropdown has 100 miles selected
      And page shows 103 trial results
      And Clear Filters button is enabled
    When user clicks Clear Filters
    Then page reloads at page 1
      And Age text input is cleared
      And Location by ZIP Code input is cleared
      And Radius dropdown displays Select and is disabled
      And page shows 935 trial results
      And Apply Filters button is disabled
      And Clear Filters button is disabled

  Scenario: User clears filters from second page of results
    Given user is viewing the preview site for disease pages
    When user navigates to /breast-cancer?cfg=0&pn=2&a=18&z=22201&zr=100
    Then page loads at page 2 of results
      And Age text input has the value 18
      And Location by ZIP Code input has the value 22201
      And Radius dropdown has 100 miles selected
      And page shows 103 trial results
      And Clear Filters button is enabled
    When user clicks Clear Filters
    Then the page reloads at page 1
      And Age text input is cleared
      And Location by ZIP Code input is cleared
      And Radius dropdown displays Select and is disabled
      And page shows 935 trial results
      And Apply Filters button is disabled
      And Clear Filters button is disabled

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
