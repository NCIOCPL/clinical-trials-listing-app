/// <reference types="Cypress" />
import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

// Setup for each test
beforeEach(() => {
  // This ensures we wait for any async operations to complete
  cy.window().then(win => {
    if (!win.INT_TEST_APP_PARAMS) {
      win.INT_TEST_APP_PARAMS = {};
    }
  });
});

// Steps for data entry in filters
Given('user has typed {int} in the Age text input', (age) => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('input[type="number"]').clear().type(age);
});

Given('user has typed {string} in the Location by ZIP Code text input', (zipCode) => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('input[type="text"]').clear().type(zipCode);
});

Given('user has selected {int} miles for the Radius dropdown', (radius) => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('select.usa-select').select(radius.toString());
});

// Mock API responses for consistent testing
Given('the API returns empty results for filtered search', () => {
  cy.intercept('POST', '*/trials*', {
    statusCode: 200,
    body: {
      total: 0,
      data: []
    }
  }).as('emptyResults');
});

// URL validation
Then('the page URL stays the same with the additional query parameter', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.url().should('include', 'a='); // Age filter parameter
  cy.url().should('include', 'z='); // ZIP code parameter
  cy.url().should('include', 'zr='); // Radius parameter - Fixed from 'r=' to 'zr='
});

// Content validation
Then('intro text displays', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-results__intro').should('be.visible');
});

Then('Trials 0 of 0 displays below the intro text', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-results__count').should('contain', 'Trials 0 of 0');
});

Then('horizontal rule displays below results count', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-results__divider').should('be.visible');
});

Then('No Trials Found message displays below horizontal rule', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-results__no-results').should('be.visible');
});

Then('No Trials Found message displays below the page title', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('h1').next().find('p').should('be.visible');
});

// Filter value verification
Then('Age parameter has {int} entered', (value) => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', value.toString());
});

Then('Location by ZIP Code has {int} entered', (value) => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('input[type="text"]').should('have.value', value.toString());
});

Then('Location by ZIP Code has {string} entered', (value) => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('input[type="text"]').should('have.value', value);
});

Then('Radius has {int} miles selected', (value) => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('select.usa-select').should('have.value', value.toString());
});

// Disabled filter states
Then('Age parameter text input empty and disabled', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('input[type="number"]').should('be.disabled').and('have.value', '');
});

Then('Location by ZIP Code text input is empty and disabled', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('input[type="text"]').should('be.disabled').and('have.value', '');
});

Then('Radius displays {string} and is disabled', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').find('select.usa-select').should('be.disabled');
  cy.get('.ctla-sidebar').find('select.usa-select option:selected').should('have.text', 'Select');
});

// Redirection checks with improved error handling
Then('page redirects to {string}', (urlWithParams) => {
  // Wait for network calls to complete
  cy.wait(2000);

  // Add longer timeout for redirection
  cy.url({ timeout: 10000 }).should('include', urlWithParams.split('?')[0]); // Check base URL

  // If the URL has parameters, check them too
  if (urlWithParams.includes('?')) {
    // Extract and check each parameter
    const params = urlWithParams.split('?')[1].split('&');
    params.forEach(param => {
      cy.url().should('include', param);
    });
  }

  // Add assertion retry in case of network delays
  cy.wrap(null, { timeout: 5000 }).should(() => {
    cy.url().then(url => {
      expect(url).to.include(urlWithParams.split('?')[0]);
    });
  });
});

// Click steps for compatibility with existing tests
When('user clicks the {string} button', (buttonText) => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').contains('button', buttonText).click();
});

// Alternative syntax for backward compatibility
When('clicks the {string} button', (buttonText) => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('.ctla-sidebar').contains('button', buttonText).click();
});

// CIS Banner check
Then('CIS banner image displays below the No Trials Found message', () => {
  cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
  cy.get('[alt="Questions? Chat with an information specialist"]').should('be.visible');
});

// Add mock data setup for more reliable testing
Given('the API is mocked for no trials', () => {
  cy.intercept('POST', '**/v2/trials**', {
    statusCode: 200,
    body: {
      total: 0,
      data: []
    }
  }).as('noTrialsData');
});
