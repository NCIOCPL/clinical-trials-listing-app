Feature: As a user, I would like to view the trial results for a manual listing page that is given specific parameters, along with links to the trial's description page, the brief summary of the trial, and the number of locations of the trial

  Scenario: View manual listing page results
    Given "trialListingPageType" is set to "Manual"
    And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		And "requestFilters" is set as a json string to "{'diseases.nci_thesaurus_concept_id': ['C5816', 'C8550', 'C3813'], 'primary_purpose.primary_purpose_code': 'treatment'}"
    Given the user navigates to "/?cfg=4"
    Then the page title is "Clinical Trials for Adult Metastatic Brain Tumors"
    Then the system displays 1 paragraph "Clinical trials are research studies that involve people. The clinical trials on this list are for breast cancer. All trials on the list are supported by NCI."
    Then the system displays 2 paragraph "NCI’s basic information about clinical trials explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you."
    And the link "basic information about clinical trials" to "/about-cancer/treatment/clinical-trials/what-are-trials" appears on the page
    And each result displays the trial title as a link to the trial description page
    And each result displays the trial description below the link
    And each result displays "Location: " below the description


  Scenario: View manual listing page metadata
    Given "trialListingPageType" is set to "Manual"
    And "pageTitle" is set to "Clinical Trials for Adult Metastatic Brain Tumors"
		And "requestFilters" is set as a json string to "{'diseases.nci_thesaurus_concept_id': ['C5816', 'C8550', 'C3813'], 'primary_purpose.primary_purpose_code': 'treatment'}"
    When the user navigates to "/?cfg=4"
    Then the title tag should be "Clinical Trials for Adult Metastatic Brain Tumors - National Cancer Institute"
    And the page contains meta tags with the following properties
      | property       | content                                                      |
      | og:title       | Clinical Trials for Adult Metastatic Brain Tumors            |
      | og:url         | http://localhost:3000/                                       |
      | og:description | Find clinical trials to treat adult metastatic brain tumors. |
    And the page contains meta tags with the following names
      | name        | content                                                      |
      | description | Find clinical trials to treat adult metastatic brain tumors. |
    And there is a canonical link with the href "https://www.cancer.gov/"

