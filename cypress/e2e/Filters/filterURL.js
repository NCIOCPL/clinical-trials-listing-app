/// <reference types="Cypress" />
import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the system displays filtered trial results', () => {
	// Wait for results to load
	cy.get('.ctla-results__list-item').should('exist');

	// Verify results summary is updated
	cy.get('.ctla-results__count').should('exist');
});

Then('the page maintains {string} in the URL', (paramString) => {
	cy.url().should('include', paramString);

	// Also verify the parameter stays in URL after reload
	cy.reload();
	cy.url().should('include', paramString);
});

// Utility function to verify all filter states
const verifyAllFilterStates = ({ age, zip, radius }) => {
	// Check age filter if provided
	if (age !== undefined) {
		if (age === null) {
			cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', '');
		} else {
			cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', age);
		}
	}

	// Check zip code filter if provided
	if (zip !== undefined) {
		if (zip === null) {
			cy.get('.ctla-sidebar').find('input[type="text"]').should('have.value', '');
		} else {
			cy.get('.ctla-sidebar').find('input[type="text"]').should('have.value', zip);
		}
	}

	// Check radius dropdown if provided
	if (radius !== undefined) {
		if (radius === null) {
			cy.get('.ctla-sidebar').find('select.usa-select').should('be.disabled');
		} else {
			cy.get('.ctla-sidebar').find('select.usa-select').should('have.value', radius);
		}
	}
};

Then('all filter values are correctly populated', (dataTable) => {
	const filterValues = dataTable.rowsHash();
	verifyAllFilterStates(filterValues);
});

Then('filter buttons show correct states for direct navigation', () => {
	// Apply button should be disabled since filters are already applied
	cy.get('.ctla-sidebar__button--apply').should('be.disabled');

	// Clear button should be enabled since filters are applied
	cy.get('.ctla-sidebar__button--clear').should('be.enabled');
});
