/**
 * Gets a trial description from the Clinical Trials API matching the requested trial id
 *
 * @param {string} trialId
 * @return {{payload: string, type: string}}
 */
export const getClinicalTrialDescriptionAction = (trialId = '') => {
	if (!trialId || trialId === '') {
		throw new Error(
			'You must specify a trialId in order to fetch a trial description.'
		);
	}

	return {
		payload: trialId,
		type: 'trialDescription',
	};
};
