/// <reference types="Cypress" />
import { Given } from 'cypress-cucumber-preprocessor/steps';

// Environment setup
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
