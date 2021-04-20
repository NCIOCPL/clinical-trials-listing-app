Feature: As a user, I would like to view the trial results for an intervention listing page that is given a pretty URL name parameter, along with links to the trial's description page, the brief summary of the trial, and the number of locations of the trial

  Scenario: View intervention listing page results with pretty URL name parameter
    Given "trialListingPageType" is set to "Intervention"
    And "pageTitle" is set to "Clinical Trials Using {{intervention_label}}"
		And "browserTitle" is set to "Clinical Trials Using {{intervention_label}}"
		And "introText" is set to "<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying Trastuzumab. All trials on the list are <a class=\"definition\" href=\"/Common/PopUps/popDefinition.aspx?id=CDR0000776051&amp;version=Patient&amp;language=English\" onclick=\"javascript:popWindow(\'defbyid\',\'CDR0000776051&amp;version=Patient&amp;language=English\'); return false;\">supported by NCI</a>.</p><p>NCI’s <a href=\"/about-cancer/treatment/clinical-trials/what-are-trials\">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>"
		Given the user navigates to "/trastuzumab?cfg=1"
    Then the page title is "Clinical Trials Using Trastuzumab"
    Then the system displays 1 paragraph "Clinical trials are research studies that involve people. The clinical trials on this list are studying Trastuzumab. All trials on the list are supported by NCI."
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
      | Next > |

  Scenario: View intervention listing page metadata with pretty URL name parameter
    Given "trialListingPageType" is set to "Intervention"
    And "pageTitle" is set to "Clinical Trials Using {{intervention_label}}"
		And "browserTitle" is set to "Clinical Trials Using {{intervention_label}}"
		And "introText" is set to "<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying Trastuzumab. All trials on the list are <a class=\"definition\" href=\"/Common/PopUps/popDefinition.aspx?id=CDR0000776051&amp;version=Patient&amp;language=English\" onclick=\"javascript:popWindow(\'defbyid\',\'CDR0000776051&amp;version=Patient&amp;language=English\'); return false;\">supported by NCI</a>.</p><p>NCI’s <a href=\"/about-cancer/treatment/clinical-trials/what-are-trials\">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>"
		And "siteName" is set to "National Cancer Institute"
    When the user navigates to "/trastuzumab?cfg=1"
    Then the title tag should be "Clinical Trials Using Trastuzumab - National Cancer Institute"
    And the page contains meta tags with the following properties
      | property       | content                                     																																					                  	 |
      | og:title       | Clinical Trials Using Trastuzumab                 																													                               |
      | og:url         | http://localhost:3000/trastuzumab                              																																		  		 |
      | og:description | NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials studying Trastuzumab.  |
    And the page contains meta tags with the following names
      | name        | content                                 																																				                          	 |
      | description | NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials studying Trastuzumab.     |
    And there is a canonical link with the href "https://www.cancer.gov/trastuzumab"

	Scenario: Mobile and Tablet Pager Display
		Given "trialListingPageType" is set to "Intervention"
		And "pageTitle" is set to "Clinical Trials Using {{intervention_label}}"
		And "browserTitle" is set to "Clinical Trials Using {{intervention_label}}"
		And "introText" is set to "<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying Trastuzumab. All trials on the list are <a class=\"definition\" href=\"/Common/PopUps/popDefinition.aspx?id=CDR0000776051&amp;version=Patient&amp;language=English\" onclick=\"javascript:popWindow(\'defbyid\',\'CDR0000776051&amp;version=Patient&amp;language=English\'); return false;\">supported by NCI</a>.</p><p>NCI’s <a href=\"/about-cancer/treatment/clinical-trials/what-are-trials\">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>"
		And screen breakpoint is set to "mobile"
		When the user navigates to "/trastuzumab?cfg=1"
		Then the system displays 1 paragraph "Clinical trials are research studies that involve people. The clinical trials on this list are studying Trastuzumab. All trials on the list are supported by NCI."
    Then the system displays 2 paragraph "NCI’s basic information about clinical trials explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you."
    Then the system displays "Trials 1-25 of" "58"
		Then each result displays the trial title as a link to the trial description page
		Then pager displays the following navigation options
      | pages  |
      | 1      |
      | 2      |
      | 3      |
      | Next > |
