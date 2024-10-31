Feature: Filter Analytics Events

	Scenario: Analytics event fires on first interaction with filter section
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And clicks in the age filter input
		Then there should be an analytics event with the following details
			| key           | value                                    |
			| type          | Other                                    |
			| event         | TrialListingApp:Filter:FirstInteraction  |
			| data.section  | age                                      |

	Scenario: Only one first interaction event fires per page load
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And clicks in the age filter input
		And clicks in the zip code filter input
		Then there should be exactly one "TrialListingApp:Filter:FirstInteraction" analytics event

	Scenario: Analytics event fires when filters are applied
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "65" in the age filter
		And enters "20850" in the zip code filter
		And selects "50" from the radius dropdown
		And clicks the "Apply Filters" button
		Then there should be an analytics event with the following details
			| key                    | value                           |
			| type                   | Other                           |
			| event                  | TrialListingApp:Filter:Apply    |
			| data.numFilters        | (int)3                         |
			| data.filters.age       | 65                             |
			| data.filters.zip       | 20850                          |
			| data.filters.radius    | 50                             |

	Scenario: Analytics event fires when filters are cleared
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?a=65&z=20850&zr=50&cfg=0"
		And clicks the "Clear Filters" button
		Then there should be an analytics event with the following details
			| key                | value                           |
			| type              | Other                           |
			| event             | TrialListingApp:Filter:Clear    |
			| data.clearedCount | (int)3                         |

	Scenario: Multiple filter apply events fire correctly
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And enters "65" in the age filter
		And clicks the "Apply Filters" button
		Then there should be an analytics event with the following details
			| key                    | value                           |
			| type                   | Other                           |
			| event                  | TrialListingApp:Filter:Apply    |
			| data.numFilters        | (int)1                         |
			| data.filters.age       | 65                             |
		When enters "20850" in the zip code filter
		And selects "50" from the radius dropdown
		And clicks the "Apply Filters" button
		Then there should be an analytics event with the following details
			| key                    | value                           |
			| type                   | Other                           |
			| event                  | TrialListingApp:Filter:Apply    |
			| data.numFilters        | (int)3                         |
			| data.filters.age       | 65                             |
			| data.filters.zip       | 20850                          |
			| data.filters.radius    | 50                             |
