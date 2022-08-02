Feature: Manual listing page analytics

	Scenario: Page Load Analytics fires when a user views a manual listing page
		Given "trialListingPageType" is set to "Manual"
		And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to null
		And "analyticsPublishedDate" is set to "02/02/2011"
		When the user navigates to "/?cfg=4"
		Then the page title is "Clinical Trials for Adult Metastatic Brain Tumors"
		And delighter is displayed with link "https://cancer.gov/about-cancer/treatment/clinical-trials/search"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                                                                         |
			| type                                        | PageLoad                                                                      |
			| event                                       | TrialListingApp:Load:Results                                                  |
			| page.name                                   | www.cancer.gov/                                                               |
			| page.title                                  | Clinical Trials for Adult Metastatic Brain Tumors                             |
			| page.metaTitle                              | Clinical Trials for Adult Metastatic Brain Tumors - National Cancer Institute |
			| page.language                               | english                                                                       |
			| page.type                                   | nciAppModulePage                                                              |
			| page.channel                                | Clinical Trials                                                               |
			| page.contentGroup                           | Clinical Trials: Custom                                                       |
			| page.publishedDate                          | 02/02/2011                                                                    |
			| page.additionalDetails.numberResults        | (int)104                                                                      |
			| page.additionalDetails.trialListingPageType | manual parameters                                                             |

	Scenario: Click event fires when a user clicks on result item
		Given "trialListingPageType" is set to "Manual"
		And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to null
		And "analyticsPublishedDate" is set to "02/02/2011"
		When the user navigates to "/?cfg=4"
		Then the page title is "Clinical Trials for Adult Metastatic Brain Tumors"
		When user clicks on result item 1
		Then there should be an analytics event with the following details
			| key              | value                             |
			| type             | Other                             |
			| event            | TrialListingApp:Other:ResultClick |
			| linkName         | CTSLink                           |
			| data.resultIndex | (int)1                            |
			| data.currentPage | (int)1                            |

