// Starting with Ubuntu 22.04, pa11y-ci requires us to tell it the Chrome binary's path
// Fortunately, GitHub Actions has an environment variable for that.
// The rest of this is so we don't break local development on Macs.
// According to the (current) docs, this can all go away once we upgrade pa11y-ci to 4.0 .
const defaultChromeLaunchConfig = {
	args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
};
const chromeLaunchConfig = process.env.CHROME_BIN
	? { executablePath: process.env.CHROME_BIN, ...defaultChromeLaunchConfig }
	: defaultChromeLaunchConfig;

module.exports = {
	urls: [
		'http://localhost:3000',
		'http://localhost:3000/C4872?cfg=0',
		'http://localhost:3000/breast-cancer?cfg=0&pn=3',
		'http://localhost:3000/chicken-nugget?cfg=0',
		'http://localhost:3000/notrials?p1=chronic-fatigue-syndrome',
	],
	chromeLaunchConfig: chromeLaunchConfig,
};
