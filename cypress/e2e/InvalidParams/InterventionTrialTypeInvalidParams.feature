@invalidParams
Feature: Invalid URL Parameters - Intervention/Trial Type Path

  As a user, when I navigate to an intervention/trial type page with invalid URL parameters,
  I should see an error message and all invalid parameters should be stripped from the URL.

  Background:
    Given "trialListingPageType" is set to "Intervention"
    And "dynamicListingPatterns" object is set to "Intervention"

  Scenario: User views intervention/trial type page with invalid age parameter - string value
    When the user navigates to "/trastuzumab/treatment?a=chicken&pn=1&cfg=1"
    Then the URL should not contain the parameter "a=chicken"
    And invalid criteria error message displays
    And Age text box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"

  Scenario: User views intervention/trial type page with invalid age parameter - over 120
    When the user navigates to "/trastuzumab/treatment?a=130&pn=1&cfg=1"
    Then the URL should not contain the parameter "a=130"
    And invalid criteria error message displays
    And Age text box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"

  Scenario: User views intervention/trial type page with invalid age parameter - negative number
    When the user navigates to "/trastuzumab/treatment?a=-1&pn=1&cfg=1"
    Then the URL should not contain the parameter "a=-1"
    And invalid criteria error message displays
    And Age text box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"

  Scenario: User views intervention/trial type page with invalid Primary Cancer Type c-code
    When the user navigates to "/trastuzumab/treatment?t=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "t=C0000"
    And invalid criteria error message displays
    And Primary Cancer Type combo box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"

  Scenario: User views intervention/trial type page with no Primary Cancer Type and valid Subtype
    When the user navigates to "/trastuzumab/treatment?st=C8287&pn=1&cfg=1"
    Then the URL should not contain the parameter "st=C8287"
    And invalid criteria error message displays
    And Subtype combo box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"

  Scenario: User views intervention/trial type page with no Primary Cancer Type and invalid Subtype
    When the user navigates to "/trastuzumab/treatment?st=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "st=C0000"
    And invalid criteria error message displays
    And Subtype combo box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"

  Scenario: User views intervention/trial type page with valid Primary Cancer Type and invalid Subtype
    When the user navigates to "/trastuzumab/treatment?t=C4872&st=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "t=C4872"
    And the URL should not contain the parameter "st=C0000"
    And invalid criteria error message displays
    And Primary Cancer Type combo box is empty
    And Subtype combo box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"

  Scenario: User views intervention/trial type page with no Primary Cancer Type and valid Stage
    When the user navigates to "/trastuzumab/treatment?stg=C139541&pn=1&cfg=1"
    Then the URL should not contain the parameter "stg=C139541"
    And invalid criteria error message displays
    And Stage combo box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"

  Scenario: User views intervention/trial type page with no Primary Cancer Type and invalid Stage
    When the user navigates to "/trastuzumab/treatment?stg=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "stg=C0000"
    And invalid criteria error message displays
    And Stage combo box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"

  Scenario: User views intervention/trial type page with valid Primary Cancer Type and invalid Stage
    When the user navigates to "/trastuzumab/treatment?t=C4872&stg=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "t=C4872"
    And the URL should not contain the parameter "stg=C0000"
    And invalid criteria error message displays
    And Primary Cancer Type combo box is empty
    And Stage combo box is empty
    And the page title is "Treatment Clinical Trials Using Trastuzumab"
