module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "collectCoverage": true,
    "coverageDirectory": "coverage/jest",
    "collectCoverageFrom": [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.test.{js,jsx,ts,tsx}",
        "!src/**/*.d.ts",
        "!cypress/**/*.{spec,test}.{js,jsx,ts,tsx}",
        "!src/setupTests.js",
        "!src/serviceWorker.js"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 80,
            "functions": 80,
            "lines": 80
        }
    },
    "setupFiles": [
        "react-app-polyfill/jsdom",
        "<rootDir>/jest-test-setup.js"
    ],
    "setupFilesAfterEnv": [
        "<rootDir>/src/setupTests.js"
    ],
    "testMatch": [
        "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
        "<rootDir>/src/**/*.test.{js,jsx,ts,tsx}"
    ],
    "testEnvironment": "jest-environment-jsdom-global",
    "transform": {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
        "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
        "[/\\\\]node_modules[/\\\\].+\\.(js|cjs|jsx|ts|tsx)$",
        "^.+\\.module\\.(css|sass|scss)$",
        "node_modules/(?!axios)/"
    ],
    "modulePaths": [],
    "moduleNameMapper": {
        "^react-native$": "react-native-web",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
           // Force CommonJS build for http adapter to be available.
           // via https://github.com/axios/axios/issues/5101#issuecomment-1276572468
            '^axios$': require.resolve('axios'),

    },
    "moduleFileExtensions": [
        "web.js",
        "js",
        "cjs",
        "web.ts",
        "ts",
        "web.tsx",
        "tsx",
        "json",
        "web.jsx",
        "jsx",
        "node"
    ],
    "watchPlugins": [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname"
    ]
}