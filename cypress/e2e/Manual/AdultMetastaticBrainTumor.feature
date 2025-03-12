Feature: As a user, I would like to view the trial results for a manual listing page that is given specific parameters, along with links to the trial's description page, the brief summary of the trial, and the number of locations of the trial

  Scenario: View manual listing page results
    Given "trialListingPageType" is set to "Manual"
    And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to null
    Given the user navigates to "/?cfg=4"
    Then the page title is "Clinical Trials for Adult Metastatic Brain Tumors"
    Then the system displays 1 paragraph "Clinical trials are research studies that involve people. The clinical trials on this list are for breast cancer. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI."
    Then the system displays 2 paragraph "NCI’s basic information about clinical trials explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you."
    And the link "basic information about clinical trials" to "/about-cancer/treatment/clinical-trials/what-are-trials" appears on the page
    And each result displays the trial title as a link to the trial description page
    And each result displays the trial description below the link
    And each result displays "Location: " below the description
    And pager displays the following navigation options
      | pages  |
      | 1      |
      | 2      |
      | 3      |
      | 4      |
      | 5      |
      | Next   |


  Scenario: View manual listing page metadata
    Given "trialListingPageType" is set to "Manual"
    And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to null
    When the user navigates to "/?cfg=4"
    Then the title tag should be "Clinical Trials for Adult Metastatic Brain Tumors - National Cancer Institute"
    And the page contains meta tags with the following properties
      | property       | content                                                      |
      | og:title       | Clinical Trials for Adult Metastatic Brain Tumors            |
      | og:url         | http://localhost:3000/?pn=1                                  |
      | og:description | Find clinical trials to treat adult metastatic brain tumors. |
    And the page contains meta tags with the following names
      | name        | content                                                      |
      | description | Find clinical trials to treat adult metastatic brain tumors. |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=1"

  Scenario: User is able to navigate through pages on manual listings
    Given "trialListingPageType" is set to "Manual"
    And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to null
    And "itemsPerPage" is set to 10
    Given the user navigates to "/?cfg=4"
    Then the page title is "Clinical Trials for Adult Metastatic Brain Tumors"
    Then the system displays "Trials 1-10 of" "104"
    And pager displays the following navigation options
      | pages  |
      | 1      |
      | 2      |
      | ...    |
      | 11     |
      | Next   |
    And the page "1" is highlighted
    When user clicks on "Next" button
    Then pager displays the following navigation options
      | pages      |
      | Previous   |
      | 1          |
      | 2          |
      | 3          |
      | ...        |
      | 11         |
      | Next       |
    And the page "2" is highlighted
		And the page contains meta tags with the following properties
			| property | content                                          |
			| og:url   | http://localhost:3000/?pn=2                      |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=2"
    When user clicks on "Next" button
    Then pager displays the following navigation options
      | pages      |
      | Previous   |
      | 1          |
      | 2          |
      | 3          |
      | 4          |
      | ...        |
      | 11         |
      | Next       |
    And the page "3" is highlighted
		And the page contains meta tags with the following properties
			| property | content                     |
			| og:url   | http://localhost:3000/?pn=3 |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=3"
    When user clicks on "Next" button
    Then pager displays the following navigation options
      | pages      |
      | Previous   |
      | 1          |
      | ...        |
      | 3          |
      | 4          |
      | 5          |
      | ...        |
      | 11         |
      | Next       |
    And the page "4" is highlighted
		And the page contains meta tags with the following properties
			| property | content                     |
			| og:url   | http://localhost:3000/?pn=4 |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=4"
		When user clicks on "Next" button
    Then pager displays the following navigation options
      | pages      |
      | Previous   |
      | 1          |
      | ...        |
      | 4          |
      | 5          |
      | 6          |
      | ...        |
      | 11         |
      | Next       |
    And the page "5" is highlighted
		And the page contains meta tags with the following properties
			| property | content                     |
			| og:url   | http://localhost:3000/?pn=5 |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=5"
		When user clicks on "11" button
    Then pager displays the following navigation options
      | pages      |
      |  Previous  |
      | 1          |
      | ...        |
      | 10         |
      | 11         |
    And the page "11" is highlighted
		And the page contains meta tags with the following properties
			| property | content                      |
			| og:url   | http://localhost:3000/?pn=11 |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=11"
		When user clicks on "Previous" button
    Then pager displays the following navigation options
      | pages      |
      | Previous   |
      | 1          |
      | ...        |
      | 9          |
      | 10         |
      | 11         |
      | Next       |
    And the page "10" is highlighted
		And the page contains meta tags with the following properties
			| property | content                      |
			| og:url   | http://localhost:3000/?pn=10 |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=10"
    When user clicks on "Previous" button
    Then pager displays the following navigation options
      | pages      |
      | Previous   |
      | 1          |
      | ...        |
      | 8          |
      | 9          |
      | 10         |
      | 11         |
      | Next       |
    And the page "9" is highlighted

		And the page contains meta tags with the following properties
			| property | content                     |
			| og:url   | http://localhost:3000/?pn=9 |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=9"
		When user clicks on "Previous" button
    Then pager displays the following navigation options
      | pages      |
      | Previous   |
      | 1          |
      | ...        |
      | 7          |
      | 8          |
      | 9          |
      | ...        |
      | 11         |
      | Next       |
    And the page "8" is highlighted
		And the page contains meta tags with the following properties
			| property | content                     |
			| og:url   | http://localhost:3000/?pn=8 |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=8"
		When user clicks on "Previous" button
    Then pager displays the following navigation options
      | pages      |
      | Previous   |
      | 1          |
      | ...        |
      | 6          |
      | 7          |
      | 8          |
      | ...        |
      | 11         |
      | Next       |
    And the page "7" is highlighted
		And the page contains meta tags with the following properties
			| property | content                     |
			| og:url   | http://localhost:3000/?pn=7 |
		And there is a canonical link with the href "https://www.cancer.gov/?pn=7"

  Scenario: View manual listing page with no pager (when total results is less than items per page )
    Given "trialListingPageType" is set to "Manual"
    And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		And "cisBannerImgUrlLarge" is set to null
		And "cisBannerImgUrlSmall" is set to null
    And "itemsPerPage" is set to 20
    Given the user navigates to "/?cfg=4"
    Then the page title is "Clinical Trials for Adult Metastatic Brain Tumors"
    And pager is not displayed
