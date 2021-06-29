/**
 * Gets a trial type from the Clinical Trials Listing API matching the requested trial type
 *
 * @param {string} trialType the trial type to match
 */
export const getTrialType = ({ trialType = '' }) => {
	if (!trialType || trialType === '') {
		throw new Error('You must specify a trialType in order to fetch it.');
	}

	return {
		payload: trialType,
		type: 'trialType',
	};
};
