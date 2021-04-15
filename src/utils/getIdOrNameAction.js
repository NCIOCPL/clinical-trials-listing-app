import { queryParamType } from '../constants';
import { matchQueryParam, getKeyValueFromQueryString } from './index';
import {
	getListingInformationById,
	getListingInformationByName,
} from '../services/api/actions';

/**
 * Returns an trial listing support api ID or Name action.
 *
 * @param {boolean} isNoTrials are we handling a /notrials route?
 * @param {string} param the value of the param
 * @param {number} position the position of the param, mapping to p1, p2, etc in the query of a no trials route
 * @param {object} search the location query params
 */
export const getIdOrNameAction = (isNoTrials, param, position, search) => {
	// 1. Determine what the value we should be looking at.
	const paramValue = isNoTrials
		? getKeyValueFromQueryString(`p${position}`, search)
		: param;

	// 2. Determine if it is a purl or set of ccodes
	const matchedQuery = matchQueryParam(paramValue);

	// 3. Return the correct type of action
	switch (matchedQuery.paramType) {
		case queryParamType.code: {
			return getListingInformationById({ ids: matchedQuery.queryParam });
		}
		case queryParamType.purl: {
			return getListingInformationByName({ name: matchedQuery.queryParam });
		}
		default:
			throw new Error(
				`Unknown listing info action type, ${matchedQuery.paramType}`
			);
	}
};
