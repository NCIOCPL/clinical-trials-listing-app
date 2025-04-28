const plugins =
	[['@babel/plugin-transform-class-properties', { loose: true }],
	['@babel/plugin-transform-private-methods', { loose: true }],
	['@babel/plugin-transform-private-property-in-object', { loose: true }]];

module.exports = {
	presets: [
		[
			'react-app',
			{
				absoluteRuntime: false,
			},
		],
		'@babel/preset-react',
		'@babel/preset-env',
	],

	plugins,
};
