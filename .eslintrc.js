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


// Default to development if we've somehow hit the linter without it being set
// react-scritps technically sets this to development also
if(process.env.NODE_ENV == null) {
	process.env.NODE_ENV = "development";
}


module.exports = {
	extends: '@nciocpl/eslint-config-react',
	parser: '@babel/eslint-parser',
	globals: {
		cy: true,
		Cypress: true,
		getFixture: true,
	},
	rules: {
		'react/jsx-filename-extension': [1, { allow: 'always' }],
		'testing-library/prefer-wait-for': 'off', //does not exist in testing library > 5
		'testing-library/no-render-in-setup': 'off' //does not exist in testing library > 5
	},
	overrides: [
		{
			files: ['cypress/**/*.js'],
			// rules: cypressRuleDisables,
		},
	],
};
