// const express = require('express');
// const fs = require('fs');
// const path = require('path');

// const router = express.Router();

// router.get('/', (req, res) => {
//   // Check if there's a search parameter (term is what the app is sending)
//   const searchTerm = req.query.term || req.query.name_contains || req.query.name;

//   if (searchTerm && searchTerm.toLowerCase() === 'br') {
//     // Look for the br mock file
//     const mockFilePath = path.join(
//       __dirname,
//       '../../mock-data/diseases/br_maintype-subtype-stage_10_empty.json'
//     );

//     try {
//       if (fs.existsSync(mockFilePath)) {
//         const mockData = JSON.parse(fs.readFileSync(mockFilePath, 'utf8'));

//         // Transform the data format to match what the application expects
//         // The app expects a 'terms' array where each item has key, label, and doc_count properties
//         const transformedData = {
//           terms: mockData.data.map(item => ({
//             key: item.codes[0],
//             label: item.name,
//             doc_count: item.count || 0
//           }))
//         };

//         return res.json(transformedData);
//       }
//     } catch (error) {
//       console.error('Error reading mock file:', error);
//     }
//   }

//   // If we get here, either:
//   // 1. The search term wasn't 'br'
//   // 2. The file couldn't be found
//   // 3. There was an error reading the file
//   // So we'll return an empty result with the format the app expects
//   return res.json({ terms: [] });
// });

// module.exports = router;
const fs = require('fs');
const { emptyDir } = require('fs-extra');
const path = require('path');
const util = require('util');

const isValidTrialStatusList = require('./is-valid-trial-status-list');

/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * Mock handler for posting to /v1/diseases endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const diseasesPost = async (req, res, next) => {
	// I don't think we use this, so not implementing
	res.status(501).end();
};

/**
 * Mock handler for posting to /v1/diseases endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const diseasesGet = async (req, res, next) => {
	const {
		code,
		current_trial_status,
		name,
		size,
		sort,
		type,
		ancestor_ids,
		maintype,
	} = req.query;
	const ancestor_ids_or_maintype = maintype ? maintype : ancestor_ids;
	// First strip off current_trial_status and ensure it matches our required types.
	// This way we don't have to make it part of the file name.
	if (!isValidTrialStatusList(current_trial_status)) {
		// Let's do a 400 here instead of 404 given it is less a mock is not found
		// but your request is broken.
		res.status(400).end();
	}

	// File naming is
	// <codesOrName>_<types>_<size>_<sort> if request does not include ancestor ids (only primary cancer type)
	//<codesOrName>_<types>_<size>_<sort>_<ancestor_id> when it does (when fetching subtype, stage, findings etc)
	// if one or more params are missing, then name them 'empty': <codes>_empty_<size>_empty
	// codes can be
	// C1-C2-C3 to separate the disease concepts
	//if name has a space, replace it with - : <breast-cancer>
	// each disease concept can have multiple IDs comma separated
	// so we could have C1,C2-C3-C4,C5 if we have 3 concepts, C1,C2 and C3 and C4,C5

	// TODO: This needs to be sanitized.
	const name_fragment = name ? name.replace(/\s/g, '-').toLowerCase() : 'empty';
	const ancestor_fragment =
		ancestor_ids_or_maintype && !Array.isArray(ancestor_ids_or_maintype)
			? ancestor_ids_or_maintype
			: ancestor_ids_or_maintype &&
			  Array.isArray(ancestor_ids_or_maintype) &&
			  ancestor_ids_or_maintype.length > 0
			? ancestor_ids_or_maintype.join('-')
			: '';
	const code_fragment =
		code && !Array.isArray(code)
			? code
			: code && Array.isArray(code) && code.length > 0
			? code.join('-')
			: 'empty';
	const type_fragment =
		type && !Array.isArray(type)
			? type
			: type && Array.isArray(type) && type.length > 0
			? type.join('-')
			: 'empty';
	const size_fragment = size ? size : 'empty';
	const sort_fragment = sort ? sort : 'empty';

	const codesOrName = name ? name_fragment : code_fragment;
	const partialFileName = `${codesOrName}_${type_fragment}_${size_fragment}_${sort_fragment}`;
	const fileName = ancestor_ids_or_maintype
		? `${partialFileName}_${ancestor_fragment}.json`
		: `${partialFileName}.json`;

	const mockFile = path.join(
		__dirname,
		'..',
		'..',
		'mock-data',
		'diseases',
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
 * Entry point for /v1/diseases requests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockDiseases = async (req, res, next) => {
	if (req.method === 'GET') {
		return diseasesGet(req, res, next);
	} else if (req.method === 'POST') {
		return diseasesPost(req, res, next);
	} else {
		// Method not allowed
		res.status(405).end();
	}
};

module.exports = mockDiseases;
