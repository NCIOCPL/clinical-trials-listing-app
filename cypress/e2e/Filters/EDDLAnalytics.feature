@filters @eddl
Feature: EDDL Analytics Events for Filters

	Scenario: EDDL:TrialListingApp:FilterApply event fires on age filter auto-apply
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And browser waits
		And the NCIDataLayer is cleared
		When the user types "65" into the Age filter input
		And browser waits 3 seconds
		Then there should be an analytics event with the following details
			| key                          | value                              |
			| type                         | Other                              |
			| event                        | TrialListingApp:FilterApply        |
			| linkName                     | TrialListingApp:FilterApply        |
			| data.fieldAdded              | a                                  |
			| data.interactionType         | filter modified                    |
			| data.numberResults           | (int)918                          |
			| data.fieldsUsed              | a                                  |
			| data.a                       | a\|65                             |
			| data.filterAppliedCounter    | (int)1                            |
			| data.filterRemovedCounter    | (int)0                            |

	Scenario: EDDL:TrialListingApp:FilterApply event fires on location filter auto-apply
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And browser waits
		And the NCIDataLayer is cleared
		When enters "20850" in the zip code filter
		And selects "50" from the radius dropdown
		And browser waits 3 seconds
		Then there should be an analytics event with the following details
			| key                          | value                              |
			| type                         | Other                              |
			| event                        | TrialListingApp:FilterApply        |
			| linkName                     | TrialListingApp:FilterApply        |
			| data.fieldAdded              | loc                                |
			| data.interactionType         | filter modified                    |
			| data.numberResults           | (int)12                           |
			| data.fieldsUsed              | loc                                |
			| data.loc                     | z\|20850\|50                      |
			| data.filterAppliedCounter    | (int)1                            |
			| data.filterRemovedCounter    | (int)0                            |

	Scenario: EDDL:TrialListingApp:FilterApply event with multiple filters
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?cfg=0"
		And browser waits
		And the NCIDataLayer is cleared
		When the user types "65" into the Age filter input
		And browser waits 3 seconds
		Then there should be an analytics event with the following details
			| key                          | value                              |
			| type                         | Other                              |
			| event                        | TrialListingApp:FilterApply        |
			| linkName                     | TrialListingApp:FilterApply        |
			| data.fieldAdded              | a                                  |
			| data.interactionType         | filter modified                    |
			| data.numberResults           | (int)918                          |
			| data.fieldsUsed              | a                                  |
			| data.a                       | a\|65                             |
			| data.filterAppliedCounter    | (int)1                            |
			| data.filterRemovedCounter    | (int)0                            |
		And the NCIDataLayer is cleared
		When enters "20850" in the zip code filter
		And selects "50" from the radius dropdown
		And browser waits 3 seconds
		Then there should be an analytics event with the following details
			| key                          | value                              |
			| type                         | Other                              |
			| event                        | TrialListingApp:FilterApply        |
			| linkName                     | TrialListingApp:FilterApply        |
			| data.fieldAdded              | loc                                |
			| data.interactionType         | filter modified                    |
			| data.numberResults           | (int)90                           |
			| data.fieldsUsed              | a:loc                              |
			| data.loc                     | z\|20850\|50                      |
			| data.a                       | a\|65                             |
			| data.filterAppliedCounter    | (int)2                            |
			| data.filterRemovedCounter    | (int)0                            |

	Scenario: EDDL:TrialListingApp:FilterApply event fires when clearing all filters
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?a=65&cfg=0"
		And browser waits
		And the NCIDataLayer is cleared
		And clicks the "Clear Filters" button
		And browser waits
		Then there should be an analytics event with the following details
			| key                          | value                              |
			| type                         | Other                              |
			| event                        | TrialListingApp:FilterApply        |
			| linkName                     | TrialListingApp:FilterApply        |
			| data.fieldRemoved            | all                                |
			| data.interactionType         | clear filters                      |
			| data.numberResults           | (int)953                          |
			| data.fieldsUsed              |                                    |
			| data.filterAppliedCounter    | (int)0                            |
			| data.filterRemovedCounter    | (int)1                            |

	Scenario: EDDL:TrialListingApp:FilterApply event fires when removing individual filter
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		When the user navigates to "/breast-cancer?a=65&cfg=0"
		And browser waits
		And the NCIDataLayer is cleared
		And removes the age filter tag
		And browser waits
		Then there should be an analytics event with the following details
			| key                          | value                              |
			| type                         | Other                              |
			| event                        | TrialListingApp:FilterApply        |
			| linkName                     | TrialListingApp:FilterApply        |
			| data.filterRemovedCounter    | (int)1                            |
			| data.filterAppliedCounter    | (int)0                            |
			| data.fieldsUsed              |                                    |
			| data.numberResults           | (int)953                          |
			| data.fieldRemoved            | a                                  |
			| data.interactionType         | filter removed                     |

	# Scenario: EDDL:TrialListingApp:ResultClick event fires on trial result click
	#	Given "trialListingPageType" is set to "Disease"
	#	And "dynamicListingPatterns" object is set to "Disease"
	#	When the user navigates to "/breast-cancer?cfg=0"
	#	And browser waits
	#	And clicks on the first trial result link
	#	Then there should be an analytics event with the following details
	#		| key                          | value                              |
	#		| type                         | Other                              |
	#		| event                        | TrialListingApp:ResultClick        |
	#		| linkName                     | TrialListingApp:ResultClick        |
	#		| data.position                | (int)1                            |
	#		| data.numberResults           | (int)953                          |
	#		| data.fieldsUsed              | none                               |
	#		| data.age                     | none                               |
	#		| data.loc                     | none                               |
	#		| data.filterAppliedCounter    | (int)0                            |
	#		| data.filterRemovedCounter    | (int)0                            |

	# Scenario: EDDL:TrialListingApp:ResultClick event with applied filters
	#	Given "trialListingPageType" is set to "Disease"
	#	And "dynamicListingPatterns" object is set to "Disease"
	#	When the user navigates to "/breast-cancer?a=65&z=20850&zr=50&cfg=0"
	#	And browser waits
	#	And clicks on the second trial result link
	#	Then there should be an analytics event with the following details
	#		| key                          | value                              |
	#		| type                         | Other                              |
	#		| event                        | TrialListingApp:ResultClick        |
	#		| linkName                     | TrialListingApp:ResultClick        |
	#		| data.position                | (int)2                            |
	#		| data.numberResults           | (int)90                           |
	#		| data.fieldsUsed              | a:loc                              |
	#		| data.age                     | 65                                 |
	#		| data.loc                     | z\|20850\|50                      |
	#		| data.filterAppliedCounter    | (int)0                            |
	#		| data.filterRemovedCounter    | (int)0                            |