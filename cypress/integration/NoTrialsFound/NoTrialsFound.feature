Feature: As the system, I want to be able to view the No Trials Found page for the dynamic listing pages, so that the pages are more user and SEO friendly.

	Scenario: No Trials Found page is displayed if pretty URL name is given as p1 parameter to /notrials route for Disease
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/notrials?p1=chronic-fatigue-syndrome&cfg=0"
		Then the page title is "Chronic Fatigue Syndrome Clinical Trials"
		And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content |
			| prerender-status-code | 404     |
			| robots                | noindex |

	Scenario: Page redirects to No Trials Found page if code is given as p1 parameter to /notrials route for Disease
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/notrials?p1=C3037&cfg=0"
		Then the page title is "Chronic Fatigue Syndrome Clinical Trials"
		And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content |
			| prerender-status-code | 404     |
			| robots                | noindex |

	Scenario: No Trials Found page is displayed if pretty URL name is given as p1 parameter to /notrials route for Intervention
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		Given the user navigates to "/notrials?p1=spiroplatin&cfg=1"
		Then the page title is "Clinical Trials Using Spiroplatin"
		And the system displays message "There are no NCI-supported clinical trials studying spiroplatin at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content |
			| prerender-status-code | 404     |
			| robots                | noindex |

	Scenario: Page redirects to No Trials Found page if code is given as p1 parameter to /notrials route for Intervention
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		Given the user navigates to "/notrials?p1=C1234&cfg=1"
		Then the page title is "Clinical Trials Using Spiroplatin"
		And the system displays message "There are no NCI-supported clinical trials studying spiroplatin at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content |
			| prerender-status-code | 404     |
			| robots                | noindex |

	Scenario Outline: No Trials Found page is displayed when navigated to /notrials route for Disease Trial Type
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "<url>"
		Then the page title is "<title>"
		And the system displays message "<infoMessage>"
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content |
			| prerender-status-code | 404     |
			| robots                | noindex |
		Examples:
			| url                                                        		 | title                                                         | infoMessage                                                                                                                                                                                                          |
			| /notrials?p1=chronic-fatigue-syndrome&p2=supportive-care&cfg=0 | Supportive Care Clinical Trials for Chronic Fatigue Syndrome  | There are no NCI-supported clinical trials for chronic fatigue syndrome supportive care at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials.   |
			| /notrials?p1=C3037&p2=supportive-care&cfg=0       						 | Supportive Care Clinical Trials for Chronic Fatigue Syndrome  | There are no NCI-supported clinical trials for chronic fatigue syndrome supportive care at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials.   |
			| /notrials?p1=chronic-fatigue-syndrome&p2=supportive_care&cfg=0 | Supportive Care Clinical Trials for Chronic Fatigue Syndrome  | There are no NCI-supported clinical trials for chronic fatigue syndrome supportive care at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials. |


	Scenario Outline: No Trials Found page is displayed when navigated to /notrials route for Disease Trial Type and Intervention
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "<url>"
		Then the page title is "<title>"
		And the system displays message "<infoMessage>"
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content |
			| prerender-status-code | 404     |
			| robots                | noindex |
		Examples:
			| url                                                        | title                                                         | infoMessage                                                                                                                                                                                                          |
			| /notrials?p1=spiroplatin&p2=treatment&p3=trastuzumab&cfg=0 | Treatment Clinical Trials for Spiroplatin Using Trastuzumab   | There are no NCI-supported clinical trials for spiroplatin treatment using trastuzumab at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials.   |
			| /notrials?p1=C1234&p2=treatment&p3=trastuzumab&cfg=0       | Treatment Clinical Trials for Spiroplatin Using Trastuzumab   | There are no NCI-supported clinical trials for spiroplatin treatment using trastuzumab at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials.   |
			| /notrials?p1=breast-cancer&p2=treatment&p3=C1234&cfg=0     | Treatment Clinical Trials for Breast Cancer Using Spiroplatin | There are no NCI-supported clinical trials for breast cancer treatment using spiroplatin at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials. |
