/// <reference types="Cypress" />
import { Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('the {string} filter section is displayed', (filterType) => {
	const selector = filterType === 'subtype' ? '.filter-group:contains("Subtype")' : '.filter-group:contains("Primary Cancer Type")';
	cy.get(selector).should('be.visible');
});

Then('the {string} filter has a search input', (filterType) => {
	const selector = filterType === 'subtype' ? '.filter-group:contains("Subtype")' : '.filter-group:contains("Primary Cancer Type")';
	cy.get(selector).find('input[type="text"]').should('be.visible');
});

Then('the {string} input placeholder text is {string}', (filterType, placeholder) => {
	const selector = filterType === 'subtype' ? '.filter-group:contains("Subtype")' : '.filter-group:contains("Primary Cancer Type")';
	cy.get(selector).find('input[type="text"]').should('have.attr', 'placeholder', placeholder);
});

Then('the subtype help text displays {string}', (helpText) => {
	cy.get('.filter-group:contains("Subtype")').find('.filter-group__help-text').should('have.text', helpText);
});

When('types {string} in the {string} filter', (text, filterType) => {
	const selector = filterType === 'subtype' ? '.filter-group:contains("Subtype")' : '.filter-group:contains("Primary Cancer Type")';
	cy.get(selector).find('input[type="text"]').type(text);
});

Then('the {string} dropdown shows the following options', (filterType, dataTable) => {
	const selector = filterType === 'subtype' ? '.filter-group:contains("Subtype")' : '.filter-group:contains("Primary Cancer Type")';

	cy.get(selector)
		.find('.combobox__options')
		.should('be.visible')
		.within(() => {
			dataTable.hashes().forEach((option) => {
				cy.contains('.combobox__option', option.label).should('be.visible').and('contain', `(${option.count})`);
			});
		});
});

When('selects {string} from {string} dropdown', (option, filterType) => {
	const selector = filterType === 'subtype' ? '.filter-group:contains("Subtype")' : '.filter-group:contains("Primary Cancer Type")';

	cy.get(selector).find('.combobox__option').contains(option).click();
});

Then('the selected subtypes show', (dataTable) => {
	const expectedLabels = dataTable.raw().map((row) => row[0]);
	cy.get('.combobox__selected .combobox__tag').should('have.length', expectedLabels.length);
	expectedLabels.forEach((label) => {
		cy.get('.combobox__selected').contains(label).should('be.visible');
	});
});

When('removes {string} from selected subtypes', (label) => {
	cy.get('.combobox__selected').contains(label).parent().find('.combobox__tag-remove').click();
});

Then('only {string} remains in selected subtypes', (label) => {
	cy.get('.combobox__selected .combobox__tag').should('have.length', 1).and('contain', label);
});

Then('only {string} shows as selected main type', (label) => {
	cy.get('.filter-group:contains("Primary Cancer Type")').find('.combobox__value').should('have.text', label);
});
