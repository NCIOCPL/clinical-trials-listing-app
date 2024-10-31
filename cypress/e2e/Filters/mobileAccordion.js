/// <reference types="Cypress" />
import { Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('the filter content is visible', () => {
	cy.get('#accordionContent').should('be.visible').and('not.have.attr', 'hidden');
});

Then('the filter content is hidden', () => {
	cy.get('#accordionContent').should('have.attr', 'hidden');
});

Then('the filter button does not show expand/collapse icon', () => {
	cy.get('#filterButton').should('not.have.css', 'background-image');
});

Then('the filter button shows expand icon', () => {
	cy.get('#filterButton').should('have.css', 'background-image').and('include', 'plus'); // Matches the plus icon SVG
});

Then('the filter button shows collapse icon', () => {
	cy.get('#filterButton').should('have.css', 'background-image').and('include', 'minus'); // Matches the minus icon SVG
});

When('clicks the filter toggle button', () => {
	cy.get('#filterButton').click();
});

Then('the filter content remains visible', () => {
	cy.get('#accordionContent').should('be.visible').and('not.have.attr', 'hidden');
});

// Helper function to verify mobile viewport
const verifyMobileViewport = () => {
	cy.viewport('iphone-6');
	// Additional mobile-specific verifications if needed
};

// Helper function to verify desktop viewport
const verifyDesktopViewport = () => {
	cy.viewport(1029, 720); // Matches your breakpoint
	// Additional desktop-specific verifications if needed
};

// Add this to check accordion behavior across different viewports
Then('accordion behaves correctly across breakpoints', () => {
	// Check desktop behavior
	verifyDesktopViewport();
	cy.get('#accordionContent').should('be.visible');
	cy.get('#filterButton').should('not.have.css', 'background-image');

	// Check mobile behavior
	verifyMobileViewport();
	cy.get('#accordionContent').should('have.attr', 'hidden');
	cy.get('#filterButton').should('have.css', 'background-image').and('include', 'plus');
});
