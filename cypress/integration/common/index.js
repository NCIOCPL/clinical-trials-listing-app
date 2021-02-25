/// <reference types="Cypress" />
import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';

const baseURL = Cypress.config('baseUrl');

Then('page title is {string}', (title) => {
	cy.get('h1').should('contain', title);
});

Then('the page title is {string}', (title) => {
	cy.get('h1').should('contain', title);
});

Then('page title on error page is {string}', (title) => {
	Cypress.on('uncaught:exception', (err, runnable) => {
		// returning false here to Cypress from
		// failing the test
		return false;
	});
	cy.get('h1').should('contain', title);
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

Given('user is viewing the no results found page on any site', () => {
	cy.visit('/?swKeyword=achoo');
});

Given('{string} is set to {string}', (key, param) => {
	cy.on('window:before:load', (win) => {
		win.INT_TEST_APP_PARAMS[key] = param;
	});
});

Given('{string} is set as a json string to {string}', (key, param) => {
	cy.on('window:before:load', (win) => {
		win.INT_TEST_APP_PARAMS[key] = JSON.parse(param.replaceAll("'", '"'));
	});
});

/*
    ----------------------------------------
      API Error Page
    ----------------------------------------
*/
Then('the user gets an error page that reads {string}', (errorMessage) => {
	Cypress.on('uncaught:exception', (err, runnable) => {
		// returning false here to Cypress from
		// failing the test
		return false;
	});
	cy.get('.error-container h1').should('have.text', errorMessage);
});

And('the page displays {string}', (text) => {
	cy.get('#NCI-app-root').contains(text);
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

And(
	'the link {string} to {string} appears on the page',
	(linkText, linkHref) => {
		cy.get(`a[href="${linkHref}"]`).should('have.text', linkText);
	}
);

And('the search bar appears below', () => {
	cy.get('input#keywords').should('be.visible');
});

/*
    -----------------------
        Manual Page results
    -----------------------
*/

And(
	'each result displays the trial title as a link to the trial description page',
	() => {
		cy.get('.ct-list-item')
			.find('a.ct-list-item__title')
			.should('have.attr', 'href')
			.then((href) => {
				expect(href).to.contain('/clinicaltrials/NCI-');
			});
	}
);

And('each result displays the trial description below the link', () => {
	cy.get('.ct-list-item p.body').should('not.be.empty');
});

And('each result displays {string} below the description', (location) => {
	cy.get('.ct-list-item .location-info')
		.find('strong')
		.should('include.text', location);
});

Then('the system displays {int} paragraph {string}', (numParagraph, text) => {
	cy.get('div.intro-text')
		.find('p')
		.eq(numParagraph - 1)
		.should('have.text', text);
});

And(
	'the link {string} to {string} appears on the page',
	(linkText, linkHref) => {
		cy.get(`a[href="${linkHref}"]`).should('have.text', linkText);
	}
);
