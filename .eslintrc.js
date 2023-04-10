const jestRules = require('eslint-plugin-jest').rules;
const jestDomRules = require('eslint-plugin-jest-dom').rules;
const testLibRules = require('eslint-plugin-testing-library').rules;

const disableAllRules = (pluginName, rules) => {
	return Object.keys(rules).reduce((ac, ruleName) => {
		return {
			...ac,
			[`${pluginName}/${ruleName}`]: 'off',
		};
	}, {});
};

// We need to turn off jest rules for cypress because
// Cypress uses expect.
const cypressRuleDisables = {
	...disableAllRules('jest', jestRules),
	...disableAllRules('jest-dom', jestDomRules),
	...disableAllRules('testing-library', testLibRules),
};

module.exports = {
	extends: '@nciocpl/eslint-config-react',
	globals: {
		cy: true,
		Cypress: true,
		getFixture: true,
	},
	overrides: [
		{
			files: ['cypress/**/*.js'],
			rules: cypressRuleDisables,
		},
	],
};
