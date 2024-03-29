/// <reference path="../../node_modules/@types/express/index.d.ts"/>

const express = require('express');

const mockClinicalTrials = require('./mock-clinical-trials/clinical-trials');
const mockListingInformationById = require('./mock-listing-information/listing-information-by-id');
const mockListingInformationByName = require('./mock-listing-information/listing-information-by-name');
const mockTrialTypeGetByName = require('./mock-trial-type/trial-type-by-name');
const  { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	// Any posts done with application/json will have thier body convered as an object.
	app.use(express.json());

	// CTS API Mocks
	// NOTE: The client does not allow us to change the base path.

	// v1 endpoints
	app.use('/api/listing-information/get', mockListingInformationById);
	app.use('/api/listing-information/:queryParam', mockListingInformationByName);
	app.use('/api/trial-type/:name', mockTrialTypeGetByName);

	// new v2 endpoints
	app.use('/cts/mock-api/v2/trials', mockClinicalTrials);
	app.use(
		'/cts/proxy-api/v2/**',
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
