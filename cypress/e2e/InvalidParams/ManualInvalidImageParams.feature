@manual
Feature: As a user, I would like to see an error page when I visit a manual listing page with invalid parameters.

	Scenario: User visits manual trial listing page with invalid parameters
		Given "trialListingPageType" is set to "Manual"
		And "cisBannerImgUrlLarge" is set to "img.jpeg"
		And "cisBannerImgUrlSmall" is set to "img1.jpeg"
		When the user navigates to "/"
    Then the error message "Missing or invalid 'cisBannerImgUrlLarge, cisBannerImgUrlSmall' provided to app initialization." appears on the page

	Scenario: User visits manual trial listing page with invalid parameters
		Given "trialListingPageType" is set to "Manual"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to "img1.jpeg"
		When the user navigates to "/"
    Then the error message "Missing or invalid 'cisBannerImgUrlLarge, cisBannerImgUrlSmall' provided to app initialization." appears on the page
