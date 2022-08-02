const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Async wrapper for readFile
 */
const readFileAsync = util.promisify(fs.readFile);

/**
 * Mock handler for posting to /v1/clinical-trials endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const listingInformationGetByName = async (req, res, next) => {
  const { queryParam } = req.params;

  // This is the folder to check
  const mockDir = path.join(
    __dirname,
    '..',
    '..',
    'mock-data',
    'listing-information'
  );

  try {
    const mockFile = path.join(mockDir, `${queryParam}.json`);
    await readFileAsync(mockFile);
    res.sendFile(mockFile);
  } catch (err) {
    const mockFile404 = path.join(mockDir, `${queryParam}-404.json`);
    if (fs.existsSync(mockFile404)) {
      res.status(404).end();
    } else {
      console.error(err);
      console.warn("No listing-information mock found for request.");
      res.status(404).end();
    }

  }
}

/**
 * Entry point for /v1/listing-information/get requests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockListingInformationByName = async (req, res, next) => {
  if (req.method === 'GET') {
    return listingInformationGetByName(req, res, next);
  } else {
    // Method not allowed
    res.status(405).end();
  }
}

module.exports = mockListingInformationByName;
