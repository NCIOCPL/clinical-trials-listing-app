Feature: As the system, I want to be able to redirect users to the No Trials Found page for the dynamic listing pages, so that the pages are more user and SEO friendly.

	Scenario: Page redirects to No Trials Found page if codes are given for Intervention and no trials are returned
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		Given the user navigates to "/C1234"
		Then the user is redirected to "/notrials" with query parameters "p1=spiroplatin"
		Then the page title is "Clinical Trials Using Spiroplatin"
		And the system displays message "There are no NCI-supported clinical trials studying spiroplatin at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content                                     |
			| prerender-status-code | 301                                         |
			| prerender-header      | Location: http://localhost:3000/spiroplatin |
			| robots                | noindex                                     |


	Scenario: Page redirects to No Trials Found page if pretty URL name is given for Intervention and no trials are returned
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		Given the user navigates to "/spiroplatin"
		Then the user is redirected to "/notrials" with query parameters "p1=spiroplatin"
		Then the page title is "Clinical Trials Using Spiroplatin"
		And the system displays message "There are no NCI-supported clinical trials studying spiroplatin at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
		And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
		And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
			| name                  | content                                                 |
			| prerender-status-code | 302                                                     |
			| prerender-header      | Location: http://localhost:3000/notrials?p1=spiroplatin |
			| robots                | noindex                                                 |

