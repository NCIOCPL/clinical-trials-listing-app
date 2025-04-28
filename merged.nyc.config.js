'use strict';

/******
 * This file is the configuration for the final merged report.
 */
module.exports = {
	'report-dir': 'coverage/merged',
	'temp-dir': 'coverage/merged',
	reporter: ['html', 'json', 'lcov', 'text'],
	'check-coverage': true,
	branches: 0,
	lines: 0,
	functions: 0,
	statements: 0,
	include: ['src/'],
	exclude: [
		'cypress/**/*.js',
		'jest-test-setup.js',
		'src/serviceWorker.js',
		'src/setupTests.js',
		'*.test.js',
	],
};
