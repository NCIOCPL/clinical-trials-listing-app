// Step definitions for invalid parameter handling
import { Then, And } from 'cypress-cucumber-preprocessor/steps';

/**
 * Verifies that the invalid criteria error message is displayed
 */
Then('invalid criteria error message displays', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.usa-alert--error').should('be.visible').and('contain.text', 'Sorry, there seems to be invalid criteria. Please update your filters.');
});

/**
 * Verifies that the Age text box is empty
 */
And('Age text box is empty', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar input[name="age-filter"]').should('have.value', '');
});

/**
 * Verifies that the Applied Filters heading does not display
 */
And('Applied Filters heading does not display', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	// Check that the Applied Filters component doesn't exist (not just that sidebar doesn't contain text)
	cy.get('.applied-filters').should('not.exist');
});

/**
 * Verifies that the Primary Cancer Type combo box is empty
 */
And('Primary Cancer Type combo box is empty', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('#maintype-filter').should('have.value', '');
});

/**
 * Verifies that the Subtype combo box is empty
 */
And('Subtype combo box is empty', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('#subtype-filter').should('have.value', '');
});

/**
 * Verifies that the Stage combo box is empty
 */
And('Stage combo box is empty', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('#stage-filter').should('have.value', '');
});

/**
 * Verifies that the Drug/Drug Family combo box is empty
 */
And('Drug/Drug Family combo box is empty', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('#drug-intervention-filter').should('have.value', '');
});

/**
 * Verifies that the results count is displayed
 */
And('results count displays', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-results__count').should('be.visible').and('not.be.empty');
});

/**
 * Verifies that approximately the expected number of trials are displayed
 * @param {number} expectedCount - The approximate number of trials expected (e.g., 21)
 */
And('the results list displays approximately {int} trials', (expectedCount) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	// Check that the results count text contains approximately the expected count
	// The text format is typically "Trials 1-25 of 21" or similar
	cy.get('.ctla-results__count')
		.should('be.visible')
		.invoke('text')
		.then((text) => {
			// Extract the total count from the text (e.g., "of 21")
			const match = text.match(/of\s+(\d+)/);
			if (match) {
				const actualCount = parseInt(match[1], 10);
				// Allow for some variance (±5) since counts may fluctuate
				expect(actualCount).to.be.closeTo(expectedCount, 5);
			}
		});

	// Also verify that result items are displayed
	cy.get('.ctla-results__list-item').should('have.length.greaterThan', 0);
});

/**
 * Verifies that the ZIP code input field is empty
 */
And('ZIP code text box is empty', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('#zip-code-filter').should('have.value', '');
});

/**
 * Verifies that the ZIP code error message is displayed
 */
And('ZIP code error message displays', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('#zip-error').should('be.visible');
});

/**
 * Verifies that the ZIP code input field contains the specified value
 * @param {string} zipValue - The expected ZIP code value
 */
And('ZIP code text box contains {string}', (zipValue) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('#zip-code-filter').should('have.value', zipValue);
});
