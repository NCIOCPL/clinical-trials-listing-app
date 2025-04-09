const fs = require('fs');
const path = require('path');
const util = require('util');

const hyphenateFileName = require('./hyphenate-file-name');
const isValidTrialStatusList = require('./is-valid-trial-status-list');
/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * Mock handler for posting to /v2/organizations endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const organizationsPost = async (req, res, next) => {
	res.status(501).end();
};

/**
 * Mock handler for get /v2/organizations endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const organizationsGet = async (req, res, next) => {
	const { current_trial_status, name, size } = req.query;

	// First strip off current_trial_status and ensure it matches our required types.
	// This way we don't have to make it part of the file name.
	if (!isValidTrialStatusList(current_trial_status)) {
		// Let's do a 400 here instead of 404 given it is less a mock is not found
		// but your request is broken.
		res.status(400).end();
		return;
	}

	// File naming is
	// <name>__<size>

	// TODO: This needs to be sanitized.

	const name_fragment = name ? name : 'empty';
	const size_fragment = size ? size : 'empty';
	const fileName = `${hyphenateFileName(name_fragment)}__${size_fragment}.json`;

	const mockFile = path.join(
		__dirname,
		'..',
		'..',
		'mock-data',
		'v2',
		'organizations',
		fileName
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
 * Entry point for /v2/organizations requests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockTrials = async (req, res, next) => {
	if (req.method === 'GET') {
		return organizationsGet(req, res, next);
	} else if (req.method === 'POST') {
		return organizationsPost(req, res, next);
	} else {
		// Method not allowed
		res.status(405).end();
	}
};

module.exports = mockTrials;
