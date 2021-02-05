import { useStateValue } from '../store/store';

// Paths for app
const appPaths = {
	HomePath: '/',
	ItemDetailsPath: '/item/:id',
};

/**
 * Replaces any placeholders with the supplied replacement
 * parameters. NOTE: Call this with the parameters to get
 * a path suitable for a route.
 *
 * @param {string} path The path
 * @param {Object} params The parameters to replace.
 *
 * @returns The replaced path.
 */
const replacePath = (path, params = {}) => {
	const replacedPath = Object.entries(params).reduce((currPath, kvp) => {
		return currPath.replace(`:${kvp[0]}`, kvp[1]);
	}, path);

	return replacedPath;
};

/**
 * Hook to get application path functions with correct
 * base url.
 *
 * @returns
 */
export const useAppPaths = () => {
	const [{ basePath }] = useStateValue();

	const paths = Object.entries(appPaths).reduce((obj, path) => {
		const fullPath =
			(basePath.endsWith('/')
				? basePath.substring(0, basePath.length - 1)
				: basePath) + path[1];
		const replacer = (params) => replacePath(fullPath, params);

		return {
			...obj,
			[path[0]]: replacer,
		};
	}, {});

	return paths;
};
