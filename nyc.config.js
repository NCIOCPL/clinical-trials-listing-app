'use strict';

/******
 * This file is the configuration for the final merged report.
 */
module.exports = {
	'report-dir': 'coverage/cypress',
	reporter: ['html', 'json', 'lcov'],
	exclude: [
		'cypress/**/*.js',
		'jest-test-setup.js',
		'src/serviceWorker.js',
		'src/setupTests.js',
		'*.test.js',
	],
};
