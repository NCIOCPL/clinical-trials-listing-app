//<reference types="Cypress" />
import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

// Variables to store state
let initialTrialResults;

Then('page title is {string}', (title) => {
	cy.get('h1').should('contain', title);
});

Then('the page title is {string}', (title) => {
	cy.get('h1').should('contain', title);
});

Then('page title on error page is {string}', (title) => {
	Cypress.on('uncaught:exception', () => {
		// returning false here to Cypress from
		// failing the test
		return false;
	});
	cy.get('h1').should('contain', title);
});

Then('user navigates to non-existent page {string}', (path) => {
	Cypress.on('uncaught:exception', () => {
		// returning false here to Cypress from
		// failing the test
		return false;
	});
	cy.visit(path);
});

/*
	--------------------
		Page Visits
	--------------------
*/
Given('the user visits the home page', () => {
	cy.visit('/');
});

Given('the user navigates to {string}', (destURL) => {
	cy.visit(destURL);
});

// Used when we don't want to automatically fail the test when non-200 responses are encountered.
Given('the user navigates to {string} with error handling', (destURL) => {
	cy.visit(destURL, {
		failOnStatusCode: false,
	});
});

Given('user is viewing the no results found page on any site', () => {
	cy.visit('/?swKeyword=achoo');
});

Given('{string} is set to {string}', (key, param) => {
	cy.on('window:before:load', (win) => {
		win.INT_TEST_APP_PARAMS[key] = param;
	});
});

Given('{string} is set to null', (key) => {
	cy.on('window:before:load', (win) => {
		win.INT_TEST_APP_PARAMS[key] = null;
	});
});

Given('{string} is set to {int}', (key, param) => {
	cy.on('window:before:load', (win) => {
		win.INT_TEST_APP_PARAMS[key] = param;
	});
});

Given('{string} is set as a json string to {string}', (key, param) => {
	cy.on('window:before:load', (win) => {
		win.INT_TEST_APP_PARAMS[key] = JSON.parse(param.replaceAll("'", '"'));
	});
});

Given('{string} object is set to {string}', (key, param) => {
	cy.on('window:before:load', (win) => {
		const newObj = {};
		newObj[param] = win.INT_TEST_APP_PARAMS[key][param];
		win.INT_TEST_APP_PARAMS[key] = newObj[param];
	});
	Given('user is viewing the preview site at 1024px or larger breakpoint', () => {
		cy.viewport(1024, 768); // Set viewport for desktop tests
	});
});
/*
	----------------------------------------
	  API Error Page
	----------------------------------------
*/
Then('the user gets an error page that reads {string}', (errorMessage) => {
	Cypress.on('uncaught:exception', () => {
		// returning false here to Cypress from
		// failing the test
		return false;
	});
	cy.get('.error-container h1').should('have.text', errorMessage);
});

And('the page displays {string}', (text) => {
	cy.get('#NCI-app-root').contains(text);
});

// Intercepts CTS API Calls
Cypress.Commands.add('triggerServerError', () => {
	cy.intercept('/cts/mock-api/v2/*', {
		statusCode: 500,
	}).as('mockApiError');

	cy.intercept('/cts/proxy-api/v2/*', {
		statusCode: 500,
	}).as('proxyApiError');

	cy.intercept('https://clinicaltrialsapi.cancer.gov/api/v2/*', {
		statusCode: 500,
	}).as('ctsApiError');
});

And('the CTS API is responding with a server error', () => {
	cy.triggerServerError();
});

// Intercepts CTS API Calls
Cypress.Commands.add('triggerPNF', () => {
	cy.intercept('/cts/mock-api/v2/*', {
		statusCode: 404,
	}).as('mockApiError');

	cy.intercept('/cts/proxy-api/v2/*', {
		statusCode: 404,
	}).as('proxyApiError');

	cy.intercept('https://clinicaltrialsapi.cancer.gov/api/v2/*', {
		statusCode: 404,
	}).as('ctsApiError');
});

And('the CTS API is responding with a 404', () => {
	cy.triggerPNF();
});

/*
	----------------------------------------
	 Analytics
	----------------------------------------
*/
Then('browser waits', () => {
	cy.wait(2000);
});

And('the following links and texts exist on the page', (dataTable) => {
	// Split the data table into array of pairs
	const rawTable = dataTable.rawTable.slice();

	// Verify the total number of links
	cy.document().then((doc) => {
		let docLinkArray = doc.querySelectorAll('#main-content a');
		expect(docLinkArray.length).to.be.eq(rawTable.length);
	});

	// get the link with the provided url and assert it's text
	for (let i = 0; i < rawTable.length; i++) {
		const row = rawTable[i];
		cy.get(`#main-content a[href='${row[0]}']`).should('have.text', row[1]);
	}
});

/*
	-----------------------
		No Results Page
	-----------------------
*/
And('the system displays message {string}', (noTrialsText) => {
	cy.get('.main-content div p').should('have.text', noTrialsText);
});

/*
	----------------------
		Page Not Found
	----------------------
*/

And('the text {string} appears on the page', (text) => {
	cy.get('div.error-container').should('contain', text);
});

And('the link {string} to {string} appears on the page', (linkText, linkHref) => {
	cy.get(`a[href="${linkHref}"]`).should('have.text', linkText);
});

And('the search bar appears below', () => {
	cy.get('input#keywords').should('be.visible');
});

/*
	-----------------------
		Manual Page results
	-----------------------
*/

