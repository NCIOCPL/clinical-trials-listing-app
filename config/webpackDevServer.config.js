'use strict';

const fs = require('fs');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');
const getHttpsConfig = require('./getHttpsConfig');

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHost) {
	return {
		// This should be updated with a list of allowed hosts
		allowedHosts: ['localhost', allowedHost],
		// Enable gzip compression of generated files.
		compress: true,
		client: {
			logging: 'none',
			overlay: false,
			webSocketURL: {
				hostname: sockHost,
				pathname: sockPath,
				port: sockPort,
			},
		},
		devMiddleware: {
			publicPath: paths.publicUrlOrPath.slice(0, -1),
		},
		static: {
			directory: paths.appPublic,
			publicPath: paths.publicUrlOrPath.slice(0, -1),
			watch: {
				ignored: ignoredFiles(paths.appSrc),
			},
		},
		server: getHttpsConfig() ? 'https' : 'http',
		host,
		port: process.env.PORT || 3000,
		historyApiFallback: {
			// Paths with dots should still use the history fallback.
			// See https://github.com/facebook/create-react-app/issues/387.
			disableDotRule: true,
			index: paths.publicUrlOrPath,
		},
		// `proxy` is run between `before` and `after` `webpack-dev-server` hooks
		proxy,
		webSocketServer: 'ws',
		setupMiddlewares(middlewares, devServer) {
			if (!devServer) {
				throw new Error("webpack-dev-server is not defined");
			}

			// BEFORE MIDDLEWARES
			// Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
			// middlewares before `redirectServedPath` otherwise will not have any effect
			// This lets us fetch source contents from webpack for the error overlay
			middlewares.unshift(evalSourceMapMiddleware(devServer));
			// This lets us open files from the runtime error overlay.
			middlewares.unshift(errorOverlayMiddleware());

			if (fs.existsSync(paths.proxySetup)) {
				// This registers user provided middleware for proxy reasons
				require(paths.proxySetup)(devServer.app);
			}

			// AFTER MIDDLEWARES
			// Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
			middlewares.push(redirectServedPath(paths.publicUrlOrPath));

			// This service worker file is effectively a 'no-op' that will reset any
			// previous service worker registered for the same host:port combination.
			// We do this in development to avoid hitting the production cache if
			// it used the same host and port.
			// https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
			middlewares.push(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

			return middlewares;
		},
	};
};
