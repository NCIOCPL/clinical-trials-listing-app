@misc
Feature: As a user when I visit a non existent trial listing page I am presented with page not found

    Scenario: Disease 404: Page Not Found displays when a user views a dynamic listing page with invalid disease c-code
        Given "trialListingPageType" is set to "Disease"
        And "dynamicListingPatterns" object is set to "Disease"
        When user navigates to non-existent page "/c123455?cfg=0"
        And page title is "Page Not Found"
        And the text "We can't find the page you're looking for." appears on the page
        And the following links and texts exist on the page
            | https://www.cancer.gov         | homepage     |
            | https://www.cancer.gov/types   | cancer type  |
            | https://www.cancer.gov/contact | Get in touch |
        And the search bar appears below
        Then the title tag should be "Page Not Found"
        And the page contains meta tags with the following names
            | name                  | content |
            | prerender-status-code | 404     |


    Scenario: Disease 404: Page Not Found displays when a user views a dynamic listing page with invalid pretty url
        Given "trialListingPageType" is set to "Disease"
        And "dynamicListingPatterns" object is set to "Disease"
        When user navigates to non-existent page "/chicken-nuggets?cfg=0"
        And page title is "Page Not Found"
        And the text "We can't find the page you're looking for." appears on the page
        And the following links and texts exist on the page
            | https://www.cancer.gov         | homepage     |
            | https://www.cancer.gov/types   | cancer type  |
            | https://www.cancer.gov/contact | Get in touch |
        And the search bar appears below
        Then the title tag should be "Page Not Found"
        And the page contains meta tags with the following names
            | name                  | content |
            | prerender-status-code | 404     |

    Scenario: Intervention 404: Page Not Found displays when a user views a dynamic listing page with invalid intervention c-code
        Given "trialListingPageType" is set to "Intervention"
        And "dynamicListingPatterns" object is set to "Intervention"
        When user navigates to non-existent page "/c123455?cfg=1"
        And page title is "Page Not Found"
        And the text "We can't find the page you're looking for." appears on the page
        And the following links and texts exist on the page
            | https://www.cancer.gov         | homepage     |
            | https://www.cancer.gov/types   | cancer type  |
            | https://www.cancer.gov/contact | Get in touch |
        And the search bar appears below
        Then the title tag should be "Page Not Found"
        And the page contains meta tags with the following names
            | name                  | content |
            | prerender-status-code | 404     |


    Scenario: Intervention 404: Page Not Found displays when a user views a dynamic listing page with invalid intervention pretty url
        Given "trialListingPageType" is set to "Intervention"
        And "dynamicListingPatterns" object is set to "Intervention"
        When user navigates to non-existent page "/chicken-nuggets?cfg=1"
        And page title is "Page Not Found"
        And the text "We can't find the page you're looking for." appears on the page
        And the following links and texts exist on the page
            | https://www.cancer.gov         | homepage     |
            | https://www.cancer.gov/types   | cancer type  |
            | https://www.cancer.gov/contact | Get in touch |
        And the search bar appears below
        Then the title tag should be "Page Not Found"
        And the page contains meta tags with the following names
            | name                  | content |
            | prerender-status-code | 404     |


    ############ Disease Trial Type ###############

    Scenario Outline: Disease 404: Page Not Found displays when a user views a Disease Trial Type dynamic listing page with invalid params
        Given "trialListingPageType" is set to "Disease"
        And "dynamicListingPatterns" object is set to "Disease"
        When user navigates to non-existent page "<url>"
        And page title is "Page Not Found"
        And the text "We can't find the page you're looking for." appears on the page
        And the following links and texts exist on the page
            | https://www.cancer.gov         | homepage     |
            | https://www.cancer.gov/types   | cancer type  |
            | https://www.cancer.gov/contact | Get in touch |
        And the search bar appears below
        Then the title tag should be "Page Not Found"
        And the page contains meta tags with the following names
            | name                  | content |
            | prerender-status-code | 404     |

        Examples:
            | url                          |
            | /c123455/treat?cfg=0         |
            | /C4872/treat?cfg=0           |
            | /breast-cancer/treat?cfg=0   |
            | /chicken-nuggets/treat?cfg=0 |

    ############ Disease Trial Type Intervention ###############

    Scenario Outline: Disease 404: Page Not Found displays when a user views a Disease Trial Type Intervention dynamic listing page with invalid params
        Given "trialListingPageType" is set to "Disease"
        And "dynamicListingPatterns" object is set to "Disease"
        When user navigates to non-existent page "<url>"
        And page title is "Page Not Found"
        And the text "We can't find the page you're looking for." appears on the page
        And the following links and texts exist on the page
            | https://www.cancer.gov         | homepage     |
            | https://www.cancer.gov/types   | cancer type  |
            | https://www.cancer.gov/contact | Get in touch |
        And the search bar appears below
        Then the title tag should be "Page Not Found"
        And the page contains meta tags with the following names
            | name                  | content |
            | prerender-status-code | 404     |

        Examples:
            | url                                              |
            | /c123455/treatment/trastuzumab?cfg=0             |
            | /C4872/treat/trastuzumab?cfg=0                   |
            | /C4872/treatment/chicken-nuggets?cfg=0           |
            | /chicken-nuggets/treatment/chicken-nuggets?cfg=0 |
            | /chicken-nuggets/treat/chicken-nuggets?cfg=0     |
            | /c123455/treatment/chicken-nuggets?cfg=0         |

    ############  Intervention Trial Type  ###############

    Scenario Outline: Disease 404: Page Not Found displays when a user views a dynamic listing page with invalid params
        Given "trialListingPageType" is set to "Intervention"
        And "dynamicListingPatterns" object is set to "Intervention"
        When user navigates to non-existent page "<url>"
        And page title is "Page Not Found"
        And the text "We can't find the page you're looking for." appears on the page
        And the following links and texts exist on the page
            | https://www.cancer.gov         | homepage     |
            | https://www.cancer.gov/types   | cancer type  |
            | https://www.cancer.gov/contact | Get in touch |
        And the search bar appears below
        Then the title tag should be "Page Not Found"
        And the page contains meta tags with the following names
            | name                  | content |
            | prerender-status-code | 404     |

        Examples:
            | url                       |
            | /c123455/diagnostic?cfg=1 |
            | /C4872/treat?cfg=1        |
            | /trastuzumab/treat?cfg=1  |
            | /c123455/treat?cfg=1      |
