@filters
Feature: Trial Results Display Details

  Scenario: User does not see descriptions on trial results for diseases
    Given user is viewing the preview site for diseases
    When user navigates to /breast-cancer?cfg=0
    Then a list of trial results displays
      And each result item displays the trial title
      And each result item does not display the trial description

  Scenario: User does not see descriptions on trial results for interventions
    Given user is viewing the preview site for interventions
    When user navigates to /trastuzumab?cfg=1
    Then a list of trial results displays
      And each result item displays the trial title
      And each result item does not display the trial description

  Scenario: User does not see descriptions on trial results for manual listing pages
    Given user is viewing the preview site
    When user selects Manual - Adult Metastatic Brain Tumors option in the dropdown
    Then a list of trial results displays
      And each result item displays the trial title
      And each result item does not display the trial description

  Scenario: User sees nearby locations when location filter has been applied
    Given user is viewing the preview site
    When user navigates to /breast-cancer?cfg=0&pn=1&zip=22201&radius=100
    Then the page displays a results list
      And each results item displays the location
      And the location has the syntax "Locations: X locations, including Y near you"

  Scenario: User sees all locations when no location filter has been applied
    Given user is viewing the preview site
    When user navigates to /breast-cancer?cfg=0&pn=1
    Then the page displays a results list
      And each results item displays the location
      And the location has the syntax "Locations: X locations"

  Scenario: User sees trial status for diseases
    Given user is viewing the preview site for diseases
    When user navigates to /breast-cancer
      And user clicks on page 34 in the pager
    Then a list of trial results displays
      And item "Collecting Blood, Vaginal Secretions, Tissue, and Ascites Fluid from Patients with or at High-Risk for Gynecological Cancer or Breast Cancer" has trial status "Temporarily Closed to Accrual"

  Scenario: User sees trial status for interventions
    Given user is viewing the preview site for interventions
    When user navigates to /trastuzumab
      And user clicks on page 2 in the pager
    Then a list of trial results displays
      And item "Alpha-TEA and Trastuzumab for the Treatment of Refractory HER2+ Metastatic Breast Cancer" has trial status "Temporarily Closed to Accrual"

  Scenario: User sees trial status for manual listing pages
    Given user is viewing the preview site
    When user selects Manual - Adult Metastatic Brain Tumors option in the dropdown
      And user clicks on page 10 in the pager
    Then a list of trial results displays
      And each result item displays the trial status
      And item "Nivolumab with Trametinib and Dabrafenib, or Encorafenib and Binimetinib in Treating Patients with BRAF Mutated Metastatic or Unresectable Stage III-IV Melanoma" has trial status "Temporarily Closed to Accrual"