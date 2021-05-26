Feature: Disease listing page analytics

	Scenario: Page Load Analytics fires when a user views a disease listing page
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And "analyticsPublishedDate" is set to "02/02/2011"
		When the user navigates to "/C4872"
		Then the page title is "Breast Cancer Clinical Trials"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                                                     |
			| event                                       | TrialListingApp:Load:Results                              |
			| type                                        | PageLoad                                                  |
			| page.publishedDate                          | 02/02/2011                                                |
			| page.contentGroup                           | Clinical Trials: Custom                                   |
			| page.name                                   | www.cancer.gov/breast-cancer                              |
			| page.title                                  | Breast Cancer Clinical Trials                             |
			| page.channel                                | Clinical Trials                                           |
			| page.type                                   | nciAppModulePage                                          |
			| page.language                               | english                                                   |
			| page.metaTitle                              | Breast Cancer Clinical Trials - National Cancer Institute |
			| page.additionalDetails.diseaseName          | breast cancer                                             |
			| page.additionalDetails.trialListingPageType | disease                                                   |
			| page.additionalDetails.numberResults        | (int)938                                                  |
