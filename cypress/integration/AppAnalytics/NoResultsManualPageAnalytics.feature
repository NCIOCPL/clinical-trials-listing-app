Feature: Page Load analytics for no trials found Manual Listing Page

    Scenario: Page Load Analytics fires when a user views a manual listing page
        Given "trialListingPageType" is set to "Manual"
        And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
        And "analyticsPublishedDate" is set to "02/02/2011"
        When the user navigates to "/"
        Then the page title is "Clinical Trials for Adult Metastatic Brain Tumors"
        And browser waits
        Then there should be an analytics event with the following details
            | key                                         | value                                                                         |
            | type                                        | PageLoad                                                                      |
            | event                                       | TrialListingApp:Load:Results                                                  |
            | page.name                                   | www.cancer.gov/                                  |
            | page.title                                  | Clinical Trials for Adult Metastatic Brain Tumors                             |
            | page.metaTitle                              | Clinical Trials for Adult Metastatic Brain Tumors - National Cancer Institute |
            | page.language                               | english                                                                       |
            | page.type                                   | nciAppModulePage                                                              |
            | page.channel                                | Clinical Trials                                                               |
            | page.contentGroup                           | Clinical Trials: Custom                                                       |
            | page.publishedDate                          | 02/02/2011                                                                    |
            | page.additionalDetails.numberResults        | (int)0                                                                        |
            | page.additionalDetails.trialListingPageType | manual parameters                                                             |
