import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

// Selectors (Adjust based on actual HTML)
const resultsListSelector = '.ctla-results-list'; // Adjust if needed
const resultItemSelector = '.ctla-results-list-item'; // Adjust if needed
const resultItemTitleSelector = '.ctla-results-list-item__title'; // Adjust if needed
const resultItemDescSelector = '.ctla-results-list-item__description'; // Adjust if needed
const resultItemLocationSelector = '.ctla-results-list-item__location'; // Adjust if needed
const resultItemStatusSelector = '.ctla-results-list-item__status'; // Adjust if needed
// Update this selector based on your actual HTML structure
// This is a more generic selector that might work, but should be adjusted
const manualDropdownSelector = 'select[name="listing-type"], .listing-type-dropdown, #listing-type-selector';
const paginationContainerSelector = '.usa-pagination'; // Adjust if needed
const paginationLinkSelector = '.usa-pagination__link'; // Adjust if needed

// Given steps
Given('user is viewing the preview site for interventions', () => {
	// Placeholder for any specific setup for intervention context
	cy.log('Assuming intervention context setup');
});

Given('user is viewing the preview site', () => {
	// Placeholder for generic setup if needed, or rely on When step for navigation
	cy.log('Assuming generic preview site setup');
});

// When steps
When('user selects Manual - Adult Metastatic Brain Tumors option in the dropdown', () => {
	// This requires knowing the specific dropdown and option value/text
	// The selector and option text/value should be adjusted based on your actual implementation
	cy.get(manualDropdownSelector).select('Manual - Adult Metastatic Brain Tumors');

	// Alternative approach if the dropdown is custom (not a native <select>)
	// cy.get(manualDropdownSelector).click(); // Open the dropdown
	// cy.contains('Manual - Adult Metastatic Brain Tumors').click(); // Select the option
});

When('user clicks on page {int} in the pager', (pageNum) => {
	cy.get(paginationContainerSelector).find(paginationLinkSelector).contains(pageNum.toString()).click();
});

// Then steps
Then('a list of trial results displays', () => {
	cy.get(resultsListSelector).should('be.visible');
	cy.get(resultItemSelector).should('have.length.gt', 0);
});

Then('each result item displays the trial title', () => {
	cy.get(resultItemSelector).each(($item) => {
		cy.wrap($item).find(resultItemTitleSelector).should('be.visible').and('not.be.empty');
	});
});

Then('each result item does not display the trial description', () => {
	cy.get(resultItemSelector).each(($item) => {
		// Check if the description element exists and is hidden, or simply doesn't exist
		// Option 1: Check if it exists but is not visible (e.g., display: none)
		// cy.wrap($item).find(resultItemDescSelector).should('not.be.visible');
		// Option 2: Check if it doesn't exist in the DOM within the item
		cy.wrap($item).find(resultItemDescSelector).should('not.exist');
	});
});

Then('the page displays a results list', () => {
	cy.get(resultsListSelector).should('be.visible');
	cy.get(resultItemSelector).should('have.length.gt', 0);
});

Then('each results item displays the location', () => {
	cy.get(resultItemSelector).each(($item) => {
		cy.wrap($item).find(resultItemLocationSelector).should('be.visible').and('not.be.empty');
	});
});

Then('the location has the syntax {string}', (expectedSyntax) => {
	// This is tricky. We need to check the format.
	// Example: "Locations: X locations, including Y near you" or "Locations: X locations"
	cy.get(resultItemSelector)
		.first()
		.find(resultItemLocationSelector)
		.invoke('text')
		.then((text) => {
			if (expectedSyntax.includes('near you')) {
				expect(text).to.match(/^Locations: \d+ locations?, including \d+ near you$/);
			} else {
				expect(text).to.match(/^Locations: \d+ locations?$/);
			}
		});
	// Note: Checking *every* item might be slow. Checking the first is often sufficient.
});

Then('item {string} has trial status {string}', (itemTitle, expectedStatus) => {
	cy.get(resultItemSelector)
		.contains(resultItemTitleSelector, itemTitle) // Find item by title
		.closest(resultItemSelector) // Go up to the item container
		.find(resultItemStatusSelector) // Find the status element within that item
		.should('contain.text', expectedStatus);
});

Then('each result item displays the trial status', () => {
	cy.get(resultItemSelector).each(($item) => {
		cy.wrap($item).find(resultItemStatusSelector).should('be.visible').and('not.be.empty');
	});
});
