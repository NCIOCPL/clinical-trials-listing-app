const fs = require('fs');
const path = require('path');
const util = require('util');
const deepEqual = require('deep-equal');

/**
 * Async wrapper for readDir
 */
const readDirAsync = util.promisify(fs.readdir);

/**
 * Async wrapper for readFile
 */
const readFileAsync = util.promisify(fs.readFile);

/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * Regex used multiple places for matching request file names.
 */
const requestFileRegex = /request\.json$/;

/**
 * Gets all the request objects for the mocks.
 * @param {string} mockDir
 */
const getRequests = async (mockDir) => {
	const reqLoadPromises = (await readDirAsync(mockDir))
		.filter((filename) => filename.match(requestFileRegex))
		.map(async (requestFilename) => {
			const responseFilename = requestFilename.replace(
				requestFileRegex,
				'response.json'
			);

			// No using require cause it will do wonky things sometimes if an
			// error is occurred.
			const reqObj = JSON.parse(
				await readFileAsync(path.join(mockDir, requestFilename))
			);

			return {
				requestObject: reqObj,
				mockFileName: path.join(mockDir, responseFilename),
			};
		});

	const requestObjects = (await Promise.all(reqLoadPromises)).reduce(
		(ac, curr) => [...ac, curr],
		[]
	);

	return requestObjects;
};

/**
 * Mock handler for posting to /v1/clinical-trials endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const clinicalTrialsPost = async (req, res, next) => {
	// Get the post body
	const apiReq = req.body;
	if (!apiReq) {
		res.status(404).end();
	}

	// This is the folder to check
	const mockDir = path.join(__dirname, '..', '..', 'mock-data', 'v2', 'trials');

	// TODO: Only do this once...
	const requestObjs = await getRequests(mockDir);

	// Deep compare apiReq and mock.
	const matchingMock = requestObjs.find((reqObj) => {

		return deepEqual(reqObj.requestObject, apiReq);
	});
	if (matchingMock) {
		res.sendFile(matchingMock.mockFileName);
	} else {
		// Add request details to the warning message
		console.warn(
			`No clinical-trials mock found for request.\nURL: ${req.originalUrl}\nBody: ${JSON.stringify(apiReq, null, 2)}`
		);
		res.status(404).end();
	}
};

/**
 * Mock handler for posting to /v1/clinical-trials endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const clinicalTrialsGet = async (req, res, next) => {
	// I don't think this example exists.
	res.status(501).end();
};

/**
 * Entry point for /v1/clinical-trials requests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockClinicalTrials = async (req, res, next) => {
	if (req.method === 'GET') {
		return clinicalTrialsGet(req, res, next);
	} else if (req.method === 'POST') {
		return clinicalTrialsPost(req, res, next);
	} else {
		// Method not allowed
		res.status(405).end();
	}
};

module.exports = mockClinicalTrials;
