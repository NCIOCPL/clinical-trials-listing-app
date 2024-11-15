const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * Mock handler for posting to /v1/clinical-trial/:id endpoint
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const clinicalTrialGet = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).end();
  }

  const mockFile = path.join(
    __dirname,
    '..',
    '..',
    'mock-data',
    'clinical-trial',
    `${id}.json`
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
 * Entry point for /v1/clinical-trial/:id requests.
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockClinicalTrial = async (req, res, next) => {
  if (req.method === 'GET') {
    return clinicalTrialGet(req, res, next);
  } else {
    // Method not allowed
    res.status(405).end();
  }
} 

module.exports = mockClinicalTrial;