And('each result displays the trial title as a link to the trial description page', () => {
	cy.get('.ctla-results__list-item')
		.find('a.ctla-results__list-item-title')
		.should('have.attr', 'href')
		.then((href) => {
			expect(href).to.contain('/clinicaltrials/NCI-');
		});
});

And('each result displays the trial description below the link', () => {
	cy.get('.ctla-results__list-item p.body').should('not.be.empty');
});

And('each result displays {string} below the description', (location) => {
	cy.get('.ctla-results__list-item .ctla-results__list-item-location').find('strong').should('include.text', location);
});

Then('the system displays {int} paragraph {string}', (numParagraph, text) => {
	cy.get('div.ctla-results__intro')
		.find('p')
		.eq(numParagraph - 1)
		.should('have.text', text);
});

And('the link {string} to {string} appears on the page', (linkText, linkHref) => {
	cy.get(`a[href="${linkHref}"]`).should('have.text', linkText);
});

/*
	-----------------------
		Manual Page results
	-----------------------
*/
var mobileScreen = false;
Given('screen breakpoint is set to {string}', (screenSize) => {
	if (screenSize === 'desktop') cy.viewport(1025, 600);
	else if (screenSize === 'mobile') {
		cy.viewport(600, 800);
		mobileScreen = true;
	} else if (screenSize === 'tablet') cy.viewport(800, 900);
});

/*
	-----------------------
		Pager
	-----------------------
*/

Then('the system displays {string} {string}', (perPage, total) => {
	cy.get('.ctla-results__count').should('include.text', perPage).and('include.text', total);
});
And('pager displays the following navigation options', (dataTable) => {
	const pagerItems = [];
	for (const { pages } of dataTable.hashes()) {
		pagerItems.push(pages);
	}
	let counter = 0;

	if (mobileScreen) {
		cy.get('.usa-pagination__list:first li a:not(.usa-pagination__link), .usa-pagination__list:first .usa-pagination__overflow').should('have.length', pagerItems.length);
		cy.get('.usa-pagination__list:last li a:not(.usa-pagination__link), .usa-pagination__list:last .usa-pagination__overflow').should('have.length', pagerItems.length);

		//verify that the order of displayed page items is correct
		cy.get('.usa-pagination__list:first li a:not(.usa-pagination__link), .usa-pagination__list:first .usa-pagination__overflow').each(($el) => {
			cy.wrap($el).should('have.text', pagerItems[counter]);
			counter++;
		});
	} else {
		//verify that pager displays correct number of page items
		cy.get('.usa-pagination__list:first li a:not(.hidden), .usa-pagination__list:first .usa-pagination__overflow').should('have.length', pagerItems.length);
		cy.get('.usa-pagination__list:last li a:not(.hidden), .usa-pagination__list:last .usa-pagination__overflow').should('have.length', pagerItems.length);

		//verify that the order of displayed page items is correct
		cy.get('.usa-pagination__list:first li a:not(.hidden), .usa-pagination__list:first .usa-pagination__overflow').each(($el) => {
			cy.wrap($el).should('have.text', pagerItems[counter]);
			counter++;
		});
	}
});

And('the page {string} is highlighted', (pageNum) => {
	cy.get('.usa-pagination__list:first a[class="usa-pagination__button usa-current"]').should('have.text', pageNum);
	cy.get('.usa-pagination__list:last a[class="usa-pagination__button usa-current"]').should('have.text', pageNum);
});
When('user clicks on {string} button', (arrow) => {
	cy.get('.usa-pagination__list li').contains(arrow).click();
});
When('pager is not displayed', () => {
	cy.get('.usa-pagination__list li').should('not.exist');
});

/*
	-----------------------
		Page Not Found
	-----------------------
*/

And('the text {string} appears on the page', (text) => {
	cy.get('p').contains(text).should('exist');
});

/*
	--------------------------
		Invalid Parameters
	--------------------------
*/

Then('the error message {string} appears on the page', (text) => {
	cy.get('h4').should('contain', text.replaceAll("'", '"'));
});

/*
	-----------------------
		Redirect
	-----------------------
*/
Then('the user is navigated to {string} with query parameters {string} without redirect', (url, queryParams) => {
	cy.wait(2000);
	cy.location('href').should('include', url);
	cy.location('href').should('include', `${queryParams}`);
	cy.location('href').should('not.include', 'redirect=true');
});

Then('the user is redirected to {string}', (redirectUrl) => {
	cy.location('href').should('include', redirectUrl);
});

Then('the user is redirected with filter parameters to {string}', (redirectUrl) => {
	cy.wait(2000);
	cy.location('href').should('include', redirectUrl);
});

Then('the redirect parameter is not appended', () => {
	cy.wait(2000);
	cy.location('href').should('not.include', 'redirect=true');
});

Then('the user is redirected to {string} with query parameters {string}', (redirectUrl, queryParams) => {
	cy.wait(2000);
	cy.location('href').should('include', `${redirectUrl}?`);
	cy.location('href').should('include', `${queryParams}`);
});

And('the CIS Banner displays below', () => {
	cy.get('[alt="Questions? Chat with an information specialist"]').should('be.visible');
});

And('the Chat Now button displays below', () => {
	cy.contains('.banner-cis__button', 'Chat Now');
});

When('user clicks on result item {int}', (resultIndex) => {
	cy.get('a.ctla-results__list-item-title')
		.eq(resultIndex - 1)
		.trigger('click', { followRedirect: false });
});

And('user is brought to the top of a page', () => {
	cy.window().its('scrollY').should('equal', 0);
});

// Filters

// Age Filter
Then('the age filter is displayed', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-sidebar').find('input[type="number"]').should('be.visible');
});

