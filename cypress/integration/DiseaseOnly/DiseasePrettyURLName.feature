Feature: As a user, I would like to view the trial results for a disease listing page that is given a pretty URL name parameter, along with links to the trial's description page, the brief summary of the trial, and the number of locations of the trial

  Scenario: View disease listing page results with pretty URL name parameter
    Given "trialListingPageType" is set to "Disease"
    And "pageTitle" is set to "{{disease_label}} Clinical Trials"
    Given the user navigates to "/breast-cancer?cfg=0"
    Then the page title is "Breast Cancer Clinical Trials"
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
      | ...    |
      | 38     |
      | Next > |

  Scenario: View disease listing page metadata with pretty URL name parameter
    Given "trialListingPageType" is set to "Disease"
    And "pageTitle" is set to "{{disease_label}} Clinical Trials"
		And "siteName" is set to "National Cancer Institute"
    When the user navigates to "/breast-cancer?cfg=0"
    Then the title tag should be "Breast Cancer Clinical Trials - National Cancer Institute"
    And the page contains meta tags with the following properties
      | property       | content                                     																																					                  |
      | og:title       | Breast Cancer Clinical Trials                 																													                                |
      | og:url         | http://localhost:3000/breast-cancer                               																																		  |
      | og:description | NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for breast cancer.  |
    And the page contains meta tags with the following names
      | name        | content                                 																																				                          |
      | description | NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for breast cancer.     |
    And there is a canonical link with the href "https://www.cancer.gov/breast-cancer"

	Scenario: Mobile and Tablet Pager Display
		Given "trialListingPageType" is set to "Disease"
		And "pageTitle" is set to "{{disease_label}} Clinical Trials"
		And screen breakpoint is set to "mobile"
		When the user navigates to "/breast-cancer?cfg=0"
		Then the system displays 1 paragraph "Clinical trials are research studies that involve people. The clinical trials on this list are for breast cancer. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI."
    Then the system displays 2 paragraph "NCI’s basic information about clinical trials explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you."
    Then the system displays "Trials 1-25 of" "938"
		Then each result displays the trial title as a link to the trial description page
		Then pager displays the following navigation options
      | pages  |
      | 1      |
      | 2      |
      | 3      |
      | ...    |
      | 38     |
      | Next > |
