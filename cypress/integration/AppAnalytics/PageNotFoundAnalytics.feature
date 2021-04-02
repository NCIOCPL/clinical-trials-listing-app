Feature: Analytics Page Not Found

	Scenario: Page Load Analytics fires for a 404 on a disease dynamic listing page with no parameters
		Given "trialListingPageType" is set to "Disease"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When the user navigates to "/"
		And page title on error page is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                             |
			| type                                        | PageLoad                          |
			| event                                       | TrialListingApp:Load:PageNotFound |
			| page.name                                   | www.cancer.gov/                   |
			| page.title                                  | Page Not Found                    |
			| page.metaTitle                              | Page Not Found                    |
			| page.language                               | english                           |
			| page.type                                   | nciAppModulePage                  |
			| page.channel                                | Clinical Trials                   |
			| page.contentGroup                           | Clinical Trials: Custom           |
			| page.publishedDate                          | 02/02/2011                        |
			| page.additionalDetails.trialListingPageType | disease                           |

	Scenario: Page Load Analytics fires for a 404 on a intervention dynamic listing page with no parameters
		Given "trialListingPageType" is set to "Intervention"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When the user navigates to "/"
		And page title on error page is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                             |
			| type                                        | PageLoad                          |
			| event                                       | TrialListingApp:Load:PageNotFound |
			| page.name                                   | www.cancer.gov/                   |
			| page.title                                  | Page Not Found                    |
			| page.metaTitle                              | Page Not Found                    |
			| page.language                               | english                           |
			| page.type                                   | nciAppModulePage                  |
			| page.channel                                | Clinical Trials                   |
			| page.contentGroup                           | Clinical Trials: Custom           |
			| page.publishedDate                          | 02/02/2011                        |
			| page.additionalDetails.trialListingPageType | intervention                      |

	Scenario: Page Load Analytics fires for a 404 on a disease dynamic listing page with non-existent c-code
		Given "trialListingPageType" is set to "Disease"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When user navigates to non-existent page "/c123455?cfg=0"
		And page title is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                             |
			| type                                        | PageLoad                          |
			| event                                       | TrialListingApp:Load:PageNotFound |
			| page.name                                   | www.cancer.gov/c123455            |
			| page.title                                  | Page Not Found                    |
			| page.metaTitle                              | Page Not Found                    |
			| page.language                               | english                           |
			| page.type                                   | nciAppModulePage                  |
			| page.channel                                | Clinical Trials                   |
			| page.contentGroup                           | Clinical Trials: Custom           |
			| page.publishedDate                          | 02/02/2011                        |
			| page.additionalDetails.trialListingPageType | disease                           |

	Scenario: Page Load Analytics fires for a 404 on a disease dynamic listing page with non-existent pretty-url
		Given "trialListingPageType" is set to "Disease"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When user navigates to non-existent page "/chicken-nuggets?cfg=0"
		And page title is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                             |
			| type                                        | PageLoad                          |
			| event                                       | TrialListingApp:Load:PageNotFound |
			| page.name                                   | www.cancer.gov/chicken-nuggets     |
			| page.title                                  | Page Not Found                    |
			| page.metaTitle                              | Page Not Found                    |
			| page.language                               | english                           |
			| page.type                                   | nciAppModulePage                  |
			| page.channel                                | Clinical Trials                   |
			| page.contentGroup                           | Clinical Trials: Custom           |
			| page.publishedDate                          | 02/02/2011                        |
			| page.additionalDetails.trialListingPageType | disease                           |

	Scenario: Page Load Analytics fires for a 404 on a no trials page that was not redirected
		Given "trialListingPageType" is set to "Disease"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
    And "siteName" is set to "National Cancer Institute"
    When the user navigates to "/notrials?p1=C3037"
    And page title on error page is "Page Not Found"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                 			   | value                               |
			| type                                			   | PageLoad                            |
			| event                               			   | TrialListingApp:Load:PageNotFound 	 |
			| page.name                           			   | www.cancer.gov/notrials		         |
			| page.title                          			   | Page Not Found                      |
			| page.metaTitle                      			   | Page Not Found                      |
			| page.language                       			   | english                             |
			| page.type                           			   | nciAppModulePage                    |
			| page.channel                        			   | Clinical Trials                     |
			| page.contentGroup                   			   | Clinical Trials: Custom             |
			| page.publishedDate                    			 | 02/02/2011                          |
			| page.additionalDetails.trialListingPageType	 | disease														 |
