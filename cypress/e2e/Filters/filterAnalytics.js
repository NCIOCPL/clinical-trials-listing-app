/// <reference types="Cypress" />
import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When('clicks in the age filter input', () => {
	cy.get('.ctla-sidebar').find('input[type="number"]').click();
});

When('clicks in the zip code filter input', () => {
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
const waitForAnalyticsEvent = (eventName) => {
	return new Cypress.Promise((resolve) => {
		cy.window().then((win) => {
			const checkEvent = () => {
				const event = win.NCIDataLayer.find((evt) => evt.event === eventName);
				if (event) {
					resolve(event);
				} else {
					setTimeout(checkEvent, 100);
				}
			};
			checkEvent();
		});
	});
};

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
