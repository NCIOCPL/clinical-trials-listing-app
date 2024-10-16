/// <reference types="Cypress" />
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
	cy.get('div p').should('have.text', noTrialsText);
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
	cy.get('.ct-list-item')
		.find('a.ct-list-item__title')
		.should('have.attr', 'href')
		.then((href) => {
			expect(href).to.contain('/clinicaltrials/NCI-');
		});
});

And('each result displays the trial description below the link', () => {
	cy.get('.ct-list-item p.body').should('not.be.empty');
});

And('each result displays {string} below the description', (location) => {
	cy.get('.ct-list-item .location-info').find('strong').should('include.text', location);
});

Then('the system displays {int} paragraph {string}', (numParagraph, text) => {
	cy.get('div.intro-text')
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
Given('screen breakpoint is set to {string}', (screenSize) => {
	if (screenSize === 'desktop') cy.viewport(1025, 600);
	else if (screenSize === 'mobile') cy.viewport(600, 800);
	else if (screenSize === 'tablet') cy.viewport(800, 900);
});

/*
	-----------------------
		Pager
	-----------------------
*/

Then('the system displays {string} {string}', (perPage, total) => {
	cy.get('.paging-section__page-info').should('include.text', perPage).and('include.text', total);
});
And('pager displays the following navigation options', (dataTable) => {
	const pagerItems = [];
	for (const { pages } of dataTable.hashes()) {
		pagerItems.push(pages);
	}
	let counter = 0;
	//verify that pager displays correct number of page items
	cy.get('.pager__navigation:first li:visible').should('have.length', pagerItems.length);
	cy.get('.pager__navigation:last li:visible').should('have.length', pagerItems.length);

	//verify that the order of displayed page items is correct
	cy.get('.pager__navigation:first li:visible').each(($el) => {
		cy.wrap($el).should('have.text', pagerItems[counter]);
		counter++;
	});
});

And('the page {string} is highlighted', (pageNum) => {
	cy.get('.pager__navigation:first button[class="pager__button active"]').should('have.text', pageNum);
	cy.get('.pager__navigation:last button[class="pager__button active"]').should('have.text', pageNum);
});
When('user clicks on {string} button', (arrow) => {
	cy.get('.pager__navigation li').contains(arrow).click();
});
When('pager is not displayed', () => {
	cy.get('.pager__navigation li').should('not.exist');
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
Then('the user is redirected to {string}', (redirectUrl) => {
	cy.location('href').should('include', redirectUrl);
});

Then('the redirect parameter is not appended', () => {
	cy.location('href').should('not.include', 'redirect=true');
});

Then('the user is redirected to {string} with query parameters {string}', (redirectUrl, queryParams) => {
	cy.location('href').should('include', `${redirectUrl}?${queryParams}`);
});

And('the CIS Banner displays below', () => {
	cy.get('[alt="Questions? Chat with an information specialist"]').should('be.visible');
});

And('the Chat Now button displays below', () => {
	cy.contains('.banner-cis__button', 'Chat Now');
});

When('user clicks on result item {int}', (resultIndex) => {
	cy.get('a.ct-list-item__title')
		.eq(resultIndex - 1)
		.trigger('click', { followRedirect: false });
});

And('user is brought to the top of a page', () => {
	cy.window().its('scrollY').should('equal', 0);
});
