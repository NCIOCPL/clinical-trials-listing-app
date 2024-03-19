const plugins = [];
// if (process.env.NODE_ENV === 'test') {
// 	plugins.push(['istanbul']);
// 	console.log('tinople!');
// }

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
