//<reference types="Cypress" />
import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

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
	cy.location('href').should('include', 'redirect=true');
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
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.ctla-sidebar').find('input[type="number"]').should('be.visible');
});

Then('the age filter has a numeric input', () => {
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.attr', 'type', 'number');
});

// Age does not have placeholder text
// Then('the age input placeholder text is {string}', (placeholder) => {
// 	cy.get('.nci-spinner').should('not.exist');

// 	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.attr', 'placeholder', placeholder);
// });

When('enters {string} in the age filter', (age) => {
	cy.get('.nci-spinner').should('not.exist');
	cy.get('.ctla-sidebar').find('input[type="number"]').clear().type(age);
});

When('clicks the {string} button', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.ctla-sidebar').contains('button', buttonText).click();
});

Then('the page URL includes {string}', (paramString) => {
	cy.get('.nci-spinner').should('not.exist');

	cy.url().should('include', paramString);
});

Then('the page URL does not include {string}', (paramString) => {
	cy.get('.nci-spinner').should('not.exist');

	cy.url().should('not.include', paramString);
});

Then('the system displays updated trial results', () => {
	cy.get('.nci-spinner').should('not.exist');
	cy.get('.ctla-results__list').should('exist');
	cy.get('.ctla-results__summary').should('exist');
});

Then('the age filter shows {string}', (value) => {
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', value);
});

Then('the age filter is empty', () => {
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', '');
});

Then('the age input value remains empty', () => {
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', '');
});

Then('the age input value is {string}', (value) => {
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', value);
});

Then('{string} button is enabled', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.ctla-sidebar').contains('button', buttonText).should('not.be.disabled');
});

Then('{string} button is disabled', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.ctla-sidebar').contains('button', buttonText).should('be.disabled');
});

// Analytics
When('clicks in the age filter input', () => {
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.ctla-results__list-item').should('exist');
	cy.get('.ctla-sidebar').find('input[type="number"]').click();
});

When('clicks in the zip code filter input', () => {
	cy.get('.nci-spinner').should('not.exist');

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

Then('Age parameter has {int} entered', (value) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
	cy.get('.ctla-sidebar').find('input[type="number"]').should('have.value', value.toString());
});

Then('Location by ZIP Code has {string} entered', (value) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
	cy.get('.ctla-sidebar').find('input[type="text"]').should('have.value', value);
});

Then('Radius has {int} miles selected', (value) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
	cy.get('.ctla-sidebar').find('select.usa-select').should('have.value', value.toString());
});

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

Then('CIS banner image displays below the No Trials Found message', () => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
	cy.get('[alt="Questions? Chat with an information specialist"]').should('be.visible');
});

// Direct button click for NoTrials feature
When('user clicks the {string} button', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
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
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
	cy.url().should('include', 'a='); // Age filter parameter
	cy.url().should('include', 'z='); // ZIP code parameter
	cy.url().should('include', 'zr='); // Radius parameter - Fixed from 'r=' to 'zr='
});

// Button state checks
Then('the {string} button is enabled', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
	cy.get('.ctla-sidebar').contains('button', buttonText).should('not.be.disabled');
});

Then('the {string} button is disabled', (buttonText) => {
	cy.get('.nci-spinner').should('not.exist', { timeout: 10000 });
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
	cy.get('.nci-spinner').should('not.exist');

	cy.get('.usa-pagination__list li').contains(arrow).click();
});

And('clicks on {string} button', (arrow) => {
	cy.get('.nci-spinner').should('not.exist');

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
