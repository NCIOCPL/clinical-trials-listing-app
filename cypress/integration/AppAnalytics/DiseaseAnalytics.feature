Feature: Disease listing page analytics

    Scenario: Page Load Analytics fires when a user views a disease listing page
        Given "trialListingPageType" is set to "Disease"
        And "pageTitle" is set to "{{disease_label}} Clinical Trials"
        And "analyticsPublishedDate" is set to "02/02/2011"
        When the user navigates to "/C4872?cfg=0"
        Then the page title is "Breast Cancer Clinical Trials"
        And browser waits
        Then there should be an analytics event with the following details
            | key                                         | value                                                      |
            | type                                        | PageLoad                                                   |
            | event                                       | TrialListingApp:Load:Results                               |
            | page.name                                   | www.cancer.gov/C4872                                       |
            | page.title                                  | Breast Cancer Clinical Trials     							           |
            | page.metaTitle                              | Breast Cancer Clinical Trials - National Cancer Institute  |
            | page.language                               | english                                                    |
            | page.type                                   | nciAppModulePage                                           |
            | page.channel                                | Clinical Trials                                            |
            | page.contentGroup                           | Clinical Trials: Custom                                    |
            | page.publishedDate                          | 02/02/2011                                                 |
            | page.additionalDetails.numberResults        | (int)925                                                   |
            | page.additionalDetails.trialListingPageType | disease					                                           |
						| page.additionalDetails.diseaseName			    | breast cancer		                                           |
