import { ACTIVE_RECRUITMENT_STATUSES } from '../constants';

/**
 *
 * @param {array} - sites
 * @return {*[]}
 */
export const filterSitesByActiveRecruitment = (sites = []) => {
	return sites.filter((site) =>
		ACTIVE_RECRUITMENT_STATUSES.includes(
			// Site statuses come in upper case from the API
			site.recruitment_status.toLowerCase()
		)
	);
};
