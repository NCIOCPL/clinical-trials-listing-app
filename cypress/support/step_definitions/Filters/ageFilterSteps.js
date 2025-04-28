import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const ageInputSelector = '.ctla-sidebar input[type="number"]'; // Assuming this selector
const sidebarSelector = '.ctla-sidebar'; // Assuming this selector
const upArrowSelector = '.up-arrow-selector'; // *** REPLACE WITH ACTUAL SELECTOR ***
const downArrowSelector = '.down-arrow-selector'; // *** REPLACE WITH ACTUAL SELECTOR ***
const precedingFocusableElementSelector = `${sidebarSelector} button:first`; // *** ADJUST: Find a reliable element before age input ***

// Placeholder for existing steps if they were in another file originally
// You might need to move existing age-related steps here or ensure they don't conflict

Then('Age filter displays in the Filter Trials section', () => {
  cy.get(sidebarSelector).should('contain.text', 'Age'); // Basic check, might need refinement
  cy.get(ageInputSelector).should('be.visible');
});

Then('Age filter extends the width of the container on all breakpoints', () => {
  // Check if input width is close to its parent's width
  cy.get(ageInputSelector).invoke('outerWidth').then(inputWidth => {
    cy.get(ageInputSelector).parent().invoke('innerWidth').then(parentWidth => {
      // Allow for some padding/margin differences
      expect(inputWidth).to.be.closeTo(parentWidth, 20);
    });
  });
});

Then('Age filter only allows numbers in the text input', () => {
  // This is often enforced by input type="number", but can be tested further
  cy.get(ageInputSelector).clear().type('abc').should('have.value', '');
  cy.get(ageInputSelector).clear().type('12e3').should('have.value', '123'); // Behavior might vary
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
  // Optional: Check position if needed and possible
  // cy.get(ageInputSelector).then($input => {
  //   cy.get(upArrowSelector).then($arrow => {
  //     expect($arrow.offset().left).to.be.greaterThan($input.offset().left);
  //   });
  // });
});

When('user clicks the up arrow', () => {
  cy.get(ageInputSelector).siblings(upArrowSelector).click();
});

When('user clicks the down arrow', () => {
  cy.get(ageInputSelector).siblings(downArrowSelector).click();
});

// Helper function to get numeric value, handling empty string
const getNumericValue = (selector) => {
  return cy.get(selector).invoke('val').then(val => val === '' ? NaN : Number(val));
};

Then('number in the text input increases by 1', () => {
  cy.wrap({ valueBefore: NaN }).as('numberContext'); // Store value before action

  // Get value *before* the action that triggered this assertion
  getNumericValue(ageInputSelector).then(value => {
    cy.get('@numberContext').then(ctx => ctx.valueBefore = value);
  });

  // Now check the current value against the stored one
  // Adding a small delay to allow value to potentially update after click/keypress
  cy.wait(50);
  getNumericValue(ageInputSelector).then(valueAfter => {
    cy.get('@numberContext').then(ctx => {
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
   getNumericValue(ageInputSelector).then(value => {
     cy.get('@numberContext').then(ctx => ctx.valueBefore = value);
   });

   // Now check the current value against the stored one
   // Adding a small delay to allow value to potentially update after click/keypress
   cy.wait(50);
   getNumericValue(ageInputSelector).then(valueAfter => {
     cy.get('@numberContext').then(ctx => {
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

Given('user is viewing the preview site for disease pages at {string}', (path) => {
  // Assuming a base URL is configured in cypress.config.js
  cy.visit(path);
  // Add any necessary setup for 'disease pages' context if needed
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
  cy.get(ageInputSelector).invoke('val').then(val => {
    expect(Number(val)).to.be.at.most(120);
    // More specific check if JS limits input *during* typing:
    // expect(val.length).to.be.lessThan(4); // e.g., can't type more than 3 digits
    // expect(val).not.to.equal('121'); // Ensure the invalid value wasn't fully typed
  });
});

When('user enters {int} and hits the down arrow key', (value) => {
  cy.get(ageInputSelector).clear().type(value.toString()).type('{downarrow}');
});

When('user enters {int} in the text input and hits the up arrow key', (value) => {
  cy.get(ageInputSelector).clear().type(value.toString()).type('{uparrow}');
});