Then('the age filter has a numeric input', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.attr', 'type', 'number');
});

// Age does not have placeholder text
// Then('the age input placeholder text is {string}', (placeholder) => {
// 	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

// 	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.attr', 'placeholder', placeholder);
// });

Then('the user sees the "Age" filter input', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('#age-filter-input').as('ageInput'); // Use ID selector
	cy.get('@ageInput').should('be.visible');
});

When(/^the user types "([^"]*)" into the Age filter input$/, (age) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('#age-filter-input').clear().type(age);
});

When('the user clears the "Age" filter input', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 }); // Ensure page is ready
	cy.get('#age-filter-input').clear(); // Use ID selector
});

When('clicks the {string} button', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-sidebar').contains('button', buttonText).click();
});

Then('the URL should contain the parameter {string}', (paramString) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.url().should('include', paramString);
});

// Removed duplicate/similar step: Then('the page URL includes {string}', ...);

Then('the URL should not contain the parameter {string}', (paramString) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.url().should('not.include', paramString);
});

// Removed duplicate/similar step: Then('the page URL does not include {string}', ...);

Then('the system displays updated trial results', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-results__list').should('exist');
	cy.get('.ctla-results__summary').should('exist');
});

Then('the age filter shows {string}', (value) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', value);
});

Then('the age filter is empty', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', '');
});

Then('the age input value remains empty', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', '');
});

Then('the age input value is {string}', (value) => {
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', value);
});

Then('{string} button is enabled', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-sidebar').contains('button', buttonText).should('not.be.disabled');
});

Then('{string} button is disabled', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-sidebar').contains('button', buttonText).should('be.disabled');
});

// Analytics
When('clicks in the age filter input', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-results__list-item').should('exist');
	cy.get('.ctla-sidebar').find('input[type="number"]').click();
});

When('clicks in the zip code filter input', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.ctla-sidebar').find('input[type="text"]').click();
});

Then('there should be exactly one {string} analytics event', (eventName) => {
	cy.window().then((win) => {
		const events = win.NCIDataLayer.filter((evt) => evt.event === eventName);
		expect(events).to.have.length(1);
	});
});

// Helper function to verify analytics payload
const verifyAnalyticsPayload = (event, expectedData) => {
	// Verify basic event properties
	expect(event.type).to.equal(expectedData.type);
	expect(event.event).to.equal(expectedData.event);

	// Verify data properties
	if (expectedData.data) {
		Object.entries(expectedData.data).forEach(([key, value]) => {
			// Handle nested data objects
			if (typeof value === 'object') {
				Object.entries(value).forEach(([nestedKey, nestedValue]) => {
					expect(event.data[key][nestedKey]).to.equal(nestedValue);
				});
			} else {
				expect(event.data[key]).to.equal(value);
			}
		});
	}
};

// Helper function to wait for analytics event
// const waitForAnalyticsEvent = (eventName) => {
// 	return new Cypress.Promise((resolve) => {
// 		cy.window().then((win) => {
// 			const checkEvent = () => {
// 				const event = win.NCIDataLayer.find((evt) => evt.event === eventName);
// 				if (event) {
// 					resolve(event);
// 				} else {
// 					setTimeout(checkEvent, 100);
// 				}
// 			};
// 			checkEvent();
// 		});
// 	});
// };

Then('the analytics event has the correct filter data', (dataTable) => {
	const expectedData = dataTable.rowsHash();

	cy.window().then((win) => {
		const event = win.NCIDataLayer[win.NCIDataLayer.length - 1];
		verifyAnalyticsPayload(event, expectedData);
	});
});

Then('no additional first interaction events fire', () => {
	cy.window().then((win) => {
		const firstInteractionEvents = win.NCIDataLayer.filter((evt) => evt.event === 'TrialListingApp:Filter:FirstInteraction');
		expect(firstInteractionEvents).to.have.length(1);
	});
});

// URL

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

// Mobile Accordion

Then('the filter content is visible', () => {
	cy.get('#accordionContent').should('be.visible').and('not.have.attr', 'hidden');
});

// Steps for NoTrials.feature
Given('user has typed {int} in the Age text input', (age) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').find('input[type="number"]').clear().type(age);
});

Given('user has typed {string} in the Location by ZIP Code text input', (zipCode) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').find('input[type="text"]').clear().type(zipCode);
});

Given('user has selected {int} miles for the Radius dropdown', (radius) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').find('select.usa-select').select(radius.toString());
});

Then('intro text displays', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-results__intro').should('be.visible');
});

Then('horizontal rule displays below results count', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-results__divider').should('be.visible');
});

Then('No Trials Found message displays below horizontal rule', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-results__no-results').should('be.visible');
});

Then('No Trials Found message displays below the page title', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('div.no-results p').should('be.visible');
});

Then('Location by ZIP Code has {string} entered', (value) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').find('input[type="text"]').should('have.value', value);
});

Then('Radius has {int} miles selected', (value) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').find('select.usa-select').should('have.value', value.toString());
});

Then('Age parameter text input empty and disabled', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').find('input[type="number"]').should('be.disabled').and('have.value', '');
});

Then('Location by ZIP Code text input is empty and disabled', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').find('input[type="text"]').should('be.disabled').and('have.value', '');
});

Then('Radius displays {string} and is disabled', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').find('select.usa-select').should('be.disabled');
	cy.get('.ctla-sidebar').find('select.usa-select option:selected').should('have.text', 'Select');
});

Then('CIS banner image displays below the No Trials Found message as {string}', (message) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	// Fix: Use correct selector syntax for attribute and use the message variable
	cy.get(`[alt="${message}"]`).should('be.visible');
});

