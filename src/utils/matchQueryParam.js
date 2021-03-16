import { queryParamType } from '../constants';

/**
 * Matches query param to a code or a pretty URL name.
 *
 * @param {string} codeOrPurl the code or pretty URL name to match to regex
 */
export const matchQueryParam = (codeOrPurl) => {
	const regex = /(C[0-9]+)(,C[0-9]+)*$/i;
	if (regex.test(codeOrPurl)) {
		return {
			paramType: queryParamType.code,
			queryParam: codeOrPurl.split(','),
		};
	} else {
		return {
			paramType: queryParamType.purl,
			queryParam: codeOrPurl,
		};
	}
};
