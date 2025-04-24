@smoke
Feature: NoTrials Page analytics

  Scenario: Page Load Analytics fires when a user views the No Trials Found page for a disease
    Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When the user navigates to "/C3037"
    Then the page title is "Chronic Fatigue Syndrome Clinical Trials"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                         | value                                                                |
      | type                                        | PageLoad                                                             |
      | event                                       | TrialListingApp:Load:NoTrialsFound                                   |
      | page.name                                   | www.cancer.gov/notrials                                              |
      | page.title                                  | Chronic Fatigue Syndrome Clinical Trials                             |
      | page.metaTitle                              | Chronic Fatigue Syndrome Clinical Trials - National Cancer Institute |
      | page.language                               | english                                                              |
      | page.type                                   | nciAppModulePage                                                     |
      | page.channel                                | Clinical Trials                                                      |
      | page.contentGroup                           | Clinical Trials: Custom                                              |
      | page.publishedDate                          | 02/02/2011                                                           |
      | page.additionalDetails.numberResults        | (int)0                                                               |
      | page.additionalDetails.trialListingPageType | disease                                                              |
      | page.additionalDetails.diseaseName          | chronic fatigue syndrome                                             |

	Scenario: Page Load Analytics fires when a user views the No Trials Found page for a disease and trial type
    Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When the user navigates to "/C3037/supportive-care"
    Then the page title is "Supportive Care Clinical Trials for Chronic Fatigue Syndrome"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                         | value                                                                							 			 |
      | type                                        | PageLoad                                                             							 			 |
      | event                                       | TrialListingApp:Load:NoTrialsFound                                   							 			 |
      | page.name                                   | www.cancer.gov/notrials                                              							 			 |
      | page.title                                  | Supportive Care Clinical Trials for Chronic Fatigue Syndrome                             |
      | page.metaTitle                              | Supportive Care Clinical Trials for Chronic Fatigue Syndrome - National Cancer Institute |
      | page.language                               | english                                                              							 			 |
      | page.type                                   | nciAppModulePage                                                     							 			 |
      | page.channel                                | Clinical Trials                                                      							 			 |
      | page.contentGroup                           | Clinical Trials: Custom                                              							 			 |
      | page.publishedDate                          | 02/02/2011                                                           							 			 |
      | page.additionalDetails.numberResults        | (int)0                                                               							 			 |
      | page.additionalDetails.trialListingPageType | disease                                                              							 			 |
      | page.additionalDetails.diseaseName          | chronic fatigue syndrome                                             							 			 |
			| page.additionalDetails.trialType	          | supportive care								                                             							 |

	Scenario: Page Load Analytics fires when a user views the No Trials Found page for disease, trial type, and intervention
    Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When the user navigates to "/C3037/treatment/trastuzumab"
    Then the page title is "Treatment Clinical Trials for Chronic Fatigue Syndrome Using Trastuzumab"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                         | value                                                                							 									 |
      | type                                        | PageLoad                                                             							 									 |
      | event                                       | TrialListingApp:Load:NoTrialsFound                                   							 									 |
      | page.name                                   | www.cancer.gov/notrials                                              							 									 |
      | page.title                                  | Treatment Clinical Trials for Chronic Fatigue Syndrome Using Trastuzumab                             |
      | page.metaTitle                              | Treatment Clinical Trials for Chronic Fatigue Syndrome Using Trastuzumab - National Cancer Institute |
      | page.language                               | english                                                              							 									 |
      | page.type                                   | nciAppModulePage                                                     							 									 |
      | page.channel                                | Clinical Trials                                                      							 									 |
      | page.contentGroup                           | Clinical Trials: Custom                                              							 									 |
      | page.publishedDate                          | 02/02/2011                                                           							 									 |
      | page.additionalDetails.numberResults        | (int)0                                                               							 									 |
      | page.additionalDetails.trialListingPageType | disease                                                              							 									 |
      | page.additionalDetails.diseaseName          | chronic fatigue syndrome                                             							 									 |
			| page.additionalDetails.trialType	          | treatment								                                             							 									 |
			| page.additionalDetails.interventionName	    | trastuzumab								                                             							 								 |

  Scenario: Page Load Analytics fires when a user views the No Trials Found page for an intervention
    Given "trialListingPageType" is set to "Intervention"
    And "dynamicListingPatterns" object is set to "Intervention"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "siteName" is set to "National Cancer Institute"
    When the user navigates to "/C1234"
    Then the page title is "Clinical Trials Using Spiroplatin"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                         | value                                                         |
      | type                                        | PageLoad                                                      |
      | event                                       | TrialListingApp:Load:NoTrialsFound                            |
      | page.name                                   | www.cancer.gov/notrials                                       |
      | page.title                                  | Clinical Trials Using Spiroplatin                             |
      | page.metaTitle                              | Clinical Trials Using Spiroplatin - National Cancer Institute |
      | page.language                               | english                                                       |
      | page.type                                   | nciAppModulePage                                              |
      | page.channel                                | Clinical Trials                                               |
      | page.contentGroup                           | Clinical Trials: Custom                                       |
      | page.publishedDate                          | 02/02/2011                                                    |
      | page.additionalDetails.trialListingPageType | intervention                                                  |
      | page.additionalDetails.interventionName     | spiroplatin                                                   |
      | page.additionalDetails.numberResults        | (int)0                                                        |

  Scenario: Page Load Analytics fires when a user views the No Trials Found page for an intervention trial type
    Given "trialListingPageType" is set to "Intervention"
    And "dynamicListingPatterns" object is set to "Intervention"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "siteName" is set to "National Cancer Institute"
    When the user navigates to "/C1234/treatment"
    Then the page title is "Treatment Clinical Trials Using Spiroplatin"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                         | value                                                                   |
      | type                                        | PageLoad                                                                |
      | event                                       | TrialListingApp:Load:NoTrialsFound                                      |
      | page.name                                   | www.cancer.gov/notrials                                                 |
      | page.title                                  | Treatment Clinical Trials Using Spiroplatin                             |
      | page.metaTitle                              | Treatment Clinical Trials Using Spiroplatin - National Cancer Institute |
      | page.language                               | english                                                                 |
      | page.type                                   | nciAppModulePage                                                        |
      | page.channel                                | Clinical Trials                                                         |
      | page.contentGroup                           | Clinical Trials: Custom                                                 |
      | page.publishedDate                          | 02/02/2011                                                              |
      | page.additionalDetails.trialListingPageType | intervention                                                            |
      | page.additionalDetails.interventionName     | spiroplatin                                                             |
      | page.additionalDetails.trialType            | treatment                                                               |
      | page.additionalDetails.numberResults        | (int)0                                                                  |
