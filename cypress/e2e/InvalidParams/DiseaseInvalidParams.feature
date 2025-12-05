@invalidParams
Feature: Invalid URL Parameters - Disease Path

  As a user, when I navigate to a disease page with invalid URL parameters,
  I should see an error message and all invalid parameters should be stripped from the URL.

  Background:
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"

  Scenario: User views disease page with invalid Drug/Drug Family c-code
    When the user navigates to "/breast-cancer?d=C0000&pn=1&cfg=0"
    Then the URL should not contain the parameter "d=C0000"
    And invalid criteria error message displays
    And the page title is "Breast Cancer Clinical Trials"
