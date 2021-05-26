Feature: As the system, I want to be able to redirect users to the No Trials Found page for the dynamic listing pages, so that the pages are more user and SEO friendly.

	Scenario: Page redirects to No Trials Found page if codes are given for Disease and no trials are returned
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/C3037"
		Then the user is redirected to "/notrials" with query parameters "p1=chronic-fatigue-syndrome"
		Then the page title is "Chronic Fatigue Syndrome Clinical Trials"
		And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content                                                  |
			| prerender-status-code | 301                                                      |
			| prerender-header      | Location: http://localhost:3000/chronic-fatigue-syndrome |
			| robots                | noindex                                                  |


	Scenario: Page redirects to No Trials Found page if pretty URL name is given for Disease and no trials are returned
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/chronic-fatigue-syndrome"
		Then the user is redirected to "/notrials" with query parameters "p1=chronic-fatigue-syndrome"
		Then the page title is "Chronic Fatigue Syndrome Clinical Trials"
		And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content                                                              |
			| prerender-status-code | 302                                                                  |
			| prerender-header      | Location: http://localhost:3000/notrials?p1=chronic-fatigue-syndrome |
			| robots                | noindex                                                              |

	Scenario: Page redirects to No Trials Found page if pretty URL name is given for Disease Trial Type and no trials are returned
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/chronic-fatigue-syndrome/supportive-care"
		And browser waits
		Then the user is redirected to "/notrials" with query parameters "p1=chronic-fatigue-syndrome&p2=supportive-care"
		Then the page title is "Supportive Care Clinical Trials for Chronic Fatigue Syndrome"
		And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome supportive care at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content                                                                           			|
			| prerender-status-code | 302                                                                               			|
			| prerender-header      | Location: http://localhost:3000/notrials?p1=chronic-fatigue-syndrome&p2=supportive-care |
			| robots                | noindex                                                                           			|

	Scenario: Page redirects to No Trials Found page if code/ID string is given for Disease Trial Type and no trials are returned
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/C3037/supportive_care?cfg=0"
		And browser waits
		Then the user is redirected to "/notrials" with query parameters "p1=chronic-fatigue-syndrome&p2=supportive-care"
		Then the page title is "Supportive Care Clinical Trials for Chronic Fatigue Syndrome"
		And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome supportive care at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content                                                            			 |
			| prerender-status-code | 301                                                                		   |
			| prerender-header      | Location: http://localhost:3000/chronic-fatigue-syndrome/supportive-care |
			| robots                | noindex                                                            			 |

	Scenario: Page redirects to No Trials Found page if pretty URL name is given for Disease Trial Type and intervention and no trials are returned
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/chronic-fatigue-syndrome/treatment/trastuzumab"
		And browser waits
		Then the user is redirected to "/notrials" with query parameters "p1=chronic-fatigue-syndrome&p2=treatment&p3=trastuzumab"
		Then the page title is "Treatment Clinical Trials for Chronic Fatigue Syndrome Using Trastuzumab"
		And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome treatment using trastuzumab at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content                                                                                          |
			| prerender-status-code | 302                                                                                              |
			| prerender-header      | Location: http://localhost:3000/notrials?p1=chronic-fatigue-syndrome&p2=treatment&p3=trastuzumab |
			| robots                | noindex                                                                                          |

	Scenario: Page redirects to No Trials Found page if code is given for Disease Trial Type and intervention and no trials are returned
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		Given the user navigates to "/C3037/treatment/C1647?cfg=0"
		And browser waits
		Then the user is redirected to "/notrials" with query parameters "p1=chronic-fatigue-syndrome&p2=treatment&p3=trastuzumab"
		Then the page title is "Treatment Clinical Trials for Chronic Fatigue Syndrome Using Trastuzumab"
		And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome treatment using trastuzumab at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content                                                                        |
			| prerender-status-code | 301                                                                            |
			| prerender-header      | Location: http://localhost:3000/chronic-fatigue-syndrome/treatment/trastuzumab |
			| robots                | noindex                                                                        |



