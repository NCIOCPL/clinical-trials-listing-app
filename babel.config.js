const plugins = [];
if (process.env.NODE_ENV === 'test') {
	plugins.push(['istanbul']);
}

module.exports = {
  presets: ['react-app'],
  plugins
};
