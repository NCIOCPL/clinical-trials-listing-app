/**
 * Timeout function.
 *
 * So the tests only work when the modal appears, which means that the search
 * takes a while.
 *
 * @param {number} ms milliseconds
 * @returns {Promise}
 */
function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * mockGenCache - Middleware for mocking CTS.Print/GenCache API Requests.
 *
 * This allows us to mock api requests for integration tests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockGenCache = async (req, res) => {
	// This is currently going to accept anything and return a nice shiny print
	// id. This should be updated to you know, maybe actually test the
	// mechanism... Like what happens when a 500 is encountered, does the app
	// actually redirect, etc.

	const resData = {
		printID: 'd49690d4-3322-ed11-82da-0ed908919b64',
	};

	try {
		// Wait 1 seconds - should be fast enough for a computer.
		await timeout(1 * 1000);
		res.set('Content-Type', 'application/json; charset=utf-8');
		res.status(200).send(resData);
	} catch (err) {
		// This must be an error from sending the file, or joining
		// the path.
		console.error(err);
		res.status(500).end();
	}
};

/**
 * mockDisplay - Middleware for mocking CTS.Print/Display API Requests.
 *
 * This allows us to mock api requests for integration tests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockDisplay = async (req, res) => {
	// This is currently going to accept anything and return a nice hello world.
	// This should be updated to you know, maybe actually test the
	// mechanism... Like what happens when a 500 is encountered, does the app
	// actually redirect, etc.

	const resData = `
<html>
	<head><title>CTS.Print/Display</title></head>
	<body><h1>CTS.Print/Display</h1></body>
</html>
	`;

	try {
		res.set('Content-Type', 'text/html; charset=utf-8');
		res.status(200).send(resData);
	} catch (err) {
		// This must be an error from sending the file, or joining
		// the path.
		console.error(err);
		res.status(500).end();
	}
};

module.exports = {
	mockGenCache,
	mockDisplay,
};
