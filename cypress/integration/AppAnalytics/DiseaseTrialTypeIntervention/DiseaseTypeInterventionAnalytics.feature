Feature: Disease trial type intervention listing page analytics

  Scenario: Page Load Analytics fires when a user views a disease listing page
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When the user navigates to "/breast-cancer/treatment/trastuzumab?cfg=0"
    Then the page title is "Treatment Clinical Trials for Breast Cancer Using Trastuzumab"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                         | value                                                                                     |
      | event                                       | TrialListingApp:Load:Results                                                              |
      | type                                        | PageLoad                                                                                  |
      | page.publishedDate                          | 02/02/2011                                                                                |
      | page.contentGroup                           | Clinical Trials: Custom                                                                   |
      | page.name                                   | www.cancer.gov/breast-cancer/treatment/trastuzumab                                        |
      | page.title                                  | Treatment Clinical Trials for Breast Cancer Using Trastuzumab                             |
      | page.channel                                | Clinical Trials                                                                           |
      | page.type                                   | nciAppModulePage                                                                          |
      | page.language                               | english                                                                                   |
      | page.metaTitle                              | Treatment Clinical Trials for Breast Cancer Using Trastuzumab - National Cancer Institute |
      | page.additionalDetails.diseaseName          | breast cancer                                                                             |
      | page.additionalDetails.trialType            | treatment                                                                                 |
      | page.additionalDetails.interventionName     | trastuzumab                                                                               |
      | page.additionalDetails.trialListingPageType | disease                                                                                   |
      | page.additionalDetails.numberResults        | (int)41                                                                                   |

  Scenario: Click event fires when a user clicks on result item
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When the user navigates to "/breast-cancer/treatment/trastuzumab?cfg=0"
    Then the page title is "Treatment Clinical Trials for Breast Cancer Using Trastuzumab"
    When user clicks on result item 1
    Then there should be an analytics event with the following details
      | key              | value                             |
      | type             | Other                             |
      | event            | TrialListingApp:Other:ResultClick |
      | linkName         | CTSLink                           |
      | data.resultIndex | (int)1                            |
      | data.currentPage | (int)1                            |


