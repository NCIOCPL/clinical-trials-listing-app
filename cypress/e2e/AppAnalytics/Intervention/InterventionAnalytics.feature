@skip
Feature: Intervention listing page analytics

	Scenario: Page Load Analytics fires when a user views an intervention listing page
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		And "analyticsPublishedDate" is set to "02/02/2011"
		When the user navigates to "/C1647?cfg=1"
		Then the page title is "Clinical Trials Using Trastuzumab"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                                                         |
			| event                                       | TrialListingApp:Load:Results                                  |
			| type                                        | PageLoad                                                      |
			| page.publishedDate                          | 02/02/2011                                                    |
			| page.contentGroup                           | Clinical Trials: Custom                                       |
			| page.name                                   | www.cancer.gov/trastuzumab                                    |
			| page.title                                  | Clinical Trials Using Trastuzumab                             |
			| page.channel                                | Clinical Trials                                               |
			| page.type                                   | nciAppModulePage                                              |
			| page.language                               | english                                                       |
			| page.metaTitle                              | Clinical Trials Using Trastuzumab - National Cancer Institute |
			| page.additionalDetails.trialListingPageType | intervention                                                  |
			| page.additionalDetails.interventionName     | trastuzumab                                                   |
			| page.additionalDetails.numberResults        | (int)59                                                       |
