/// <reference path="../../node_modules/@types/express/index.d.ts"/>

const express = require('express');

const mockClinicalTrials = require('./mock-clinical-trials/clinical-trials');


module.exports = function (app) {

  // Any posts done with application/json will have thier body convered as an object.
  app.use(express.json());

  // CTS API Mocks
  // NOTE: The client does not allow us to change the base path.
  // So 

  app.use('/api/clinical-trials', mockClinicalTrials);

}
