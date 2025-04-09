const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * Mock handler for posting to /v1/term/:term_key endpoint
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const termGet = async (req, res, next) => {
  res.status(501).end();
}

/**
 * Entry point for /v1/term/:term_key requests.
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockTerm = async (req, res, next) => {
  if (req.method === 'GET') {
    return termGet(req, res, next);
  } else {
    // Method not allowed
    res.status(405).end();
  }
} 

module.exports = mockTerm;