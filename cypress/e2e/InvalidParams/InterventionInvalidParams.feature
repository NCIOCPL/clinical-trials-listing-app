@invalidParams
Feature: Invalid URL Parameters - Intervention Path

  As a user, when I navigate to an intervention page with invalid URL parameters,
  I should see an error message and all invalid parameters should be stripped from the URL.

  Background:
    Given "trialListingPageType" is set to "Intervention"
    And "dynamicListingPatterns" object is set to "Intervention"

  Scenario: User views intervention page with invalid age parameter - string value
    When the user navigates to "/trastuzumab?a=chicken&pn=1&cfg=1"
    Then invalid criteria error message displays
    And the URL should not contain the parameter "a=chicken"
    And Age text box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with invalid age parameter - over 120
    When the user navigates to "/trastuzumab?a=130&pn=1&cfg=1"
    Then invalid criteria error message displays
    And the URL should not contain the parameter "a=130"
    And Age text box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with invalid age parameter - negative number
    When the user navigates to "/trastuzumab?a=-1&pn=1&cfg=1"
    Then invalid criteria error message displays
    And the URL should not contain the parameter "a=-1"
    And Age text box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with invalid Primary Cancer Type c-code
    When the user navigates to "/trastuzumab?t=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "t=C0000"
    And invalid criteria error message displays
    And Primary Cancer Type combo box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with no Primary Cancer Type and valid Subtype
    When the user navigates to "/trastuzumab?st=C8287&pn=1&cfg=1"
    Then the URL should not contain the parameter "st=C8287"
    And invalid criteria error message displays
    And Subtype combo box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with no Primary Cancer Type and invalid Subtype
    When the user navigates to "/trastuzumab?st=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "st=C0000"
    And invalid criteria error message displays
    And Subtype combo box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with valid Primary Cancer Type and invalid Subtype
    When the user navigates to "/trastuzumab?t=C4872&st=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "t=C4872"
    And the URL should not contain the parameter "st=C0000"
    And invalid criteria error message displays
    And Primary Cancer Type combo box is empty
    And Subtype combo box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with no Primary Cancer Type and valid Stage
    When the user navigates to "/trastuzumab?stg=C139541&pn=1&cfg=1"
    Then the URL should not contain the parameter "stg=C139541"
    And invalid criteria error message displays
    And Stage combo box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with no Primary Cancer Type and invalid Stage
    When the user navigates to "/trastuzumab?stg=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "stg=C0000"
    And invalid criteria error message displays
    And Stage combo box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with valid Primary Cancer Type and invalid Stage
    When the user navigates to "/trastuzumab?t=C4872&stg=C0000&pn=1&cfg=1"
    Then the URL should not contain the parameter "t=C4872"
    And the URL should not contain the parameter "stg=C0000"
    And invalid criteria error message displays
    And Primary Cancer Type combo box is empty
    And Stage combo box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with invalid ZIP code - too short
    When the user navigates to "/trastuzumab?z=123&zr=100&pn=1&cfg=1"
    Then the URL should not contain the parameter "z=123"
    And the URL should not contain the parameter "zr=100"
    And invalid criteria error message displays
    And ZIP code error message displays
    And ZIP code text box contains "123"
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with invalid ZIP code - contains letters
    When the user navigates to "/trastuzumab?z=1234a&zr=100&pn=1&cfg=1"
    Then the URL should not contain the parameter "z=1234a"
    And the URL should not contain the parameter "zr=100"
    And invalid criteria error message displays
    And ZIP code error message displays
    And ZIP code text box contains "1234a"
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with invalid Primary Cancer Type and valid ZIP code - all params stripped
    When the user navigates to "/trastuzumab?t=C0000&z=22182&zr=100&pn=1&cfg=1"
    Then the URL should not contain the parameter "t=C0000"
    And the URL should not contain the parameter "z=22182"
    And the URL should not contain the parameter "zr=100"
    And invalid criteria error message displays
    And Primary Cancer Type combo box is empty
    And ZIP code text box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with invalid age and valid ZIP code - all params stripped
    When the user navigates to "/trastuzumab?a=chicken&z=22182&zr=100&pn=1&cfg=1"
    Then the URL should not contain the parameter "a=chicken"
    And the URL should not contain the parameter "z=22182"
    And the URL should not contain the parameter "zr=100"
    And invalid criteria error message displays
    And Age text box is empty
    And ZIP code text box is empty
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays

  Scenario: User views intervention page with multiple invalid params including ZIP code
    When the user navigates to "/trastuzumab?t=C0000&a=invalid&z=123&zr=100&pn=1&cfg=1"
    Then the URL should not contain the parameter "t=C0000"
    And the URL should not contain the parameter "a=invalid"
    And the URL should not contain the parameter "z=123"
    And the URL should not contain the parameter "zr=100"
    And invalid criteria error message displays
    And ZIP code error message displays
    And Primary Cancer Type combo box is empty
    And Age text box is empty
    And ZIP code text box contains "123"
    And the page title is "Clinical Trials Using Trastuzumab"
    And intro text displays
    And results count displays
