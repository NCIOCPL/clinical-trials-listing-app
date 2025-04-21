Feature: No trials found behavior with filters
	Scenario: User enters a combination of filters that returns no trials for diseases
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And the user navigates to "/lung-cancer?cfg=0&pn=1"
		And user has typed 2 in the Age text input
		And user has typed "30309" in the Location by ZIP Code text input
		And user has selected 20 miles for the Radius dropdown
		When user clicks the "Apply Filters" button
		Then the page URL stays the same with the additional query parameter
		And intro text displays
		And Trials 0 of 0 displays below the intro text
		And horizontal rule displays below results count
		And No Trials Found message displays below horizontal rule
		And CIS banner image displays below the No Trials Found message
		And Age parameter has 2 entered
		And Location by ZIP Code has "30309" entered
		And Radius has 20 miles selected
		And the "Clear Filters" button is enabled
		And the "Apply Filters" button is disabled

	Scenario: User enters a combination of filters that returns no trials for interventions
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		And the user navigates to "/trastuzumab?cfg=1&pn=1"
		And user has typed "22182" in the Location by ZIP Code text input
		And user has selected 20 miles for the Radius dropdown
		And user has typed 4 in the Age text input
		When user clicks the "Apply Filters" button
		Then the page URL stays the same with the additional query parameter
		And intro text displays
		And Trials 0 of 0 displays below the intro text
		And horizontal rule displays below results count
		And No Trials Found message displays below horizontal rule
		And CIS banner image displays below the No Trials Found message
		And Age parameter has 4 entered
		And Location by ZIP Code has "22182" entered
		And Radius has 20 miles selected
		And the "Clear Filters" button is enabled
		And the "Apply Filters" button is disabled

	Scenario: User views a base filter that results in no trials for diseases
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/chronic-fatigue-syndrome?cfg=0&pn=1"
		Then page redirects to "/notrials?p1=chronic-fatigue-syndrome"
		And No Trials Found message displays below the page title
		And CIS banner image displays below the No Trials Found message
		And Age parameter text input empty and disabled
		And Location by ZIP Code text input is empty and disabled
		And Radius displays "Select" and is disabled
		And the "Clear Filters" button is disabled
		And the "Apply Filters" button is disabled

	Scenario: User views a base filter that results in no trials for interventions
		Given "trialListingPageType" is set to "Intervention"
		And "dynamicListingPatterns" object is set to "Intervention"
		When the user navigates to "/spiroplatin"
		Then page redirects to "/notrials?p1=spiroplatin"
		And No Trials Found message displays below the page title
		And CIS banner image displays below the No Trials Found message
		And Age parameter text input empty and disabled
		And Location by ZIP Code text input is empty and disabled
		And Radius displays "Select" and is disabled
		And the "Clear Filters" button is disabled
		And the "Apply Filters" button is disabled
