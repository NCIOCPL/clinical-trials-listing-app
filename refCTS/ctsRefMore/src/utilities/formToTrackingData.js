/**
 * Copies the values in the form out into a new object for
 * analytics purposes.
 *
 * @param {Object} formStore - an instance of a form store.
 */
export const formToTrackingData = (formStore) => {
	const rtnObj = {};

	/***************
	 * DISEASES
	 ***************/
	if (formStore['cancerType'] && formStore['cancerType']['name'] !== '') {
		rtnObj['cancerType'] = formStore['cancerType']['codes'];
	}

	// Loop through the other fields.
	for (const field of ['subtypes', 'stages', 'findings']) {
		if (formStore[field] && formStore[field].length > 0) {
			rtnObj[field] = formStore[field].map((type) => type.codes);
		}
	}

	/***********************
	 * INTERVENTIONS
	 ***********************/
	// Loop through the other fields.
	for (const field of ['drugs', 'treatments']) {
		if (formStore[field] && formStore[field].length > 0) {
			rtnObj[field] = formStore[field].map((type) => type.codes);
		}
	}

	/***********************
	 * LOCATIONS
	 ***********************/

	if (formStore['vaOnly']) {
		rtnObj['vaOnly'] = true;
	}

	const location = formStore['location'];
	switch (location) {
		case 'search-location-all': {
			rtnObj['location'] = location;
			break;
		}
		case 'search-location-zip': {
			rtnObj['location'] = location;
			// Assume zip exists
			rtnObj['zip'] = formStore['zip'];

			// Proximity is required on advanced search analytics
			// even if using default value
			rtnObj['zipRadius'] = formStore['zipRadius'];
			break;
		}
		case 'search-location-country': {
			rtnObj['location'] = location;
			// Country is required, so we must assume it is set.
			rtnObj['country'] = formStore['country'];
			if (formStore['city'] !== '') {
				rtnObj['city'] = formStore['city'];
			}
			if (formStore['states'] && formStore['states'].length > 0) {
				rtnObj['states'] = formStore['states'].map((state) => state.abbr);
			}
			break;
		}
		case 'search-location-hospital': {
			rtnObj['location'] = location;
			const hospital = formStore['hospital'];
			if (hospital && hospital['term'] !== '') {
				rtnObj['hospital'] = hospital['term'];
			}
			break;
		}
		case 'search-location-nih': {
			rtnObj['location'] = location;
			break;
		}
		default: {
			rtnObj['location'] = 'search-location-all';
			break;
		}
	}

	/***********************
	 * OTHER
	 ***********************/
	if (formStore['age'] !== '') {
		rtnObj['age'] = formStore['age'];
	}

	if (formStore['keywordPhrases'] !== '') {
		rtnObj['keywordPhrases'] = formStore['keywordPhrases'];
	}

	if (formStore['healthyVolunteers']) {
		rtnObj['healthyVolunteers'] = true;
	}

	if (formStore['trialId'] !== '') {
		rtnObj['trialId'] = formStore['trialId'];
	}

	const leadOrg = formStore['leadOrg'];
	if (leadOrg && leadOrg['term'] !== '') {
		rtnObj['leadOrg'] = leadOrg['term'];
	}

	const investigator = formStore['investigator'];
	if (investigator && investigator['term'] !== '') {
		rtnObj['investigator'] = investigator['term'];
	}

	// Trial Type & Phase
	for (const field of ['trialTypes', 'trialPhases']) {
		const selectedItems = formStore[field].filter((item) => item.checked);
		if (selectedItems.length > 0) {
			rtnObj[field] = selectedItems.map((item) => item.value);
		}
	}

	return rtnObj;
};
