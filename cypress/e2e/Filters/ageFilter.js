/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('the age filter is displayed', () => {
	cy.get('.ctla-sidebar').find('input[type="number"]').should('be.visible');
});

Then('the age filter has a numeric input', () => {
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.attr', 'type', 'number');
});

Then('the age input placeholder text is {string}', (placeholder) => {
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.attr', 'placeholder', placeholder);
});

When('enters {string} in the age filter', (age) => {
	cy.get('.ctla-sidebar').find('input[type="number"]').clear().type(age);
});

When('clicks the {string} button', (buttonText) => {
	cy.get('.ctla-sidebar').contains('button', buttonText).click();
});

Then('the page URL includes {string}', (paramString) => {
	cy.url().should('include', paramString);
});

Then('the page URL does not include {string}', (paramString) => {
	cy.url().should('not.include', paramString);
});

Then('the system displays updated trial results', () => {
	cy.get('.ctla-results__list').should('exist');
	cy.get('.ctla-results__summary').should('exist');
});

Then('the age filter shows {string}', (value) => {
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', value);
});

Then('the age filter is empty', () => {
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', '');
});

Then('the age input value remains empty', () => {
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', '');
});

Then('the age input value is {string}', (value) => {
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', value);
});

Then('{string} button is enabled', (buttonText) => {
	cy.get('.ctla-sidebar').contains('button', buttonText).should('not.be.disabled');
});

Then('{string} button is disabled', (buttonText) => {
	cy.get('.ctla-sidebar').contains('button', buttonText).should('be.disabled');
});
