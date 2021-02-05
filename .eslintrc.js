module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
		jest: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:jsx-a11y/recommended',
		'prettier',
		'prettier/react',
	],
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 2016,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	plugins: ['jsx-a11y', 'prettier', 'react', 'react-hooks'],
	rules: {
		'no-unused-vars': 'off',
		'react/display-name': 'off',
	},
	globals: {
		cy: true,
		Cypress: true,
		getFixture: true,
	},
};
