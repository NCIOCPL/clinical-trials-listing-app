@filters
Feature: Age Filter

#	Scenario: User is able to interact with Age parameter on disease pages - mouse
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		Given the user navigates to "/breast-cancer?cfg=0"
#    Then Age filter displays in the Filter Trials section
##    And Age filter is a text input
#    And Age filter extends the width of the container on all breakpoints
#    And Age filter only allows numbers in the text input
#    When user hovers on the text input
#    Then up and down arrows display on the right of the text input
#    When user clicks the up arrow
#    Then number in the text input increases by 1
#    When user clicks the down arrow
#    Then number in the text input decreases by 1
#    When user clicks the up arrow
#    Then number in the text input increases by 1
#    When user clicks the down arrow
#    Then number in the text input decreases by 1

#  Scenario: User is able to interact with Age parameter on disease pages - keyboard
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		Given the user navigates to "/breast-cancer?cfg=0"
#    Then Age filter displays in the Filter Trials section
##      And Age filter is a text input
#      And Age filter extends the width of the container on all breakpoints
#      And Age filter only allows numbers in the text input
#    When user tabs to the text input
#    Then up and down arrows display on the right of the text input
#    When user hits the up arrow key
#    Then number in the text input increases by 1
#    When user hits the down arrow key
#    Then number in the text input decreases by 1
#    When user types a number in the text input
    # Then up and down arrows display on the right of the text input
#    When user hits the up arrow key
#    Then number in the text input increases by 1
#    When user hits the down arrow key
#    Then number in the text input decreases by 1

  Scenario: User is unable to enter characters in Age text input on disease pages
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/breast-cancer?cfg=0"
    Then Age filter displays in the Filter Trials section
#      And Age filter is a text input
      And Age filter only allows numbers in the text input
    When user types non-numeric characters in the text input
    Then the characters will not be entered

#  Scenario: User is unable to enter an age <0 or >120 in Age text input on disease pages - mouse
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		Given the user navigates to "/breast-cancer?cfg=0"
#      And user has typed 0 in the text input
#    When user clicks the down arrow
#    Then 0 remains in the text input
#    When user enters 120 in the text input and clicks the up arrow
#    Then 120 remains in the text input
#    When user tries to type 121 in the text input
#    Then the text input will not allow the last number to be typed
#    When user tries to type 130 in the text input
#    Then the text input will not allow the last number to be typed

#  Scenario: User is unable to enter an age <0 or >120 in Age text input on disease pages - keyboard
#		Given "trialListingPageType" is set to "Disease"
#		And "dynamicListingPatterns" object is set to "Disease"
#		Given the user navigates to "/breast-cancer?cfg=0"
#		When user enters 0 and hits the down arrow key
#    Then 0 remains in the text input
#    When user enters 120 in the text input and hits the up arrow key
#    Then 120 remains in the text input
#    When user tries to type 121 in the text input
#    Then the text input will not allow the last number to be typed
#    When user tries to type 130 in the text input
#    Then the text input will not allow the last number to be typed

Scenario: Age filter input field is visible
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    Given the user navigates to "/breast-cancer?cfg=0"
    Then the user sees the "Age" filter input

  Scenario: Entering a valid age and applying filters updates the URL
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    Given the user navigates to "/breast-cancer?cfg=0"
    When the user types "45" into the Age filter input
    And the user clicks the "Apply Filters" button
    Then the URL should contain the parameter "a=45"

		 # Start with age filter applied
  Scenario: Clearing the age filter removes the parameter from the URL
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    Given the user navigates to "/breast-cancer?a=50&cfg=0"
    When the user clears the "Age" filter input
    And the user clicks the "Apply Filters" button
    Then the URL should not contain the parameter "a="
