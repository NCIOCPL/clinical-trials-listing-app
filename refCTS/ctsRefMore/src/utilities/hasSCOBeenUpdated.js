import { defaultSCOState } from '../constants';

export const hasSCOBeenUpdated = (searchCriteriaObject) => {
	// We are overriding the formType, resultsPage, and qs since they
	// are allowed to differ compared to the defaultSCOState
	const SCOcomparator = {
		...searchCriteriaObject,
		formType: '',
		resultsPage: 1,
		qs: '',
	};
	return JSON.stringify(defaultSCOState) === JSON.stringify(SCOcomparator);
};
