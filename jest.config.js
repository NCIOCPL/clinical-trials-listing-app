module.exports = {
	roots: ['<rootDir>/src'],
	collectCoverage: true,
	coverageDirectory: 'coverage/jest',
	collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.test.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!cypress/**/*.{spec,test}.{js,jsx,ts,tsx}', '!src/setupTests.js', '!src/serviceWorker.js', '!src/index.jsx'],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
		},
	},
	setupFiles: ['react-app-polyfill/jsdom', '<rootDir>/jest-test-setup.js'],
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
	testMatch: [
		'<rootDir>/src/**/__tests__/**/*.{js,ts,tsx}',
		'<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
	],
	testEnvironment: 'jest-environment-jsdom-global',
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
		'^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
		'^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
	},
	transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|cjs|mjs|jsx|ts|tsx)$', '^.+\\.module\\.(css|sass|scss)$', 'node_modules/(?!axios)/'],
	testPathIgnorePatterns: [
		'<rootDir>/src/views/Disease/__tests__/Disease.BadParam.test.jsx',
		'<rootDir>/src/views/Disease/__tests__/Disease.Error.test.jsx',
		'<rootDir>/src/views/Disease/__tests__/Disease.NoTrialsFoundRedirect.test.jsx',
		'<rootDir>/src/views/Disease/__tests__/Disease.TrialType.Intervention.test.jsx',
		'<rootDir>/src/views/Disease/__tests__/Disease.TrialType.NoTrialsFoundRedirect.skiptest.skip.jsx',
		'<rootDir>/src/views/Disease/__tests__/Disease.TrialType.NoTrialsFoundRedirect.test.jsx',
		'<rootDir>/src/views/Disease/__tests__/Disease.TrialType.test.jsx',
		'<rootDir>/src/views/Disease/__tests__/Disease.test.jsx',
		'<rootDir>/src/views/Intervention/__tests__/Intervention.BadParam.test.jsx',
		'<rootDir>/src/views/Intervention/__tests__/Intervention.ErrorPage.test.jsx',
		'<rootDir>/src/views/Intervention/__tests__/Intervention.NoTrialsFoundRedirect.test.jsx',
		'<rootDir>/src/views/Intervention/__tests__/Intervention.TrialType.Redirect.test.jsx',
		'<rootDir>/src/views/Intervention/__tests__/Intervention.TrialType.test.jsx',
		'<rootDir>/src/views/Intervention/__tests__/Intervention.test.jsx',
		'<rootDir>/src/views/__tests__/CTLViewsHoC.ForNoTrials.test.jsx',
		'<rootDir>/src/views/__tests__/CTLViewsHoC.PrettyURLRedirect.test.jsx',
		'<rootDir>/src/views/__tests__/CTLViewsHoC.test.jsx',
		'<rootDir>/src/views/__tests__/CTLViewsHoc.useListingHocInt.test.jsx',
		'<rootDir>/src/views/__tests__/hocReducer.test.jsx',
	],

	modulePaths: [],
	moduleNameMapper: {
		'^react-native$': 'react-native-web',
		'^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
		// Force CommonJS build for http adapter to be available.
		// via https://github.com/axios/axios/issues/5101#issuecomment-1276572468
		'^axios$': require.resolve('axios'),
	},
	moduleFileExtensions: ['web.js', 'js', 'cjs', 'mjs', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'],
	watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
