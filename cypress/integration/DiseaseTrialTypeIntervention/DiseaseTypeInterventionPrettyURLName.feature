Feature: As a user, I would like to view the trial results for a disease listing page that is given a pretty URL name parameter, along with links to the trial's description page, the brief summary of the trial, and the number of locations of the trial

  Scenario: View disease trial type and intervention listing page results with pretty URL name parameter
    Given "trialListingPageType" is set to "Disease"
    And "pageTitle" is set to "{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}"
    Given the user navigates to "/breast-cancer/treatment/trastuzumab?cfg=0"
    Then the page title is "Treatment Clinical Trials for Breast Cancer Using Trastuzumab"
    Then the system displays 1 paragraph "Clinical trials are research studies that involve people. The clinical trials on this list are testing treatment methods for breast cancer that use trastuzumab. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI."
    Then the system displays 2 paragraph "NCI’s basic information about clinical trials explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you."
    And the link "basic information about clinical trials" to "/about-cancer/treatment/clinical-trials/what-are-trials" appears on the page
    And each result displays the trial title as a link to the trial description page
    And each result displays the trial description below the link
    And each result displays "Location: " below the description
    And pager displays the following navigation options
      | pages  |
      | 1      |
      | 2      |
      | Next > |
    When user clicks on "Next >" button
    Then the user is redirected to "/breast-cancer/treatment/trastuzumab" with query parameters "cfg=0&pn=2"
    And user is brought to the top of a page


  Scenario: View disease trial type and intervention listing page metadata with pretty URL name parameter
    Given "trialListingPageType" is set to "Disease"
    And "pageTitle" is set to "{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}"
    And "siteName" is set to "National Cancer Institute"
    Given the user navigates to "/breast-cancer/treatment/trastuzumab?cfg=0"
    Then the title tag should be "Treatment Clinical Trials for Breast Cancer Using Trastuzumab - National Cancer Institute"
    And the page contains meta tags with the following properties
      | property       | content                                                                                                                                                                   |
      | og:title       | Treatment Clinical Trials for Breast Cancer Using Trastuzumab                                                                                                             |
      | og:url         | http://localhost:3000/breast-cancer/treatment/trastuzumab                                                                                                                 |
      | og:description | NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials testing trastuzumab in the treatment of breast cancer. |
    And the page contains meta tags with the following names
      | name        | content                                                                                                                                                                   |
      | description | NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials testing trastuzumab in the treatment of breast cancer. |
    And there is a canonical link with the href "https://www.cancer.gov/breast-cancer/treatment/trastuzumab"
    And meta tag with a "name" "prerender-status-code" does not exist

  Scenario: Mobile and Tablet Pager Display
    Given "trialListingPageType" is set to "Disease"
    And "pageTitle" is set to "{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}"
    And screen breakpoint is set to "mobile"
    Given the user navigates to "/breast-cancer/treatment/trastuzumab?cfg=0"
    Then the page title is "Treatment Clinical Trials for Breast Cancer Using Trastuzumab"
    Then the system displays 1 paragraph "Clinical trials are research studies that involve people. The clinical trials on this list are testing treatment methods for breast cancer that use trastuzumab. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI."
    Then the system displays 2 paragraph "NCI’s basic information about clinical trials explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you."
    Then the system displays "Trials 1-25 of" "41"
    Then each result displays the trial title as a link to the trial description page
    Then pager displays the following navigation options
      | pages  |
      | 1      |
      | 2      |
      | Next > |
