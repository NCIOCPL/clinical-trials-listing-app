import { Then } from 'cypress-cucumber-preprocessor/steps';

const applyButtonSelector = '.ctla-sidebar button:contains("Apply Filters")'; // Adjust selector
const clearButtonSelector = '.ctla-sidebar button:contains("Clear Filters")'; // Adjust selector
const resultsCountSelector = '.ctla-results__count'; // Adjust selector
const ageInputSelector = '.ctla-sidebar input[type="number"]'; // Assuming this selector
const zipInputSelector = '.ctla-sidebar input[placeholder*="Zip Code"]'; // Adjust selector
const radiusSelectSelector = '.ctla-sidebar select.usa-select'; // Adjust selector
const buttonGroupSelector = '.ctla-sidebar .button-group'; // Adjust selector for the button group container

// Basic display checks
Then('Apply Filters button displays', () => {
	cy.get(applyButtonSelector).should('be.visible');
});

Then('Clear Filters button displays', () => {
	cy.get(clearButtonSelector).should('be.visible');
});

// Layout / Grouping checks (These can be brittle and depend heavily on HTML structure/CSS)
Then('button is in a group with the Clear Filters button', () => {
	// Check that both buttons share a common parent element (likely a div with a class like button-group)
	cy.get(applyButtonSelector).parents(buttonGroupSelector).find(clearButtonSelector).should('exist');

	// Alternative approach if the above doesn't work with your HTML structure
	// cy.get(applyButtonSelector).parent().find(clearButtonSelector).should('exist');
});

Then('Apply Filters button is on the right', () => {
	// Compare the horizontal position of both buttons
	cy.get(applyButtonSelector).then(($apply) => {
		cy.get(clearButtonSelector).then(($clear) => {
			expect($apply.offset().left).to.be.greaterThan($clear.offset().left);
		});
	});
});

Then('Clear Filters button is on the left', () => {
	// Compare the horizontal position of both buttons
	cy.get(clearButtonSelector).then(($clear) => {
		cy.get(applyButtonSelector).then(($apply) => {
			expect($clear.offset().left).to.be.lessThan($apply.offset().left);
		});
	});
});

// State checks (Assuming basic enabled/disabled steps exist elsewhere)
Then('Apply Filters button becomes enabled', () => {
	cy.get(applyButtonSelector).should('be.enabled');
});

// Page state checks
Then('page reloads at page 1', () => {
	// Check URL for absence of 'pn' or 'pn=1'
	cy.url().should('not.include', 'pn=2');
	cy.url().should('not.include', 'pn=3');
	cy.url().should('not.include', 'pn=4');
	cy.url().should('not.include', 'pn=5');

	// Check that the results count shows the first page range
	cy.get(resultsCountSelector).should('contain', 'Trials 1-');

	// Alternative: Check pagination component for active first page
	cy.get('.usa-pagination__button--active').should('contain', '1');
});

Then('page loads at page {int} of results', (pageNum) => {
	cy.url().should('include', `pn=${pageNum}`);

	// Check that the pagination component shows the correct page as active
	cy.get('.usa-pagination__button--active').should('contain', pageNum.toString());

	// Check results count shows appropriate range for this page
	// For example, page 2 typically shows results 26-50
	const startResult = (pageNum - 1) * 25 + 1;
	// const endResult = pageNum * 25; // Unused variable
	cy.get(resultsCountSelector).should('contain', `Trials ${startResult}-`);
});

// Input value checks (Assuming basic value checks exist elsewhere)
Then('Age text input is {int}', (value) => {
	cy.get(ageInputSelector).should('have.value', value.toString());
});

Then('Location by ZIP Code input is {string}', (value) => {
	cy.get(zipInputSelector).should('have.value', value);
});

Then('Radius dropdown displays {int} miles', (value) => {
	cy.get(radiusSelectSelector).should('have.value', value.toString());
});

Then('Age text input is cleared', () => {
	cy.get(ageInputSelector).should('have.value', '');
});

Then('Location by ZIP Code input is cleared', () => {
	cy.get(zipInputSelector).should('have.value', '');
});

Then('Radius dropdown displays Select and is disabled', () => {
	cy.get(radiusSelectSelector).should('have.value', ''); // Assuming 'Select' has empty value
	cy.get(radiusSelectSelector).should('be.disabled');
	cy.get(radiusSelectSelector).find('option:selected').should('have.text', 'Select'); // Alternative check
});

// Result count check
Then('page shows {int} trial results', (count) => {
	// Check the total count in the results text (e.g., "Trials 1-25 of 87")
	cy.get(resultsCountSelector).should('contain', `of ${count}`);

	// Optional: Verify the actual number of result items if needed
	// This assumes each result is in a container with a specific class
	if (count <= 25) {
		// If count is less than or equal to items per page, we can verify exact count
		cy.get('.ctla-results-list-item').should('have.length', count);
	} else {
		// Otherwise, just verify we have the expected number per page
		cy.get('.ctla-results-list-item').should('have.length', Math.min(25, count));
	}
});

// Generic steps (might exist elsewhere)
Then('the page loads', () => {
	// Wait for key elements to be visible
	cy.get('.ctla-results__count').should('be.visible');
	cy.get('.ctla-sidebar').should('be.visible');
	// Wait for loading spinner to disappear if applicable
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
});

// Note: Steps like 'When user enters X in Y input' or 'When user selects Z from dropdown'
// are assumed to be defined in more specific files like ageFilterSteps.js or locationFilterSteps.js
