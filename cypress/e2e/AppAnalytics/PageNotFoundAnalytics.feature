@analytics @misc
Feature: Analytics Page Not Found

	Scenario: Page Load Analytics fires for a 404 on a disease dynamic listing page with no parameters
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
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
		And "dynamicListingPatterns" object is set to "Intervention"
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
		And "dynamicListingPatterns" object is set to "Disease"
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
		And "dynamicListingPatterns" object is set to "Disease"
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
			| page.name                                   | www.cancer.gov/chicken-nuggets    |
			| page.title                                  | Page Not Found                    |
			| page.metaTitle                              | Page Not Found                    |
			| page.language                               | english                           |
			| page.type                                   | nciAppModulePage                  |
			| page.channel                                | Clinical Trials                   |
			| page.contentGroup                           | Clinical Trials: Custom           |
			| page.publishedDate                          | 02/02/2011                        |
			| page.additionalDetails.trialListingPageType | disease                           |

	Scenario: Page Load Analytics fires for a 404 on a disease trial type dynamic listing page with non-existent c-code
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When user navigates to non-existent page "/c123455/treatment?cfg=1"
		And page title is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                             |
			| type                                        | PageLoad                          |
			| event                                       | TrialListingApp:Load:PageNotFound |
			| page.name                                   | www.cancer.gov/c123455/treatment  |
			| page.title                                  | Page Not Found                    |
			| page.metaTitle                              | Page Not Found                    |
			| page.language                               | english                           |
			| page.type                                   | nciAppModulePage                  |
			| page.channel                                | Clinical Trials                   |
			| page.contentGroup                           | Clinical Trials: Custom           |
			| page.publishedDate                          | 02/02/2011                        |
			| page.additionalDetails.trialListingPageType | disease			                      |

	Scenario: Page Load Analytics fires for a 404 on a disease dynamic listing page with non-existent pretty url and trial type
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When user navigates to non-existent page "/chicken-nuggets/treat?cfg=1"
		And page title is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                                |
			| type                                        | PageLoad                             |
			| event                                       | TrialListingApp:Load:PageNotFound    |
			| page.name                                   | www.cancer.gov/chicken-nuggets/treat |
			| page.title                                  | Page Not Found                       |
			| page.metaTitle                              | Page Not Found                       |
			| page.language                               | english                              |
			| page.type                                   | nciAppModulePage                     |
			| page.channel                                | Clinical Trials                      |
			| page.contentGroup                           | Clinical Trials: Custom              |
			| page.publishedDate                          | 02/02/2011                           |
			| page.additionalDetails.trialListingPageType | disease			                         |

	Scenario: Page Load Analytics fires for a 404 on a disease trial type intervention dynamic listing page with non-existent c-code
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When user navigates to non-existent page "/breast-cancer/treatment/c123455?cfg=0"
		And page title is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                             							|
			| type                                        | PageLoad                          							|
			| event                                       | TrialListingApp:Load:PageNotFound 							|
			| page.name                                   | www.cancer.gov/breast-cancer/treatment/c123455  |
			| page.title                                  | Page Not Found                    							|
			| page.metaTitle                              | Page Not Found                    							|
			| page.language                               | english                           							|
			| page.type                                   | nciAppModulePage                  							|
			| page.channel                                | Clinical Trials                   							|
			| page.contentGroup                           | Clinical Trials: Custom           							|
			| page.publishedDate                          | 02/02/2011                        							|
			| page.additionalDetails.trialListingPageType | disease			                      							|

	Scenario: Page Load Analytics fires for a 404 on an disease trial type intervention dynamic listing page with non-existent pretty url
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When user navigates to non-existent page "/breast-cancer/treat/chicken-nuggets?cfg=0"
		And page title is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                                								|
			| type                                        | PageLoad                             								|
			| event                                       | TrialListingApp:Load:PageNotFound    								|
			| page.name                                   | www.cancer.gov/breast-cancer/treat/chicken-nuggets  |
			| page.title                                  | Page Not Found                       								|
			| page.metaTitle                              | Page Not Found                       								|
			| page.language                               | english                              								|
			| page.type                                   | nciAppModulePage                     								|
			| page.channel                                | Clinical Trials                      								|
			| page.contentGroup                           | Clinical Trials: Custom              								|
			| page.publishedDate                          | 02/02/2011                           								|
			| page.additionalDetails.trialListingPageType | disease			                         								|

	Scenario: Page Load Analytics fires for a 404 on an intervention dynamic listing page with non-existent c-code
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When user navigates to non-existent page "/c123455?cfg=1"
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
			| page.additionalDetails.trialListingPageType | intervention                      |

	Scenario: Page Load Analytics fires for a 404 on an intervention dynamic listing page with non-existent pretty-url
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When user navigates to non-existent page "/chicken-nuggets?cfg=1"
		And page title is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                             |
			| type                                        | PageLoad                          |
			| event                                       | TrialListingApp:Load:PageNotFound |
			| page.name                                   | www.cancer.gov/chicken-nuggets    |
			| page.title                                  | Page Not Found                    |
			| page.metaTitle                              | Page Not Found                    |
			| page.language                               | english                           |
			| page.type                                   | nciAppModulePage                  |
			| page.channel                                | Clinical Trials                   |
			| page.contentGroup                           | Clinical Trials: Custom           |
			| page.publishedDate                          | 02/02/2011                        |
			| page.additionalDetails.trialListingPageType | intervention                      |

	Scenario: Page Load Analytics fires for a 404 on an intervention trial type dynamic listing page with non-existent c-code
		Given "trialListingPageType" is set to "Intervention"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		And "dynamicListingPatterns" object is set to "Intervention"
		When user navigates to non-existent page "/c123455/treatment?cfg=1"
		And page title is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                             |
			| type                                        | PageLoad                          |
			| event                                       | TrialListingApp:Load:PageNotFound |
			| page.name                                   | www.cancer.gov/c123455/treatment  |
			| page.title                                  | Page Not Found                    |
			| page.metaTitle                              | Page Not Found                    |
			| page.language                               | english                           |
			| page.type                                   | nciAppModulePage                  |
			| page.channel                                | Clinical Trials                   |
			| page.contentGroup                           | Clinical Trials: Custom           |
			| page.publishedDate                          | 02/02/2011                        |
			| page.additionalDetails.trialListingPageType | intervention                      |

	Scenario: Page Load Analytics fires for a 404 on an intervention dynamic listing page with non-existent pretty url and trial type
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "siteName" is set to "National Cancer Institute"
		When user navigates to non-existent page "/chicken-nuggets/treat?cfg=1"
		And page title is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key                                         | value                                |
			| type                                        | PageLoad                             |
			| event                                       | TrialListingApp:Load:PageNotFound    |
			| page.name                                   | www.cancer.gov/chicken-nuggets/treat |
			| page.title                                  | Page Not Found                       |
			| page.metaTitle                              | Page Not Found                       |
			| page.language                               | english                              |
			| page.type                                   | nciAppModulePage                     |
			| page.channel                                | Clinical Trials                      |
			| page.contentGroup                           | Clinical Trials: Custom              |
			| page.publishedDate                          | 02/02/2011                           |
			| page.additionalDetails.trialListingPageType | intervention                         |

