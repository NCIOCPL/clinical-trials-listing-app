const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * Mock handler for posting to /v2/trials/:id endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */

const trialGet = async (req, res, next) => {
	const { id } = req.params;

	if (!id) {
		res.status(400).end();
	}

	const mockFile = path.join(
		__dirname,
		'..',
		'..',
		'mock-data',
		'v2',
		'trials',
		'trial',
		`${id}.json`
	);

	try {
		await accessAsync(mockFile);
		res.sendFile(mockFile);
	} catch (err) {
		// Access denied to open file, or not found.
		// treat at 404, or your choice.
		console.error(err);
		res.status(404).end();
	}
};

/**
 * Entry point for /v2/trials/:id requests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockTrial = async (req, res, next) => {
	if (req.method === 'GET') {
		return trialGet(req, res, next);
	} else {
		// Method not allowed
		res.status(405).end();
	}
};

module.exports = mockTrial;
