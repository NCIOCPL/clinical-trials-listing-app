@invalidParams
Feature: Invalid URL Parameters - Disease/Trial Type Path

  As a user, when I navigate to a disease/trial type page with invalid URL parameters,
  I should see an error message and all invalid parameters should be stripped from the URL.

  Background:
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"

  Scenario: User views disease/trial type page with invalid Drug/Drug Family c-code
    When the user navigates to "/breast-cancer/treatment?d=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "d=C0000"
    And invalid criteria error message displays
    And the page title is "Treatment Clinical Trials for Breast Cancer"
