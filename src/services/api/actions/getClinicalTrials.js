/**
 * Gets a list of clinical trials from the Clinical Trials API matching the request filters
 *
 * @param {Number} from the offset to start results from
 * @param {Object} requestFilters the request filters to match
 * @param {Number} size the number of results
 *
 */

export const getClinicalTrials = ({ from = 0, requestFilters = {}, size = 50 }) => {
	// Set up query for Clinical Trials API.
	// Include only active trial statuses, requestFilters, from, and size.
	const requestQuery = {
		current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
		include: ['brief_summary', 'brief_title', 'current_trial_status', 'nci_id', 'nct_id', 'sites.org_name', 'sites.org_country', 'sites.org_state_or_province', 'sites.org_city', 'sites.recruitment_status'],
		...requestFilters,
		from,
		size,
	};

	return {
		type: 'getClinicalTrials',
		payload: requestQuery,
	};
};
