Feature: As the system, I want to be able to view the No Trials Found page for the dynamic listing pages, so that the pages are more user and SEO friendly.

	Scenario: No Trials Found page is displayed if pretty URL name is given as p1 parameter to /notrials route for Disease
		Given "trialListingPageType" is set to "Disease"
		And "pageTitle" is set to "{{disease_label}} Clinical Trials"
		And "noTrialsHtml" is set to "<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>"
		Given the user navigates to "/notrials?p1=chronic-fatigue-syndrome&cfg=0"
		Then the page title is "Chronic Fatigue Syndrome Clinical Trials"
    And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
    And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
    And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
				| name                  | content 	 |
				| prerender-status-code | 404     	 |
				| robots				 			  | noindex		 |

	Scenario: Page redirects to No Trials Found page if code is given as p1 parameter to /notrials route for Disease
		Given "trialListingPageType" is set to "Disease"
		And "pageTitle" is set to "{{disease_label}} Clinical Trials"
		And "noTrialsHtml" is set to "<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>"
		Given the user navigates to "/notrials?p1=C3037&cfg=0"
		Then the page title is "Chronic Fatigue Syndrome Clinical Trials"
    And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
    And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
    And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
				| name                  | content 	 |
				| prerender-status-code | 404     	 |
				| robots				 			  | noindex		 |

	Scenario: No Trials Found page is displayed if pretty URL name is given as p1 parameter to /notrials route for Intervention
		Given "trialListingPageType" is set to "Intervention"
		And "pageTitle" is set to "Clinical Trials Using {{intervention_label}}"
		And "noTrialsHtml" is set to "<p>There are no NCI-supported clinical trials studying {{intervention_label}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>"
		Given the user navigates to "/notrials?p1=spiroplatin&cfg=0"
		Then the page title is "Clinical Trials Using Spiroplatin"
    And the system displays message "There are no NCI-supported clinical trials studying Spiroplatin at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
    And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
    And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
				| name                  | content 	 |
				| prerender-status-code | 404     	 |
				| robots				 			  | noindex		 |

	Scenario: Page redirects to No Trials Found page if code is given as p1 parameter to /notrials route for Intervention
		Given "trialListingPageType" is set to "Intervention"
		And "pageTitle" is set to "Clinical Trials Using {{intervention_label}}"
		And "noTrialsHtml" is set to "<p>There are no NCI-supported clinical trials studying {{intervention_label}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>"
		Given the user navigates to "/notrials?p1=C1234&cfg=0"
		Then the page title is "Clinical Trials Using Spiroplatin"
    And the system displays message "There are no NCI-supported clinical trials studying Spiroplatin at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
    And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
    And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
				| name                  | content 	 |
				| prerender-status-code | 404     	 |
				| robots				 			  | noindex		 |
