Feature: As the system, I want to be able to redirect users to the No Trials Found page for the dynamic listing pages, so that the pages are more user and SEO friendly.

	Scenario: Page redirects to No Trials Found page if pretty URL name is given for Disease and no trials are returned
		Given "trialListingPageType" is set to "Disease"
		And "pageTitle" is set to "{{disease_label}} Clinical Trials"
		And "noTrialsHtml" is set to "<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>"
		Given the user navigates to "/chronic-fatigue-syndrome"
		Then the user is redirected to "/notrials" with query parameters "p1=chronic-fatigue-syndrome"
		Then the page title is "Chronic Fatigue Syndrome Clinical Trials"
    And the system displays message "There are no NCI-supported clinical trials for chronic fatigue syndrome at this time. You can try a new search or contact our Cancer Information Service to talk about options for clinical trials."
    And the link "new search" to "/about-cancer/treatment/clinical-trials/search" appears on the page
    And the link "contact our Cancer Information Service" to "/contact" appears on the page
		And the CIS Banner displays below
		And the Chat Now button displays below
		And the page contains meta tags with the following names
				| name                  | content 																															|
				| prerender-status-code | 302     																															|
				| prerender-header		  | Location: http://localhost:3000/notrials?p1=chronic-fatigue-syndrome  |