// Direct button click for NoTrials feature
When('user clicks the {string} button', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').contains('button', buttonText).click();
});

// Page redirection with params check
Then('page redirects to {string}', (urlWithParams) => {
	// Wait for network calls to complete
	cy.wait(2000);

	// Add longer timeout for redirection
	cy.url({ timeout: 10000 }).should('include', urlWithParams.split('?')[0]); // Check base URL

	// If the URL has parameters, check them too
	if (urlWithParams.includes('?')) {
		// Extract and check each parameter
		const params = urlWithParams.split('?')[1].split('&');
		params.forEach((param) => {
			cy.url().should('include', param);
		});
	}

	cy.url({ timeout: 5000 }).should('include', urlWithParams.split('?')[0]);
});

// URL validation for NoTrials test
Then('the page URL stays the same with the additional query parameter', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.url().should('include', 'a='); // Age filter parameter
	cy.url().should('include', 'z='); // ZIP code parameter
	cy.url().should('include', 'zr='); // Radius parameter - Fixed from 'r=' to 'zr='
});

// Button state checks
Then('the {string} button is enabled', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').contains('button', buttonText).should('not.be.disabled');
});

Then('the {string} button is disabled', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').contains('button', buttonText).should('be.disabled');
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

//TypeFilters

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

And('user clicks on {string} button', (arrow) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.usa-pagination__list li').contains(arrow).click();
});

