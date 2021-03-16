/**
 * Strips the trailing slash from a URI
 *
 * @param {string} uri the URI to be cleaned
 */
export const cleanURI = (uri) => {
	return uri.replace(/\/$/, '');
};
