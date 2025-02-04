const { defineConfig } = require('cypress');

module.exports = defineConfig({
	video: false,
	retries: 1,
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			return require('./cypress/plugins/index.js')(on, config);
		},
		specPattern: 'cypress/e2e/**/*.feature',
		baseUrl: 'http://localhost:3000',
	},
});
