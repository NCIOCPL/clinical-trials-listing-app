Feature: Disease trial type listing page analytics

  Scenario: Page Load Analytics fires when a user views a disease listing page
    Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When the user navigates to "/breast-cancer/supportive-care?cfg=0"
    Then the page title is "Supportive Care Clinical Trials for Breast Cancer"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                         | value                                                                           |
      | event                                       | TrialListingApp:Load:Results                                                    |
      | type                                        | PageLoad                                                                        |
      | page.publishedDate                          | 02/02/2011                                                                      |
      | page.contentGroup                           | Clinical Trials: Custom                                                         |
      | page.name                                   | www.cancer.gov/breast-cancer/supportive-care						                        |
      | page.title                                  | Supportive Care Clinical Trials for Breast Cancer 								              |
      | page.channel                                | Clinical Trials                                                                 |
      | page.type                                   | nciAppModulePage                                                                |
      | page.language                               | english                                                                         |
      | page.metaTitle                              | Supportive Care Clinical Trials for Breast Cancer - National Cancer Institute 	|
      | page.additionalDetails.diseaseName          | breast cancer                                                                   |
      | page.additionalDetails.trialType            | supportive care                                                                 |
      | page.additionalDetails.trialListingPageType | disease                                                                         |
      | page.additionalDetails.numberResults        | (int)140                                                                        |

  Scenario: Click event fires when a user clicks on result item
    Given "trialListingPageType" is set to "Disease"
    And "dynamicListingPatterns" object is set to "Disease"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When the user navigates to "/breast-cancer/supportive-care?cfg=0"
    Then the page title is "Supportive Care Clinical Trials for Breast Cancer"
    When user clicks on result item 1
    Then there should be an analytics event with the following details
      | key              | value                             |
      | type             | Other                             |
      | event            | TrialListingApp:Other:ResultClick |
      | linkName         | CTSLink                           |
      | data.resultIndex | (int)1                            |
      | data.currentPage | (int)1                            |


