/// <reference path="../../node_modules/@types/express/index.d.ts"/>
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const mockZipCodeLookup = require('./mock-zipcode-lookup');
const { mockGenCache, mockDisplay } = require('./mock-cts-print');
const mockClinicalTrial = require('./mock-clinical-trials/clinical-trial');
const mockClinicalTrials = require('./mock-clinical-trials/clinical-trials');
const mockInterventions = require('./mock-clinical-trials/interventions');
const mockTerm = require('./mock-clinical-trials/term');
const mockTerms = require('./mock-clinical-trials/terms');
const mockDiseases = require('./mock-clinical-trials/diseases');
const mockTrials = require('./mock-clinical-trials/trials');
const mockTrial = require('./mock-clinical-trials/trial');
const mockOrganizations = require('./mock-clinical-trials/organizations');

module.exports = function (app) {
	// Any posts done with application/json will have thier body convered as an object.
	app.use(express.json());

	// CTS API V1 Mocks
	// NOTE: The client does not allow us to change the base path.
	// So
	app.use('/v1/clinical-trial/:id', mockClinicalTrial);
	app.use('/v1/clinical-trials', mockClinicalTrials);
	app.use('/v1/interventions', mockInterventions);
	app.use('/v1/term/:term_key', mockTerm);
	app.use('/v1/terms', mockTerms);
	app.use('/v1/diseases', mockDiseases);

	// Handle mock requests for the zip code lookup API
	app.use('/mock-api/zip_code_lookup/:zip', mockZipCodeLookup);

	// Handle mock requests from the CTS.Print API
	app.use('/mock-api/cts-print/GenCache', mockGenCache);
	app.use('/mock-api/cts-print/Display', mockDisplay);

	// The Zip Code API does not allow CORS headers, so we must proxy it for
	// local development.

	//CTS API V2 endpoints
	app.use('/cts/mock-api/v2/trials/:id', mockTrial);
	app.use('/cts/mock-api/v2/trials', mockTrials);
	app.use('/cts/mock-api/v2/diseases', mockDiseases);
	app.use('/cts/mock-api/v2/interventions', mockInterventions);
	app.use('/cts/mock-api/v2/organizations', mockOrganizations);
	app.use(
		'/cts/proxy-api/v2',
		createProxyMiddleware({
			target: 'https://clinicaltrialsapi.cancer.gov',
			headers: {
				'X-API-KEY': process.env.CTS_API_KEY,
			},
			pathRewrite: {
				'^/cts/proxy-api/v2': '/api/v2',
			},
			onProxyReq: (proxyReq, req) => {
				// Strip cookies because CTSAPI chokes on certain ones.
				proxyReq.removeHeader('cookie');

				// It looks like our webpack-dev-server setup parses the body
				// before this proxy middleware. This causes the request to
				// no longer be a stream, and in turn that makes the actual
				// proxy request to not be sent to the server. So what has to
				// happen is that we need to write the body to the proxyReq
				// to turn it back into a stream. (which is what this conditional
				// does)
				if (!!req.body && Object.keys(req.body).length > 0) {
					const bodyData = JSON.stringify(req.body);
					proxyReq.setHeader('Content-Type', 'application/json');
					proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
					proxyReq.write(bodyData);
				}
			},
			changeOrigin: true,
		})
	);
};