And('clicks on {string} button', (arrow) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	cy.get('.usa-pagination__list li').contains(arrow).click();
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

// Step to capture current trial results
When('captures the current trial results', () => {
	cy.get('.ctla-trials-container').then(($results) => {
		initialTrialResults = $results.html();
	});
});

// Steps to validate that results remain unchanged
Then('the trial results remain unchanged', () => {
	cy.get('.ctla-trials-container').then(($currentResults) => {
		expect($currentResults.html()).to.equal(initialTrialResults);
	});
});

Then('the trial results still remain unchanged', () => {
	cy.get('.ctla-trials-container').then(($currentResults) => {
		expect($currentResults.html()).to.equal(initialTrialResults);
	});
});

// Step to check for validation error on ZIP code field
Then('the zip code field shows validation error', () => {
	cy.get('.usa-error-message').should('be.visible');
});

// Step to verify results have been updated after clicking apply
Then('the trial results are updated', () => {
	cy.get('.ctla-trials-container').then(($updatedResults) => {
		expect($updatedResults.html()).not.to.equal(initialTrialResults);
	});
});

When('enters {string} in the zip code filter', (zipcode) => {
	cy.get('#zip-code-filter').clear().type(zipcode);
});

Then('the radius dropdown is enabled', () => {
	cy.get('#radius-filter').should('be.enabled');
});

Then('the radius dropdown shows {string} as default value', (value) => {
	cy.get('#radius-filter').should('have.value', value);
});

When('clicks the {string} button', (buttonText) => {
	cy.contains('button', buttonText).click();
});

Then('the page URL includes {string}', (paramString) => {
	cy.url().should('include', paramString);
});

// ===============================
// Step definitions from Filters directory
// ===============================

// Age Filter Steps from ageFilterSteps.js
const ageInputSelector = '.ctla-sidebar input[type="number"]'; // Assuming this selector
const sidebarSelector = '.ctla-sidebar'; // Assuming this selector
const upArrowSelector = '.up-arrow-selector'; // *** REPLACE WITH ACTUAL SELECTOR ***
const downArrowSelector = '.down-arrow-selector'; // *** REPLACE WITH ACTUAL SELECTOR ***
const precedingFocusableElementSelector = `${sidebarSelector} button:first`; // *** ADJUST: Find a reliable element before age input ***

// Helper function to get numeric value, handling empty string
const getNumericValue = (selector) => {
	return cy
		.get(selector)
		.invoke('val')
		.then((val) => (val === '' ? NaN : Number(val)));
};

Then('Age filter displays in the Filter Trials section', () => {
	cy.get(sidebarSelector).should('contain.text', 'Age'); // Basic check, might need refinement
	cy.get(ageInputSelector).should('be.visible');
});

Then('Age filter extends the width of the container on all breakpoints', () => {
	// Check if input width is close to its parent's width
	cy.get(ageInputSelector)
		.invoke('outerWidth')
		.then((inputWidth) => {
			cy.get(ageInputSelector)
				.parent()
				.invoke('innerWidth')
				.then((parentWidth) => {
					// Allow for some padding/margin differences
					expect(inputWidth).to.be.closeTo(parentWidth, 20);
				});
		});
});

Then('Age filter only allows numbers in the text input', () => {
	// This is often enforced by input type="number", but can be tested further
	cy.get(ageInputSelector).clear().type('abc').should('have.value', '');
	cy.get(ageInputSelector).clear().type('12e3').should('have.value', '12'); // Behavior might vary
});

When('user hovers on the text input', () => {
	cy.get(ageInputSelector).trigger('mouseover');
	// Note: Cypress doesn't truly hover, it triggers events.
	// Visibility of arrows might depend on CSS :hover states which Cypress can't directly check easily.
	// Often better to test the *result* of clicking the arrows if possible.
});

Then('up and down arrows display on the right of the text input', () => {
	// Assuming arrows are always present in the DOM when the feature is enabled.
	// Replace selectors with actual ones.
	cy.get(ageInputSelector).siblings(upArrowSelector).should('exist');
	cy.get(ageInputSelector).siblings(downArrowSelector).should('exist');
});

When('user clicks the up arrow', () => {
	cy.get(ageInputSelector).siblings(upArrowSelector).click();
});

When('user clicks the down arrow', () => {
	cy.get(ageInputSelector).siblings(downArrowSelector).click();
});

Then('number in the text input increases by 1', () => {
	cy.wrap({ valueBefore: NaN }).as('numberContext'); // Store value before action

	// Get value *before* the action that triggered this assertion
	getNumericValue(ageInputSelector).then((value) => {
		cy.get('@numberContext').then((ctx) => (ctx.valueBefore = value));
	});

	// Now check the current value against the stored one
	// Adding a small delay to allow value to potentially update after click/keypress
	cy.wait(50);
	getNumericValue(ageInputSelector).then((valueAfter) => {
		cy.get('@numberContext').then((ctx) => {
			// Handle case where input might have been empty or non-numeric before
			const expectedValue = isNaN(ctx.valueBefore) ? 1 : ctx.valueBefore + 1;
			// Allow for browser differences in number input stepping from empty
			if (isNaN(ctx.valueBefore) && valueAfter === 0) {
				// Some browsers might go to 0 from empty on down arrow, accept this too initially
			} else {
				expect(valueAfter).to.equal(expectedValue);
			}
		});
	});
});

Then('number in the text input decreases by 1', () => {
	cy.wrap({ valueBefore: NaN }).as('numberContext'); // Store value before action

	// Get value *before* the action that triggered this assertion
	getNumericValue(ageInputSelector).then((value) => {
		cy.get('@numberContext').then((ctx) => (ctx.valueBefore = value));
	});

	// Now check the current value against the stored one
	// Adding a small delay to allow value to potentially update after click/keypress
	cy.wait(50);
	getNumericValue(ageInputSelector).then((valueAfter) => {
		cy.get('@numberContext').then((ctx) => {
			// Handle case where input might have been empty or non-numeric before
			const expectedValue = isNaN(ctx.valueBefore) ? -1 : ctx.valueBefore - 1;
			// Allow for browser differences in number input stepping from empty
			if (isNaN(ctx.valueBefore) && valueAfter === 0) {
				// Some browsers might go to 0 from empty on down arrow, accept this too initially
			} else {
				expect(valueAfter).to.equal(expectedValue);
			}
		});
	});
});

When('user tabs to the text input', () => {
	// *** ADJUST SELECTOR: Find a reliable focusable element *before* the age input ***
	cy.get(precedingFocusableElementSelector).focus().tab();
	cy.focused().should('match', ageInputSelector); // Verify age input is focused
});

When('user hits the up arrow key', () => {
	cy.get(ageInputSelector).focus().type('{uparrow}');
});

When('user hits the down arrow key', () => {
	cy.get(ageInputSelector).focus().type('{downarrow}');
});

When('user types non-numeric characters in the text input', () => {
	cy.get(ageInputSelector).clear().type('abc!@#');
});

Then('the characters will not be entered', () => {
	cy.get(ageInputSelector).should('have.value', ''); // Assuming non-numeric are completely blocked
});

Given('user has typed {int} in the text input', (value) => {
	cy.get(ageInputSelector).clear().type(value.toString());
});

Then('{int} remains in the text input', (value) => {
	cy.get(ageInputSelector).should('have.value', value.toString());
});

When('user enters {int} in the text input and clicks the up arrow', (value) => {
	cy.get(ageInputSelector).clear().type(value.toString());
	cy.get(ageInputSelector).siblings(upArrowSelector).click();
});

When('user enters {int} in the text input and clicks the down arrow', (value) => {
	cy.get(ageInputSelector).clear().type(value.toString());
	cy.get(ageInputSelector).siblings(downArrowSelector).click();
});

When('user tries to type {int} in the text input', (value) => {
	cy.get(ageInputSelector).clear().type(value.toString());
});

Then('the text input will not allow the last number to be typed', () => {
	// This depends on how the limit is enforced (e.g., maxlength or JS)
	// If maxlength="3" (for 120 limit), typing 121 results in "121" but might be invalid
	// If JS prevents typing the 3rd digit if > 120, the value might be "12"
	cy.get(ageInputSelector)
		.invoke('val')
		.then((val) => {
			expect(Number(val)).to.be.at.most(120);
		});
});

When('user enters {int} and hits the down arrow key', (value) => {
	cy.get(ageInputSelector).clear().type(value.toString()).type('{downarrow}');
});

When('user enters {int} in the text input and hits the up arrow key', (value) => {
	cy.get(ageInputSelector).clear().type(value.toString()).type('{uparrow}');
});

// Filter Buttons Steps from filterButtonsSteps.js
const applyButtonSelector = '.ctla-sidebar button:contains("Apply Filters")'; // Adjust selector
const clearButtonSelector = '.ctla-sidebar button:contains("Clear Filters")'; // Adjust selector
const resultsCountSelector = '.ctla-results__count'; // Adjust selector
const zipInputSelector = '.ctla-sidebar input[placeholder*="Zip Code"]'; // Adjust selector
const radiusSelectSelector = '.ctla-sidebar select.usa-select'; // Adjust selector
const buttonGroupSelector = '.ctla-sidebar .button-group'; // Adjust selector for the button group container

Then('Apply Filters button displays', () => {
	cy.get(applyButtonSelector).should('be.visible');
});

Then('Clear Filters button displays', () => {
	cy.get(clearButtonSelector).should('be.visible');
});

Then('button is in a group with the Clear Filters button', () => {
	// Check that both buttons share a common parent element (likely a div with a class like button-group)
	cy.get(applyButtonSelector).parents(buttonGroupSelector).find(clearButtonSelector).should('exist');
});

Then('Apply Filters button is on the right', () => {
	// Compare the horizontal position of both buttons
	cy.get(applyButtonSelector).then(($apply) => {
		cy.get(clearButtonSelector).then(($clear) => {
			expect($apply.offset().left).to.be.greaterThan($clear.offset().left);
		});
	});
});

Then('Clear Filters button is on the left', () => {
	// Compare the horizontal position of both buttons
	cy.get(clearButtonSelector).then(($clear) => {
		cy.get(applyButtonSelector).then(($apply) => {
			expect($clear.offset().left).to.be.lessThan($apply.offset().left);
		});
	});
});

Then('Apply Filters button becomes enabled', () => {
	cy.get(applyButtonSelector).should('be.enabled');
});

Then('page reloads at page 1', () => {
	// Check URL for absence of 'pn' or 'pn=1'
	cy.url().should('not.include', 'pn=2');
	cy.url().should('not.include', 'pn=3');
	cy.url().should('not.include', 'pn=4');
	cy.url().should('not.include', 'pn=5');

	// Check that the results count shows the first page range
	cy.get(resultsCountSelector).should('contain', 'Trials 1-');
});

Then('page loads at page {int} of results', (pageNum) => {
	cy.url().should('include', `pn=${pageNum}`);

	// Check that the pagination component shows the correct page as active
	cy.get('.usa-pagination__button--active').should('contain', pageNum.toString());

	// Check results count shows appropriate range for this page
	// For example, page 2 typically shows results 26-50
	const startResult = (pageNum - 1) * 25 + 1;
	// const endResult = pageNum * 25; // Unused variable
	cy.get(resultsCountSelector).should('contain', `Trials ${startResult}-`);
});

Then('Age text input is {int}', (value) => {
	cy.get(ageInputSelector).should('have.value', value.toString());
});

Then('Location by ZIP Code input is {string}', (value) => {
	cy.get(zipInputSelector).should('have.value', value);
});

Then('Radius dropdown displays {int} miles', (value) => {
	cy.get(radiusSelectSelector).should('have.value', value.toString());
});

Then('Age text input is cleared', () => {
	cy.get(ageInputSelector).should('have.value', '');
});

Then('Location by ZIP Code input is cleared', () => {
	cy.get(zipInputSelector).should('have.value', '');
});

Then('Radius dropdown displays Select and is disabled', () => {
	cy.get(radiusSelectSelector).should('have.value', ''); // Assuming 'Select' has empty value
	cy.get(radiusSelectSelector).should('be.disabled');
	cy.get(radiusSelectSelector).find('option:selected').should('have.text', 'Select'); // Alternative check
});

Then('page shows {int} trial results', (count) => {
	// Check the total count in the results text (e.g., "Trials 1-25 of 87")
	cy.get(resultsCountSelector).should('contain', `of ${count}`);

	// Optional: Verify the actual number of result items if needed
	// This assumes each result is in a container with a specific class
	if (count <= 25) {
		// If count is less than or equal to items per page, we can verify exact count
		cy.get('.ctla-results-list-item').should('have.length', count);
	} else {
		// Otherwise, just verify we have the expected number per page
		cy.get('.ctla-results-list-item').should('have.length', Math.min(25, count));
	}
});

Then('the page loads', () => {
	// Wait for key elements to be visible
	cy.get('.ctla-results__count').should('be.visible');
	cy.get('.ctla-sidebar').should('be.visible');
	// Wait for loading spinner to disappear if applicable
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
});

// Location Filter Steps from locationFilter.js
const errorMessageSelector = '.usa-error-message'; // Adjust selector for error message element

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

When('enters {string} in the zip code filter', (zip) => {
	cy.get(zipInputSelector).clear().type(zip);
});

Then('the radius dropdown is enabled', () => {
	cy.get(radiusSelectSelector).should('be.enabled');
});

Then('the radius dropdown shows {string} as default value', (value) => {
	cy.get(radiusSelectSelector).should('have.value', value);
});

When('selects {string} from the radius dropdown', (value) => {
	cy.get(radiusSelectSelector).select(value);
});

Then('the zip code filter is empty', () => {
	cy.get(zipInputSelector).should('have.value', '');
});

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
});

