/**
 * Gets a trial type from the Clinical Trials Listing API matching the requested trial type
 *
 * @param {string} trialType the trial type to match
 */
export const getTrialType = ({ trialType = '' }) => {
	return {
		payload: trialType,
		type: 'trialType',
	};
};
