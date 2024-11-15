/**
 * Gets the basePath for a Product Testing artifact
 */
export const getProductTestBase = () => {
	const url = window.location.pathname;
	const components = url.split('/');
	if (components.length < 2) {
		throw new Error('Path does not match expectations');
	}
	return components.slice(0, 3).join('/');
};
