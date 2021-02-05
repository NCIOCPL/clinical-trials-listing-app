Feature: As a user I would like to have the Sample page displayed

	Scenario: Home page
		Given the user navigates to "/"
		Then the page title is "NCI Clinical Trials"
		Then the page contains meta tags with the following names
			| name   | content |
			| robots | index   |







