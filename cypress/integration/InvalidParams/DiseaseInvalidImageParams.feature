Feature: As a user, I would like to see an error page when I visit a dynamic listing page with invalid parameters.

	Scenario: User visits disease trials listing page with invalid parameters
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to null
		When the user navigates to "/C4872"
    Then the error message "Missing or invalid 'cisBannerImgUrlLarge, cisBannerImgUrlSmall' provided to app initialization." appears on the page

	Scenario: User visits disease trials listing page with invalid parameters
		Given "trialListingPageType" is set to "Disease"
		And "dynamicListingPatterns" object is set to "Disease"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to 'img.jpeg'
		When the user navigates to "/C4872"
    Then the error message "Missing or invalid 'cisBannerImgUrlLarge, cisBannerImgUrlSmall' provided to app initialization." appears on the page
