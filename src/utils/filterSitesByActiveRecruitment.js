/**
 * List of active recruitment statuses for clinical trial sites
 */
export const ACTIVE_RECRUITMENT_STATUSES = [
	// These statuses appear in results:
	'active',
	'approved',
	'enrolling_by_invitation',
	'in_review',
	'temporarily_closed_to_accrual',
	// These statuses DO NOT appear in results:
	/// "closed_to_accrual",
	/// "completed",
	/// "administratively_complete",
	/// "closed_to_accrual_and_intervention",
	/// "withdrawn"
];

/**
 * Filters a list of sites to only include those with active recruitment status
 * @param {array} sites - Array of site objects
 * @return {array} - Filtered array of sites with active recruitment status
 */
export const filterSitesByActiveRecruitment = (sites = []) => {
	return sites.filter((site) =>
		ACTIVE_RECRUITMENT_STATUSES.includes(
			// Site statuses come in upper case from the API
			site.recruitment_status.toLowerCase()
		)
	);
};
