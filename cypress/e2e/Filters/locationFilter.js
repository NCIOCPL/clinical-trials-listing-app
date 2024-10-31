/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('the location filter components are displayed', () => {
	cy.get('.ctla-sidebar').find('input[type="text"]').should('be.visible');
	cy.get('.ctla-sidebar').find('select.usa-select').should('be.visible');
});

Then('the zip code input placeholder text is {string}', (placeholder) => {
	cy.get('.ctla-sidebar').find('input[type="text"]').should('have.attr', 'placeholder', placeholder);
});

Then('the radius dropdown is disabled', () => {
	cy.get('.ctla-sidebar').find('select.usa-select').should('be.disabled');
});

Then('the radius dropdown is enabled', () => {
	cy.get('.ctla-sidebar').find('select.usa-select').should('not.be.disabled');
});

Then('the radius dropdown has the following options', (dataTable) => {
	const options = dataTable.hashes();
	cy.get('.ctla-sidebar')
		.find('select.usa-select option')
		.should('have.length', options.length + 1) // +1 for the default "Select" option
		.each(($option, index) => {
			if (index > 0) {
				// Skip the first "Select" option
				const option = options[index - 1];
				expect($option.text().trim()).to.equal(option.label);
				expect($option.val()).to.equal(option.value);
			}
		});
});

When('enters {string} in the zip code filter', (zipCode) => {
	cy.get('.ctla-sidebar').find('input[type="text"]').clear().type(zipCode);
});

When('selects {string} from the radius dropdown', (radius) => {
	cy.get('.ctla-sidebar').find('select.usa-select').select(radius);
});

Then('the zip code filter shows {string}', (value) => {
	cy.get('.ctla-sidebar').find('input[type="text"]').should('have.value', value);
});

Then('the radius dropdown shows {string}', (value) => {
	cy.get('.ctla-sidebar').find('select.usa-select').should('have.value', value);
});

Then('the radius dropdown shows {string} as default value', (value) => {
	cy.get('.ctla-sidebar').find('select.usa-select').should('have.value', value);
});

Then('the zip code filter is empty', () => {
	cy.get('.ctla-sidebar').find('input[type="text"]').should('have.value', '');
});

Then('the radius dropdown remains disabled', () => {
	cy.get('.ctla-sidebar').find('select.usa-select').should('be.disabled');
});

// Reuse existing step definitions from ageFilter.js:
// - clicks the "Apply Filters" button
// - clicks the "Clear All" button
// - the page URL includes "string"
// - the page URL does not include "string"
// - the system displays updated trial results
// - "Clear All" button is enabled/disabled
// - clicks on "Next" button