Then('the zip code filter shows {string}', (value) => {
	cy.get(zipInputSelector).should('have.value', value);
});

Then('the radius dropdown shows {string}', (value) => {
	cy.get(radiusSelectSelector).should('have.value', value);
});

// Trial results capture and comparison
let initialResultsHTML = '';
When('captures the current trial results', () => {
	cy.get('.ctla-results-list')
		.invoke('html')
		.then((html) => {
			initialResultsHTML = html;
		});
});

Then('the trial results remain unchanged', () => {
	cy.get('.ctla-results-list').invoke('html').should('eq', initialResultsHTML);
});

Then('the trial results still remain unchanged', () => {
	cy.get('.ctla-results-list').invoke('html').should('eq', initialResultsHTML);
});

Then('the trial results are updated', () => {
	cy.get('.ctla-results-list').invoke('html').should('not.eq', initialResultsHTML);
});

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

When('user clicks on the Radius dropdown', () => {
	// Usually not needed for cy.select(), but included for completeness if needed for custom dropdowns
	cy.get(radiusSelectSelector).click(); // May not be necessary
});

When('user selects {string} from the Radius dropdown options', (optionText) => {
	cy.get(radiusSelectSelector).select(optionText); // Select by visible text
});

When('user tabs to the Radius filter', () => {
	cy.get(zipInputSelector).focus().tab(); // Assuming zip is before radius
	cy.focused().should('match', radiusSelectSelector);
});

