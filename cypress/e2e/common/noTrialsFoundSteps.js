import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

// Selectors (Adjust based on actual HTML)
const pageTitleSelector = 'h1'; // Adjust if needed
const noTrialsMessageSelector = '.no-results p'; // Adjust selector for the message itself
// const cisBannerSelector = '[alt="Questions? Chat with an information specialist"]'; // Unused variable
const ageInputSelector = '.ctla-sidebar input[type="number"]'; // Adjust if needed
const zipInputSelector = '.ctla-sidebar input[placeholder*="Zip Code"]'; // Adjust if needed
const radiusSelectSelector = '.ctla-sidebar select.usa-select'; // Adjust if needed
const clearButtonSelector = '.ctla-sidebar button:contains("Clear Filters")'; // Adjust if needed
const applyButtonSelector = '.ctla-sidebar button:contains("Apply Filters")'; // Adjust if needed

// Import the environment setup steps
// These steps are crucial for setting up the INT_TEST_APP_PARAMS object
// that the application needs to properly initialize URL parameter mappings
Given('{string} is set to {string}', (key, param) => {
	cy.on('window:before:load', (win) => {
		if (!win.INT_TEST_APP_PARAMS) {
			win.INT_TEST_APP_PARAMS = {};
		}
		win.INT_TEST_APP_PARAMS[key] = param;
	});
});

Given('{string} object is set to {string}', (key, param) => {
	cy.on('window:before:load', (win) => {
		if (!win.INT_TEST_APP_PARAMS) {
			win.INT_TEST_APP_PARAMS = {};
		}
		const newObj = {};
		newObj[param] = win.INT_TEST_APP_PARAMS[key] ? win.INT_TEST_APP_PARAMS[key][param] : {};
		win.INT_TEST_APP_PARAMS[key] = newObj[param];
	});
});

// Given steps (Assuming disease context step exists elsewhere)
Given('user is viewing the preview site for interventions at {string}', (path) => {
	// Set up the necessary INT_TEST_APP_PARAMS before visiting the page
	cy.on('window:before:load', (win) => {
		if (!win.INT_TEST_APP_PARAMS) {
			win.INT_TEST_APP_PARAMS = {};
		}
		win.INT_TEST_APP_PARAMS['trialListingPageType'] = 'Intervention';
		win.INT_TEST_APP_PARAMS['dynamicListingPatterns'] = { Intervention: {} };
	});

	cy.visit(path);
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 20000 });
});

// Then steps
Then('page redirects to {string}', (expectedPathAndQuery) => {
	// Wait for potential redirect and check URL
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 20000 });

	cy.location('pathname').should('eq', expectedPathAndQuery.split('?')[0]); // Check path part
	// Check query params if needed more specifically
	const expectedParams = new URLSearchParams(expectedPathAndQuery.split('?')[1]);
	cy.location('search').then((search) => {
		const actualParams = new URLSearchParams(search);
		expectedParams.forEach((value, key) => {
			expect(actualParams.get(key)).to.eq(value);
		});
	});
});

Then('No Trials Found message displays below the page title', () => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 20000 });

	// Check that the message exists and is visible
	cy.get(pageTitleSelector)
		.next() // Assuming the message container is the next sibling
		.find(noTrialsMessageSelector) // Find the specific message element
		.should('be.visible')
		.and('contain.text', 'No Trials Found'); // Check text if needed

	// Verify message position relative to title using vertical position comparison
	cy.get(pageTitleSelector).then(($title) => {
		cy.get(noTrialsMessageSelector).then(($message) => {
			// The message's top edge should be below the title's bottom edge
			expect($message.offset().top).to.be.greaterThan($title.offset().top + $title.height());
		});
	});

	// Alternative: Check DOM order to ensure message comes after title
	cy.get(pageTitleSelector)
		.parent()
		.children()
		.then(($children) => {
			const titleIndex = $children.index(cy.$$(`${pageTitleSelector}`));
			const messageContainerIndex = $children.index(cy.$$(`${noTrialsMessageSelector}`).closest('div, section'));
			expect(messageContainerIndex).to.be.greaterThan(titleIndex);
		});
});

// Then('CIS banner image displays below the No Trials Found message', () => {
// 	// Wait longer for the spinner to disappear
// 	cy.get('.nci-spinner').should('not.exist', { timeout: 20000 });
//
// 	// Check that the banner exists and is visible
// 	cy.get(noTrialsMessageSelector)
// 		.closest('div, section') // Find a common parent container
// 		.find(cisBannerSelector)
// 		.should('be.visible');
//
// 	// Verify banner position relative to message using vertical position comparison
// 	cy.get(noTrialsMessageSelector).then(($message) => {
// 		cy.get(cisBannerSelector).then(($banner) => {
// 			// The banner's top edge should be below the message's bottom edge
// 			expect($banner.offset().top).to.be.greaterThan($message.offset().top + $message.height());
// 		});
// 	});
//
// 	// Alternative: Check DOM order to ensure banner comes after message
// 	cy.get(noTrialsMessageSelector)
// 		.closest('div, section')
// 		.children()
// 		.then(($children) => {
// 			const messageIndex = $children.index(cy.$$(`${noTrialsMessageSelector}`).closest('div, p'));
// 			const bannerIndex = $children.index(cy.$$(`${cisBannerSelector}`).closest('div, img'));
// 			expect(bannerIndex).to.be.greaterThan(messageIndex);
// 		});
// });

// Implementation of the commented-out steps
Then('Age parameter text input empty and disabled', () => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 20000 });

	// Check that the age input is empty
	cy.get(ageInputSelector)
		.should('have.value', '') // Empty value
		.and('be.disabled'); // Disabled state
});

Then('Location by ZIP Code text input is empty and disabled', () => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 20000 });

	// Check that the zip code input is empty
	cy.get(zipInputSelector)
		.should('have.value', '') // Empty value
		.and('be.disabled'); // Disabled state
});

Then('Radius displays {string} and is disabled', (displayText) => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 20000 });

	// Check that the radius dropdown shows the expected text and is disabled
	cy.get(radiusSelectSelector)
		.find('option:selected') // Get the selected option
		.should('have.text', displayText); // Check its text

	cy.get(radiusSelectSelector).should('be.disabled'); // Check disabled state
});

Then('the {string} button is disabled', (buttonText) => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 20000 });

	if (buttonText === 'Clear Filters') {
		cy.get(clearButtonSelector).should('be.disabled');
	} else if (buttonText === 'Apply Filters') {
		cy.get(applyButtonSelector).should('be.disabled');
	} else {
		throw new Error(`Unknown button: ${buttonText}`);
	}
});
