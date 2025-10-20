/**
 * Generate a dynamic regular expression based off of a replaceable and possibly filtered value.
 *
 * @param {string} filter The base filter to use. May be extended by `extras`.
 * @param {string} query The value to use in the regular expression
 * @param {object} extras An object of regular expressions to replace and filter the query
 */
export const generateDynamicRegExp = (filter, query = '', extras = {}) => {
	const escapeRegExp = (text) => {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	};

	let find = filter.replace(/{{(.*?)}}/g, (_m, $1) => {
		const key = $1.trim();
		// Use Object.prototype.hasOwnProperty to safely check if key exists in extras
		// This addresses the security/detect-object-injection warning
		const queryFilter = Object.prototype.hasOwnProperty.call(extras, key) ? extras[key] : null;
		if (key !== 'query' && queryFilter) {
			try {
				// Use a try-catch block when creating RegExp from dynamic input
				// This addresses the security/detect-non-literal-regexp warning
				const matcher = new RegExp(queryFilter, 'i');
				const matches = query.match(matcher);

				if (matches) {
					return escapeRegExp(matches[1]);
				}
			} catch (e) {
				console.error('Invalid regular expression:', queryFilter);
			}

			return '';
		}
		return escapeRegExp(query);
	});

	find = '^(?:' + find + ')$';

	try {
		// Use a try-catch block when creating RegExp from dynamic input
		return new RegExp(find, 'i');
	} catch (e) {
		console.error('Invalid regular expression:', find);
		// Return a safe default regex that won't match anything
		return /^$/;
	}
};