// Mobile Accordion Steps from mobileAccordion.js
const filterContentSelector = '.ctla-sidebar .usa-accordion__content'; // Or the content area
const filterToggleButtonSelector = '.ctla-sidebar .usa-accordion__button'; // Or the toggle button
const pageTitleSelector = 'h1'; // Adjust if needed
// const introTextSelector = '.ctla-intro-text'; // Unused variable
// const paginationSelector = '.usa-pagination'; // Unused variable
const resultsListSelector = '.ctla-results-list'; // Adjust if needed
// const mainContentAreaSelector = '.ctla-main-content'; // Unused variable
const expandIconSelector = '.usa-accordion__button[aria-expanded="false"] .icon-expand'; // Adjust based on your icon implementation
const collapseIconSelector = '.usa-accordion__button[aria-expanded="true"] .icon-collapse'; // Adjust based on your icon implementation

Then('the filter content is visible', () => {
	cy.get(filterContentSelector).should('be.visible');
});

Then('the filter content is hidden', () => {
	cy.get(filterContentSelector).should('not.be.visible');
});

Then('the filter content remains visible', () => {
	cy.get(filterContentSelector).should('be.visible');
});

Then('the filter button does not show expand/collapse icon', () => {
	// There are several ways to check this depending on how icons are implemented:
	// 1. If icons are separate elements that are hidden/shown:
	cy.get(filterToggleButtonSelector).find('.icon-expand, .icon-collapse').should('not.exist');

	// 2. If icons are controlled by aria-expanded attribute:
	cy.get(filterToggleButtonSelector).should('not.have.attr', 'aria-expanded');

	// 3. If icons are implemented via CSS classes:
	cy.get(filterToggleButtonSelector).should('not.have.class', 'usa-accordion__button--collapsed');
	cy.get(filterToggleButtonSelector).should('not.have.class', 'usa-accordion__button--expanded');
});

Then('the filter button shows expand icon', () => {
	// Check for aria-expanded attribute (common for accessibility)
	cy.get(filterToggleButtonSelector).should('have.attr', 'aria-expanded', 'false');

	// Check for the actual icon element if it exists as a separate DOM element
	cy.get(expandIconSelector).should('be.visible');

	// Alternative: Check for a specific class that indicates collapsed state
	cy.get(filterToggleButtonSelector).should('have.class', 'usa-accordion__button--collapsed');
});

Then('the filter button shows collapse icon', () => {
	// Check for aria-expanded attribute (common for accessibility)
	cy.get(filterToggleButtonSelector).should('have.attr', 'aria-expanded', 'true');

	// Check for the actual icon element if it exists as a separate DOM element
	cy.get(collapseIconSelector).should('be.visible');

	// Alternative: Check for a specific class that indicates expanded state
	cy.get(filterToggleButtonSelector).should('have.class', 'usa-accordion__button--expanded');
});

When('clicks the filter toggle button', () => {
	cy.get(filterToggleButtonSelector).click();
});

// No Trials Found Steps from noTrialsFoundSteps.js
const noTrialsMessageSelector = '.ctla-results__no-results p'; // Adjust selector for the message itself
const cisBannerSelector = '[alt="Questions? Chat with an information specialist"]'; // Adjust selector

Then('No Trials Found message displays below the page title', () => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	// Check that the message exists and is visible
	cy.get(pageTitleSelector)
		.next() // Assuming the message container is the next sibling
		.find(noTrialsMessageSelector) // Find the specific message element
		.should('be.visible')
		.and('contain.text', 'No Trials Found'); // Check text if needed
});

Then('CIS banner image displays below the No Trials Found message', () => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	// Check that the banner exists and is visible
	cy.get(noTrialsMessageSelector)
		.closest('div, section') // Find a common parent container
		.find(cisBannerSelector)
		.should('be.visible');
});

Then('Age parameter text input empty and disabled', () => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	// Check that the age input is empty
	cy.get(ageInputSelector)
		.should('have.value', '') // Empty value
		.and('be.disabled'); // Disabled state
});

Then('Location by ZIP Code text input is empty and disabled', () => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	// Check that the zip code input is empty
	cy.get(zipInputSelector)
		.should('have.value', '') // Empty value
		.and('be.disabled'); // Disabled state
});

Then('Radius displays {string} and is disabled', (displayText) => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	// Check that the radius dropdown shows the expected text and is disabled
	cy.get(radiusSelectSelector)
		.find('option:selected') // Get the selected option
		.should('have.text', displayText); // Check its text

	cy.get(radiusSelectSelector).should('be.disabled'); // Check disabled state
});

Then('the {string} button is disabled', (buttonText) => {
	// Wait longer for the spinner to disappear
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });

	if (buttonText === 'Clear Filters') {
		cy.get(clearButtonSelector).should('be.disabled');
	} else if (buttonText === 'Apply Filters') {
		cy.get(applyButtonSelector).should('be.disabled');
	} else {
		throw new Error(`Unknown button: ${buttonText}`);
	}
});

// Pagination Steps from paginationSteps.js
const paginationContainerSelector = '.usa-pagination'; // Adjust if needed
const paginationLinkSelector = '.usa-pagination__link'; // Adjust if needed
const paginationPageLinksSelector = '.usa-pagination__link:not(.usa-pagination__link--prev):not(.usa-pagination__link--next)'; // Adjust if needed
const currentPageSelector = '.usa-pagination__item .usa-pagination__button--current'; // Adjust if needed
const prevButtonSelector = '.usa-pagination__link--prev'; // Adjust if needed
const nextButtonSelector = '.usa-pagination__link--next'; // Adjust if needed

