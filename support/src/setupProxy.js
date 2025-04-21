/// <reference path="../../node_modules/@types/express/index.d.ts"/>

const express = require('express');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mockZipCodeLookup = require('./mock-zipcode-lookup');
const mockClinicalTrials = require('./mock-clinical-trials/clinical-trials');
const mockListingInformationById = require('./mock-listing-information/listing-information-by-id');
const mockListingInformationByName = require('./mock-listing-information/listing-information-by-name');
const mockTrialTypeGetByName = require('./mock-trial-type/trial-type-by-name');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	// Any posts done with application/json will have thier body convered as an object.
	app.use(express.json());

	// CTS API Mocks
	// NOTE: The client does not allow us to change the base path.

	// Log all requests
	// app.use((req, res, next) => {
	// 	console.log('Incoming request:', req.method, req.url);
	// 	next();
	// });

	// v1 endpoints
	app.use('/api/listing-information/get', mockListingInformationById);
	app.use('/api/listing-information/:queryParam', mockListingInformationByName);
	app.use('/api/trial-type/:name', mockTrialTypeGetByName);
	// Handle mock requests for the zip code lookup API
	app.use('/mock-api/zip_code_lookup/:zip', mockZipCodeLookup);

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
			onProxyReq: (proxyReq, req, res) => { // Added res
				// Strip cookies because CTSAPI chokes on certain ones.
				proxyReq.removeHeader('cookie');

				// It looks like our webpack-dev-server setup parses the body
				// before this proxy middleware. This causes the request to
				// no longer be a stream, and in turn that makes the actual
				// proxy request to not be sent to the server. So what has to
				// happen is that we need to write the body to the proxyReq
				// to turn it back into a stream. (which is what this conditional
				// does)
				// Capture request body for /trials endpoint
				if (!!req.body && Object.keys(req.body).length > 0) {
					const bodyData = JSON.stringify(req.body, null, 2); // Pretty print JSON
					// Check if it's the trials endpoint we want to capture
					if (req.path.startsWith('/cts/proxy-api/v2/trials')) {
						console.log('[Mock Capture] Capturing request for:', req.path);
						req.capturedRequestBody = bodyData; // Store for onProxyRes
					}

					// Rewrite body for the actual proxy request (existing logic)
					proxyReq.setHeader('Content-Type', 'application/json');
					proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
					proxyReq.write(bodyData);
				}
			},
			onProxyRes: (proxyRes, req, res) => {
				// Check if we captured a request body for this request
				if (req.capturedRequestBody) {
					console.log('[Mock Capture] Capturing response for:', req.path);
					let responseBody = '';
					proxyRes.on('data', (chunk) => {
						responseBody += chunk;
					});

					proxyRes.on('end', () => {
						// Only proceed with capturing if the environment variable is set
						if (process.env.CAPTURE_MOCKS === 'true') {
							console.log('[Mock Capture] Response received. CAPTURE_MOCKS=true');
							try {
								// Attempt to pretty-print if JSON, otherwise keep as is
								const formattedResponseBody = JSON.stringify(JSON.parse(responseBody), null, 2);

								const rl = readline.createInterface({
									input: process.stdin,
									output: process.stdout,
								});

								// Use setImmediate to avoid issues with terminal interaction during the event loop
								setImmediate(() => {
									rl.question('\n[Mock Capture] Enter a base filename for the mock (e.g., breast-cancer-page-2): ', (filename) => {
										if (!filename) {
											console.error('[Mock Capture] No filename provided. Mock files not saved.');
											rl.close();
											return;
										}

										const mockDir = path.resolve(__dirname, '../mock-data/v2/trials');
										const requestFilePath = path.join(mockDir, `${filename}-request.json`);
										const responseFilePath = path.join(mockDir, `${filename}-response.json`);

										try {
											// Ensure directory exists
											fs.mkdirSync(mockDir, { recursive: true });

											// Write request file
											fs.writeFileSync(requestFilePath, req.capturedRequestBody);
											console.log(`[Mock Capture] Request saved to: ${requestFilePath}`);

											// Write response file
											fs.writeFileSync(responseFilePath, formattedResponseBody);
											console.log(`[Mock Capture] Response saved to: ${responseFilePath}`);

										} catch (writeErr) {
											console.error('[Mock Capture] Error writing mock files:', writeErr);
										} finally {
											rl.close();
										}
									});
								});


							} catch (parseErr) {
								console.error('[Mock Capture] Error parsing response body as JSON. Cannot save mock files.', parseErr);
								// Optionally save the raw response if needed
								// fs.writeFileSync(responseFilePath + '.raw', responseBody);
							}
						} else {
							// console.log('[Mock Capture] Response received. CAPTURE_MOCKS not set. Skipping capture.');
						}
					});

					proxyRes.on('error', (err) => {
						console.error('[Mock Capture] Error receiving proxy response:', err);
					});
				}
				// Note: We don't explicitly pipe the response here.
				// http-proxy-middleware handles piping the original response
				// back to the client (`res`) by default, even with listeners attached.
			},
			changeOrigin: true,
			selfHandleResponse: false, // Ensure proxy handles response piping
		})
	);
};
