import { collapseConcepts } from './collapseConcepts';
import {
	ACTIVE_TRIAL_STATUSES,
	ACTIVE_RECRUITMENT_STATUSES,
	SEARCH_RETURNS_FIELDS,
	NIH_ZIPCODE,
} from '../constants';

export const formatTrialSearchQuery = (form) => {
	let filterCriteria = {};

	//diseases
	if (form.cancerType.codes.length > 0) {
		filterCriteria.maintype = form.cancerType.codes;
	}

	// Reduce the subtypes into a list of ids.
	if (form.subtypes.length > 0) {
		filterCriteria.subtype = collapseConcepts(form.subtypes);
	}

	if (form.stages.length > 0) {
		filterCriteria.stage = collapseConcepts(form.stages);
	}

	if (form.findings.length > 0) {
		filterCriteria.finding = collapseConcepts(form.findings);
	}

	//Drugs and Treatments
	if (form.drugs.length > 0 || form.treatments.length > 0) {
		const drugIds = form.drugs.length > 0 ? collapseConcepts(form.drugs) : [];
		const otherIds =
			form.treatments.length > 0 ? collapseConcepts(form.treatments) : [];
		filterCriteria['arms.interventions.nci_thesaurus_concept_id'] = [
			...new Set([...drugIds, ...otherIds]),
		];
	}

	//Add Age filter
	if (form.age !== '') {
		filterCriteria['eligibility.structured.max_age_in_years_gte'] = form.age;
		filterCriteria['eligibility.structured.min_age_in_years_lte'] = form.age;
	}

	// keywords
	if (form.keywordPhrases !== '') {
		filterCriteria.keyword = form.keywordPhrases;
	}

	// trialTypes
	let trialTypesChecked = form.trialTypes.filter((item) => item.checked);
	//check if any are selected, none being the same as all
	if (trialTypesChecked.length) {
		filterCriteria.primary_purpose = [
			...new Set(trialTypesChecked.map((item) => item.value)),
		];
	}

	// trialPhases
	//need to add overlapping phases to the array before passing it
	let checkedPhases = form.trialPhases.filter((item) => item.checked);
	if (checkedPhases.length > 0) {
		let phaseList = [...new Set(checkedPhases.map((item) => item.value))];

		if (phaseList.includes('i')) {
			phaseList.push('i_ii');
		}
		if (phaseList.includes('iii')) {
			phaseList.push('ii_iii');
		}
		if (phaseList.includes('ii')) {
			if (!phaseList.includes('i_ii')) {
				phaseList.push('i_ii');
			}
			if (!phaseList.includes('ii_iii')) {
				phaseList.push('ii_iii');
			}
		}
		if (phaseList.length > 0) {
			filterCriteria.phase = phaseList;
		}
	}

	// investigator
	if (form.investigator.term !== '') {
		filterCriteria['principal_investigator._fulltext'] = form.investigator.term;
	}

	// leadOrg
	if (form.leadOrg.term !== '') {
		filterCriteria['lead_org._fulltext'] = form.leadOrg.term;
	}

	// add healthy volunteers filter
	if (form.healthyVolunteers) {
		filterCriteria['eligibility.structured.accepts_healthy_volunteers'] = true;
	}

	//gender filter goes here but it is not set within our app
	// filterCriteria['eligibility.structured.gender']

	//trial ids
	if (form.trialId !== '') {
		// Split up the ids on a comma, trimming the items.
		filterCriteria.trial_ids = form.trialId.split(',').map((s) => s.trim());
	}

	// VA only
	if (form.vaOnly) {
		filterCriteria['sites.org_va'] = true;
	}

	// location
	switch (form.location) {
		case 'search-location-nih':
			//NIH has their own postal code, so this means @NIH
			filterCriteria['sites.org_postal_code'] = NIH_ZIPCODE;
			break;
		case 'search-location-hospital':
			filterCriteria['sites.org_name._fulltext'] = form.hospital.term;
			break;
		case 'search-location-country': {
			filterCriteria['sites.org_country'] = form.country;
			if (form.city !== '') {
				filterCriteria['sites.org_city'] = form.city;
			}
			//
			let statesList = [...new Set(form.states.map((item) => item.abbr))];
			if (form.country === 'United States' && statesList.length > 0) {
				filterCriteria['sites.org_state_or_province'] = statesList;
			}
			break;
		}
		case 'search-location-zip':
			if (form.zipCoords.lat !== '' && form.zipCoords.long !== '') {
				filterCriteria['sites.org_coordinates_lat'] = `${form.zipCoords.lat}`;
				filterCriteria['sites.org_coordinates_lon'] = `${form.zipCoords.long}`;
				filterCriteria['sites.org_coordinates_dist'] = form.zipRadius + 'mi';
			}
			break;
		default:
	}

	// The trials API returns 10 results per page.
	// Determine the offset based off the current page.
	if (form.resultsPage > 0) {
		filterCriteria.from = (form.resultsPage - 1) * 10;
	}

	// Adds criteria to only match locations that are actively recruiting sites. (CTSConstants.ActiveRecruitmentStatuses)
	// But only do it if we are doing a location search.
	if (form.location !== 'search-location-all' || form.vaOnly) {
		filterCriteria['sites.recruitment_status'] = ACTIVE_RECRUITMENT_STATUSES;
	}

	// This is searching only for open trials (CTSConstants.ActiveTrialStatuses)
	filterCriteria.current_trial_status = ACTIVE_TRIAL_STATUSES;

	filterCriteria.include = SEARCH_RETURNS_FIELDS;

	return filterCriteria;
};
