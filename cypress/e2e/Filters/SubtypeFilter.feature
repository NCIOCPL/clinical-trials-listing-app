Feature: Main Type Filter Functionality

Scenario: Main type filter displays correctly
Given "trialListingPageType" is set to "Disease"
And "dynamicListingPatterns" object is set to "Disease"
When the user navigates to "/?cfg=0"
Then the main type filter section is displayed
And the main type filter has a search input
And the main type input placeholder text is "Start typing to select a type"

Scenario: Main type filter displays options when typing
Given "trialListingPageType" is set to "Disease"
And "dynamicListingPatterns" object is set to "Disease"
When the user navigates to "/?cfg=0"
And types "breast" in the main type filter
Then the main type dropdown shows the following options
| label           | value        | count |
| Breast Cancer   | breast       | 969   |
| Male Breast Cancer | male-breast | 42    |

Scenario: Main type filter allows single selection
Given "trialListingPageType" is set to "Disease"
And "dynamicListingPatterns" object is set to "Disease"
When the user navigates to "/?cfg=0"
And types "breast" in the main type filter
And selects "Breast Cancer" from main type dropdown
Then only "Breast Cancer" shows as selected main type
And the "Apply Filters" button is enabled

Scenario: Main type selection changes available subtypes
Given "trialListingPageType" is set to "Disease"
And "dynamicListingPatterns" object is set to "Disease"
When the user navigates to "/?cfg=0"
And selects "Breast Cancer" from main type dropdown
And clicks the "Apply Filters" button
And types "HER2" in the subtype filter
Then the subtype dropdown shows the following options
| label          | value      | count |
| HER2-Positive  | her2_pos   | 45    |
| HER2-Negative  | her2_neg   | 32    |
