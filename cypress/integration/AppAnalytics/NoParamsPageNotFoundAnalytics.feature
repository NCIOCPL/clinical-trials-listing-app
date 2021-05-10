Feature: Analytics Page Not Found

  Scenario: Page Load Analytics fires for a 404 on a disease dynamic listing page with no parameters
	Given "trialListingPageType" is set to "Disease"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
    And "siteName" is set to "National Cancer Institute"
    When the user navigates to "/disease"
    And page title on error page is "Page Not Found"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                 			   | value                               |
			| type                                			   | PageLoad                            |
			| event                               			   | TrialListingApp:Load:PageNotFound 	 |
			| page.name                           			   | www.cancer.gov/disease			         |
			| page.title                          			   | Page Not Found                      |
			| page.metaTitle                      			   | Page Not Found                      |
			| page.language                       			   | english                             |
			| page.type                           			   | nciAppModulePage                    |
			| page.channel                        			   | Clinical Trials                     |
			| page.contentGroup                   			   | Clinical Trials: Custom             |
			| page.publishedDate                    			 | 02/02/2011                          |
			| page.additionalDetails.trialListingPageType	 | disease														 |

	Scenario: Page Load Analytics fires for a 404 on a intervention dynamic listing page with no parameters
	Given "trialListingPageType" is set to "Intervention"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
    And "siteName" is set to "National Cancer Institute"
    When the user navigates to "/intervention"
    And page title on error page is "Page Not Found"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                 			   | value                               |
			| type                                			   | PageLoad                            |
			| event                               			   | TrialListingApp:Load:PageNotFound 	 |
			| page.name                           			   | www.cancer.gov/intervention         |
			| page.title                          			   | Page Not Found                      |
			| page.metaTitle                      			   | Page Not Found                      |
			| page.language                       			   | english                             |
			| page.type                           			   | nciAppModulePage                    |
			| page.channel                        			   | Clinical Trials                     |
			| page.contentGroup                   			   | Clinical Trials: Custom             |
			| page.publishedDate                    			 | 02/02/2011                          |
			| page.additionalDetails.trialListingPageType	 | intervention												 |











