'use strict';

const path = require('path');
const fs = require('fs-extra');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
	throw err;
});

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const main = async () => {
	try {
		// Create, or empty, a tmp folder for the two coverage files.
		await fs.emptyDir(resolveApp('coverage/tmp'));
		// Copy the Jest coverage file
		await fs.copy(
			resolveApp('coverage/jest/coverage-final.json'),
			resolveApp('coverage/tmp/jest-final.json')
		);
		// Copy the Cypress coverage
		await fs.copy(
			resolveApp('coverage/cypress/coverage-final.json'),
			resolveApp('coverage/tmp/cypress-final.json')
		);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

main();
