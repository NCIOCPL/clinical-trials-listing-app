const fs = require('fs');
const path = require('path');
const util = require('util');

const isValidTrialStatusList = require('./is-valid-trial-status-list');
/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * Mock handler for posting to /v1/terms endpoint
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const termsPost = async (req, res, next) => {
  res.status(501).end();
}

/**
 * Mock handler for posting to /v1/terms endpoint
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const termsGet = async (req, res, next) => {
  const { term, current_trial_statuses, term_type, size, sort } = req.query;

  // First strip off current_trial_status and ensure it matches our required types.
  // This way we don't have to make it part of the file name.
  if (!isValidTrialStatusList(current_trial_statuses)) {
    // Let's do a 400 here instead of 404 given it is less a mock is not found
    // but your request is broken.
    res.status(400).end();
    return;
  }

  // File naming is
  // <term>_<term_type>_<size>_<sort>

  // TODO: This needs to be sanitized.

  const term_fragment = term ? term.toLowerCase() : "empty";
  const size_fragment = size ? size : "empty";
  const sort_fragment = sort ? sort : "empty";
  const term_type_fragment = term_type ? term_type : "empty";
  const fileName = `${term_fragment}_${term_type_fragment}_${sort_fragment}_${size_fragment}.json`;

  const mockFile = path.join(
    __dirname,
    '..',
    '..',
    'mock-data',
    'terms',
    fileName
  )

  try {
    await accessAsync(mockFile);
    res.sendFile(mockFile);
  } catch (err) {
      // Access denied to open file, or not found.
      // treat at 404, or your choice.
      console.error(err);
      res.status(404).end();
  }

}

/**
 * Entry point for /v1/terms requests.
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockTerms = async (req, res, next) => {
  if (req.method === 'GET') {
    return termsGet(req, res, next);
  } else if (req.method === 'POST') {
    return termsPost(req, res, next);
  } else {
    // Method not allowed
    res.status(405).end();
  }
} 

module.exports = mockTerms;