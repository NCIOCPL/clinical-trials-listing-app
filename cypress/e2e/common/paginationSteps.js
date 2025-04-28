import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

// Selectors (Adjust based on actual HTML)
const resultsCountSelector = '.ctla-results__count'; // Adjust if needed
const paginationContainerSelector = '.usa-pagination'; // Adjust if needed
const paginationLinkSelector = '.usa-pagination__link'; // Adjust if needed
const paginationPageLinksSelector = '.usa-pagination__link:not(.usa-pagination__link--prev):not(.usa-pagination__link--next)'; // Adjust if needed
const currentPageSelector = '.usa-pagination__item .usa-pagination__button--current'; // Adjust if needed
const prevButtonSelector = '.usa-pagination__link--prev'; // Adjust if needed
const nextButtonSelector = '.usa-pagination__link--next'; // Adjust if needed
const filterSectionSelector = '.ctla-sidebar'; // Adjust if needed
const ageInputSelector = '.ctla-sidebar input[type="number"]'; // Adjust if needed
const zipInputSelector = '.ctla-sidebar input[placeholder*="Zip Code"]'; // Adjust if needed
const radiusSelectSelector = '.ctla-sidebar select.usa-select'; // Adjust if needed
const clearButtonSelector = '.ctla-sidebar button:contains("Clear Filters")'; // Adjust if needed
const applyButtonSelector = '.ctla-sidebar button:contains("Apply Filters")'; // Adjust if needed
const resultsListSelector = '.ctla-results-list'; // Adjust if needed

// Given steps (Assuming navigation steps exist elsewhere)
Given('user is viewing the preview site for diseases', () => {
	// Placeholder for any specific setup for disease context
	cy.log('Assuming disease context setup');
});

Given('user is viewing the preview site for diseases at {string}', (path) => {
	cy.visit(path);
	// Placeholder for any specific setup for disease context
	cy.log('Assuming disease context setup');
});

// When steps
When('the user clicks the {string} button in the pager', (buttonText) => {
	if (buttonText.toLowerCase() === 'next') {
		cy.get(paginationContainerSelector).find(nextButtonSelector).click();
	} else if (buttonText.toLowerCase() === 'previous') {
		cy.get(paginationContainerSelector).find(prevButtonSelector).click();
	} else {
		throw new Error(`Unknown pager button: ${buttonText}`);
	}
});

When('the user clicks the {int} link in the pager', (pageNumber) => {
	cy.get(paginationContainerSelector).find(paginationLinkSelector).contains(pageNumber.toString()).click();
});

// Then steps
Then('the page updates with a results list of trials', () => {
	// Check that the results list is visible and perhaps contains items
	cy.get(resultsListSelector).should('be.visible').find('.ctla-results-list-item').should('have.length.gt', 0); // Adjust item selector
});

Then('the results count displays {string}', (expectedCountText) => {
	cy.get(resultsCountSelector).should('contain.text', expectedCountText);
});

Then('the pager displays {int} page links', (expectedLinkCount) => {
	// Count only the numbered page links, excluding prev/next if they use the same selector
	cy.get(paginationContainerSelector).find(paginationPageLinksSelector).should('have.length', expectedLinkCount);
});

Then('the current page {int} is highlighted', (pageNumber) => {
	cy.get(currentPageSelector).should('contain.text', pageNumber.toString());
});

Then('the {string} button displays to the left of the {int} page links', (buttonText /*, _*/) => {
	if (buttonText.toLowerCase() === 'previous') {
		// 1. Check that the Previous button exists and is visible
		cy.get(paginationContainerSelector).find(prevButtonSelector).should('be.visible');

		// 2. Check position relative to the first page number link
		// Method 1: Compare horizontal positions (offset().left)
		cy.get(paginationContainerSelector)
			.find(prevButtonSelector)
			.then(($prev) => {
				cy.get(paginationContainerSelector)
					.find(paginationPageLinksSelector)
					.first()
					.then(($firstPageLink) => {
						expect($prev.offset().left).to.be.lessThan($firstPageLink.offset().left);
					});
			});

		// Method 2: Check DOM order within the pagination container
		cy.get(paginationContainerSelector)
			.children()
			.then(($children) => {
				const prevIndex = $children.index(cy.$$(`${prevButtonSelector}`));
				const firstPageLinkIndex = $children.index(cy.$$(`${paginationPageLinksSelector}`).first());
				expect(prevIndex).to.be.lessThan(firstPageLinkIndex);
			});
	} else {
		throw new Error(`Unexpected button text: ${buttonText}`);
	}
});

Then('the {string} button displays to the right of the {int} page links', (buttonText /*, _*/) => {
	if (buttonText.toLowerCase() === 'next') {
		// 1. Check that the Next button exists and is visible
		cy.get(paginationContainerSelector).find(nextButtonSelector).should('be.visible');

		// 2. Check position relative to the last page number link
		// Method 1: Compare horizontal positions (offset().left)
		cy.get(paginationContainerSelector)
			.find(nextButtonSelector)
			.then(($next) => {
				cy.get(paginationContainerSelector)
					.find(paginationPageLinksSelector)
					.last()
					.then(($lastPageLink) => {
						expect($next.offset().left).to.be.greaterThan($lastPageLink.offset().left);
					});
			});

		// Method 2: Check DOM order within the pagination container
		cy.get(paginationContainerSelector)
			.children()
			.then(($children) => {
				const nextIndex = $children.index(cy.$$(`${nextButtonSelector}`));
				const lastPageLinkIndex = $children.index(cy.$$(`${paginationPageLinksSelector}`).last());
				expect(nextIndex).to.be.greaterThan(lastPageLinkIndex);
			});
	} else {
		throw new Error(`Unexpected button text: ${buttonText}`);
	}
});

Then('the Filter Trials section displays', () => {
	cy.get(filterSectionSelector).should('be.visible');
});

Then('the Age field is set to {int}', (value) => {
	cy.get(ageInputSelector).should('have.value', value.toString());
});

Then('the Location by ZIP Code is set to {string}', (value) => {
	cy.get(zipInputSelector).should('have.value', value);
});

Then('the Radius filter is set to {int} miles', (value) => {
	cy.get(radiusSelectSelector).should('have.value', value.toString());
});

Then('the Clear Filters button is displayed and enabled', () => {
	cy.get(clearButtonSelector).should('be.visible').and('be.enabled');
});

Then('the Apply Filters button is displayed and disabled', () => {
	cy.get(applyButtonSelector).should('be.visible').and('be.disabled');
});

Then('the page updates with the next set of trial results', () => {
	// Similar to 'page updates with a results list', maybe wait for spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 }); // Example wait
	cy.get(resultsListSelector).should('be.visible');
});

Then('the page URL persists the query parameters', () => {
	// Check for expected parameters based on the test context
	cy.url().should('include', 'age=');
	cy.url().should('include', 'zip=');
	cy.url().should('include', 'radius=');
	cy.url().should('include', 'cfg=');
});

Then('the page URL updates to {string}', (expectedUrl) => {
	// Check the path and query params more precisely
	cy.url().should('include', expectedUrl); // Use 'include' for flexibility or 'eq' for exact match if base URL is known
});
