Feature: As a user, I would like to view the trial results for an intervention listing page that is given a c-code parameter, along with links to the trial's description page, the brief summary of the trial, and the number of locations of the trial

  Scenario: View intervention listing page results with c-code parameter
    Given "trialListingPageType" is set to "Intervention"
    And "dynamicListingPatterns" object is set to "Intervention"
    Given the user navigates to "/C1647/treatment?cfg=1"
    Then the page title is "Treatment Clinical Trials Using Trastuzumab"
    Then the system displays 1 paragraph "Clinical trials are research studies that involve people. The clinical trials on this list are testing treatment methods that use trastuzumab. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI."
    Then the system displays 2 paragraph "NCI’s basic information about clinical trials explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you."
    And the link "basic information about clinical trials" to "/about-cancer/treatment/clinical-trials/what-are-trials" appears on the page
    And each result displays the trial title as a link to the trial description page
    And each result displays the trial description below the link
    And each result displays "Location: " below the description

  Scenario: View intervention listing page metadata with c-code parameter
    Given "trialListingPageType" is set to "Intervention"
    And "dynamicListingPatterns" object is set to "Intervention"
    And "siteName" is set to "National Cancer Institute"
    When the user navigates to "/C1647/treatment?cfg=1"
    Then the title tag should be "Treatment Clinical Trials Using Trastuzumab - National Cancer Institute"
    And the page contains meta tags with the following properties
      | property       | content                                                                                                                                                 |
      | og:title       | Treatment Clinical Trials Using Trastuzumab                                                                                                             |
      | og:url         | http://localhost:3000/trastuzumab/treatment                                                                                                             |
      | og:description | NCI supports clinical trials studying new and more effective ways to treat cancer. Find clinical trials testing treatment methods that use trastuzumab. |
    And the page contains meta tags with the following names
      | name        | content                                                                                                                                                 |
      | description | NCI supports clinical trials studying new and more effective ways to treat cancer. Find clinical trials testing treatment methods that use trastuzumab. |
    And there is a canonical link with the href "https://www.cancer.gov/trastuzumab/treatment"
