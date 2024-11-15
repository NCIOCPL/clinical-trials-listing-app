import { ACTIVE_TRIAL_STATUSES } from '../../constants';

/**
 * Gets a list of Trial Investigators from the CTS api
 * @param {String} searchText - free text string matching trial investigator name
 * @return {{payload: {cacheKey: string, method: string, service: string, requestParams: {agg_field: string, agg_name: string, current_trial_status: string[], include: string[]}}, type: string}}
 */
export const searchTrialInvestigatorsAction = ({ searchText }) => {
	if (!searchText || searchText === '') {
		throw new Error(
			'You must specify a trial investigator in order to fetch it.'
		);
	}
	const requestQuery = {
		agg_field: 'principal_investigator',
		agg_name: searchText,
		current_trial_status: ACTIVE_TRIAL_STATUSES,
	};

	return {
		type: '@@api/CTSv2',
		payload: {
			service: 'ctsSearchV2',
			cacheKey: 'tis',
			method: 'searchTrialInvestigators',
			requestParams: requestQuery,
		},
	};
};
