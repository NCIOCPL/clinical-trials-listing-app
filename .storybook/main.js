/** @type { import('@storybook/react-webpack5').StorybookConfig } */

// import custom from '../config/webpack.config';
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

	core: {
		disableTelemetry: true,
	},
	addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
	docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
	webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });
    return config;
  },
};
export default config;
