import { When, Then } from 'cypress-cucumber-preprocessor/steps';

const zipInputSelector = '.ctla-sidebar input[placeholder*="Zip Code"]'; // Adjust selector
const radiusSelectSelector = '.ctla-sidebar select.usa-select'; // Adjust selector
const sidebarSelector = '.ctla-sidebar'; // Adjust selector
const resultsSelector = '.ctla-results-list'; // Adjust selector
const errorMessageSelector = '.usa-error-message'; // Adjust selector for error message element

// Basic display
Then('the location filter components are displayed', () => {
	cy.get(sidebarSelector).find('label:contains("Location")').should('be.visible');
	cy.get(zipInputSelector).should('be.visible');
	cy.get(radiusSelectSelector).should('be.visible');
});

Then('the zip code input placeholder text is {string}', (placeholder) => {
	cy.get(zipInputSelector).should('have.attr', 'placeholder', placeholder);
});

Then('the radius dropdown is disabled', () => {
	cy.get(radiusSelectSelector).should('be.disabled');
});

Then('the radius dropdown has the following options', (dataTable) => {
	dataTable.hashes().forEach((row) => {
		cy.get(radiusSelectSelector).find(`option[value="${row.value}"]`).should('contain.text', row.label);
	});
});

// Radius enabling and default value
When('enters {string} in the zip code filter', (zip) => {
	cy.get(zipInputSelector).clear().type(zip);
});

Then('the radius dropdown is enabled', () => {
	cy.get(radiusSelectSelector).should('be.enabled');
});

Then('the radius dropdown shows {string} as default value', (value) => {
	cy.get(radiusSelectSelector).should('have.value', value);
});

// Applying filters (Input steps)
When('selects {string} from the radius dropdown', (value) => {
	cy.get(radiusSelectSelector).select(value);
});

// Clearing filters (Verification steps)
Then('the zip code filter is empty', () => {
	cy.get(zipInputSelector).should('have.value', '');
});

// Zip validation
Then('the radius dropdown remains disabled', () => {
	cy.get(radiusSelectSelector).should('be.disabled');
});

Then('the zip code field shows validation error', () => {
	// Check multiple ways validation errors might be displayed

	// 1. Check for error class on the input itself (common approach)
	cy.get(zipInputSelector).should('have.class', 'usa-input--error');

	// 2. Check for error message element (if it appears near the input)
	cy.get(zipInputSelector).parents('.usa-form-group').find(errorMessageSelector).should('be.visible').and('contain.text', 'valid'); // Partial text match for messages like "Please enter a valid ZIP code"

	// 3. Check for aria-invalid attribute (accessibility best practice)
	cy.get(zipInputSelector).should('have.attr', 'aria-invalid', 'true');

	// 4. Check for error styling (red border is common)
	cy.get(zipInputSelector).should('have.css', 'border-color').and('include', 'red');

	// Note: You may need to adjust or remove some of these checks based on how your app implements validation
});

// Persistence (Verification steps)
Then('the zip code filter shows {string}', (value) => {
	cy.get(zipInputSelector).should('have.value', value);
});

Then('the radius dropdown shows {string}', (value) => {
	cy.get(radiusSelectSelector).should('have.value', value);
});

// Apply button interaction (Verification steps)
let initialResultsHTML = '';
When('captures the current trial results', () => {
	cy.get(resultsSelector)
		.invoke('html')
		.then((html) => {
			initialResultsHTML = html;
		});
});

Then('the trial results remain unchanged', () => {
	cy.get(resultsSelector).invoke('html').should('eq', initialResultsHTML);
});

Then('the trial results still remain unchanged', () => {
	cy.get(resultsSelector).invoke('html').should('eq', initialResultsHTML);
});

Then('the trial results are updated', () => {
	cy.get(resultsSelector).invoke('html').should('not.eq', initialResultsHTML);
});

// New steps for zip limit
When('user tries to type {string} in the zip code filter', (value) => {
	cy.get(zipInputSelector).clear().type(value, { delay: 50 }); // Add delay to simulate typing
});

Then('the zip code input value is {string}', (value) => {
	cy.get(zipInputSelector).should('have.value', value);
});

Then('the zip code input does not accept further input', () => {
	// Check if maxlength attribute is 5
	cy.get(zipInputSelector).should('have.attr', 'maxlength', '5');
	// Try typing more and assert value hasn't changed
	cy.get(zipInputSelector)
		.invoke('val')
		.then((currentValue) => {
			cy.get(zipInputSelector).type('9').should('have.value', currentValue);
		});
});

// New steps for radius mouse interaction
When('user clicks on the Radius dropdown', () => {
	// Usually not needed for cy.select(), but included for completeness if needed for custom dropdowns
	cy.get(radiusSelectSelector).click(); // May not be necessary
});

When('user selects {string} from the Radius dropdown options', (optionText) => {
	cy.get(radiusSelectSelector).select(optionText); // Select by visible text
});

// radius keyboard interaction
When('user tabs to the Radius filter', () => {
	cy.get(zipInputSelector).focus().tab(); // Assuming zip is before radius
	cy.focused().should('match', radiusSelectSelector);
});

When('user hits the down arrow key', () => {
	cy.focused().type('{downarrow}');
});

When('user hits the up arrow key twice', () => {
	cy.focused().type('{uparrow}{uparrow}');
});