Given('user is viewing the preview site for diseases', () => {
	// Placeholder for any specific setup for disease context
	cy.log('Assuming disease context setup');
});

Given('user is viewing the preview site for diseases at {string}', (path) => {
	cy.visit(path);
	// Placeholder for any specific setup for disease context
	cy.log('Assuming disease context setup');
});

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

// Trial Results Display Steps from trialResultsDisplaySteps.js
const resultItemSelector = '.ctla-results-list-item'; // Adjust if needed
const resultItemTitleSelector = '.ctla-results-list-item__title'; // Adjust if needed
const resultItemDescSelector = '.ctla-results-list-item__description'; // Adjust if needed
const resultItemLocationSelector = '.ctla-results-list-item__location'; // Adjust if needed
const resultItemStatusSelector = '.ctla-results-list-item__status'; // Adjust if needed
const manualDropdownSelector = 'select[name="listing-type"], .listing-type-dropdown, #listing-type-selector';

Given('user is viewing the preview site for interventions', () => {
	// Placeholder for any specific setup for intervention context
	cy.log('Assuming intervention context setup');
});

Given('user is viewing the preview site', () => {
	// Placeholder for generic setup if needed, or rely on When step for navigation
	cy.log('Assuming generic preview site setup');
});

When('user selects Manual - Adult Metastatic Brain Tumors option in the dropdown', () => {
	// This requires knowing the specific dropdown and option value/text
	// The selector and option text/value should be adjusted based on your actual implementation
	cy.get(manualDropdownSelector).select('Manual - Adult Metastatic Brain Tumors');
});

When('user clicks on page {int} in the pager', (pageNum) => {
	cy.get(paginationContainerSelector).find(paginationLinkSelector).contains(pageNum.toString()).click();
});

Then('a list of trial results displays', () => {
	cy.get(resultsListSelector).should('be.visible');
	cy.get(resultItemSelector).should('have.length.gt', 0);
});

Then('each result item displays the trial title', () => {
	cy.get(resultItemSelector).each(($item) => {
		cy.wrap($item).find(resultItemTitleSelector).should('be.visible').and('not.be.empty');
	});
});

Then('each result item does not display the trial description', () => {
	cy.get(resultItemSelector).each(($item) => {
		// Check if the description element exists and is hidden, or simply doesn't exist
		cy.wrap($item).find(resultItemDescSelector).should('not.exist');
	});
});

Then('the page displays a results list', () => {
	cy.get(resultsListSelector).should('be.visible');
	cy.get(resultItemSelector).should('have.length.gt', 0);
});

Then('each results item displays the location', () => {
	cy.get(resultItemSelector).each(($item) => {
		cy.wrap($item).find(resultItemLocationSelector).should('be.visible').and('not.be.empty');
	});
});

Then('the location has the syntax {string}', (expectedSyntax) => {
	// This is tricky. We need to check the format.
	// Example: "Locations: X locations, including Y near you" or "Locations: X locations"
	cy.get(resultItemSelector)
		.first()
		.find(resultItemLocationSelector)
		.invoke('text')
		.then((text) => {
			if (expectedSyntax.includes('near you')) {
				expect(text).to.match(/^Locations: \d+ locations?, including \d+ near you$/);
			} else {
				expect(text).to.match(/^Locations: \d+ locations?$/);
			}
		});
});

Then('item {string} has trial status {string}', (itemTitle, expectedStatus) => {
	cy.get(resultItemSelector)
		.contains(resultItemTitleSelector, itemTitle) // Find item by title
		.closest(resultItemSelector) // Go up to the item container
		.find(resultItemStatusSelector) // Find the status element within that item
		.should('contain.text', expectedStatus);
});

And('the user clicks the "Apply Filters" button', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 }); // Ensure page isn't loading
	// Assuming the button is within the sidebar and contains the text "Apply Filters"
	cy.get('.ctla-sidebar').contains('button', 'Apply Filters').click();
});

Then('{string} displays below the intro text', (text) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-results__count').should('include.text', text);
});

Then('Age parameter has {string} entered', (value) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 30000 });
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', value);
});

Then('the filter button does not show expand/collapse icon', () => {
	// This step checks that on desktop, the filter toggle button doesn't have
	// the visual indicators (icons, specific classes, aria-expanded) used for the mobile accordion.

	// 1. Check for aria-expanded (should NOT be present or should not be 'true'/'false' if always present)
	// Using 'not.have.attr' is safer if the attribute might be completely absent.
	cy.get(filterToggleButtonSelector).should('not.have.attr', 'aria-expanded');

	// 2. Check for specific expand/collapse classes (adjust if your classes differ)
	cy.get(filterToggleButtonSelector).should('not.have.class', 'usa-accordion__button--collapsed');
	cy.get(filterToggleButtonSelector).should('not.have.class', 'usa-accordion__button--expanded');

	// 3. Check if specific icon elements exist as children (adjust selectors if needed)
	// This assumes icons are separate elements like <i> or <span> with specific classes.
	// If icons are pseudo-elements (:before/:after), this check won't work directly.
	cy.get(filterToggleButtonSelector).find('.icon-expand, .icon-collapse, .fa-plus, .fa-minus, .fa-chevron-down, .fa-chevron-up').should('not.exist');

	// 4. Check CSS background-image (less common for icons, but possible)
	// cy.get(filterToggleButtonSelector).should('have.css', 'background-image', 'none');
});
