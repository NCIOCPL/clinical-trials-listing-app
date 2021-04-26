Feature: As a user when I visit a non existent trial listing page I am presented with page not found

    Scenario: Disease 404: Page Not Found displays when a user views a dynamic listing page with invalid disease c-code
        Given "trialListingPageType" is set to "Disease"
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

    Scenario: Intervention 404: Page Not Found displays when a user views a dynamic listing page with invalid disease c-code
        Given "trialListingPageType" is set to "Intervention"
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


    Scenario: Intervention 404: Page Not Found displays when a user views a dynamic listing page with invalid pretty url
        Given "trialListingPageType" is set to "Intervention"
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
