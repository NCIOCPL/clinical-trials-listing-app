import React from 'react';

import { getStateNameFromAbbr } from './getStateNameFromAbbr';

/**
 * getLocationInfoFromSites - Derives location information from list of sites
 *
 * @param {String} currentTrialStatus
 * @param {String} nctId
 * @param {Array} sites
 * @return {JSX.Element}
 */
export const getLocationInfoFromSites = (
	currentTrialStatus,
	nctId,
	sites = []
) => {
	let totalUSLocations = 0;
	let lastUSLocationSite = 0;
	const siteLinkCT = `https://www.clinicaltrials.gov/study/${nctId}`;

	// Filter list of sites by recruitment status before deriving location
	const filteredSites = sites?.filter((site) => {
		return (
			site.recruitment_status.toLowerCase() === 'active' ||
			site.recruitment_status.toLowerCase() === 'approved' ||
			site.recruitment_status.toLowerCase() === 'enrolling_by_invitation' ||
			site.recruitment_status.toLowerCase() === 'in_review' ||
			site.recruitment_status.toLowerCase() === 'temporarily_closed_to_accrual'
		);
	});

	for (let i = 0; i < filteredSites?.length; i++) {
		if (
			sites[i].org_country === 'United States' &&
			sites[i].recruitment_status
		) {
			totalUSLocations += 1;
			lastUSLocationSite = i;
		}
	}

	// No locations found
	if (totalUSLocations === 0) {
		// Current trial status is of one of the listed, return info not available text
		if (
			currentTrialStatus.toLowerCase() === 'not yet active' ||
			currentTrialStatus.toLowerCase() === 'in review' ||
			currentTrialStatus.toLowerCase() === 'approved'
		) {
			return (
				<>
					<strong>Location: </strong>Location information is not yet available.
				</>
			);
		}

		// Set jsx to be returned
		const jsxLink = (
			<a href={siteLinkCT} rel="noopener noreferrer" target="_blank">
				ClinicalTrials.gov
			</a>
		);
		return (
			<>
				<strong>Location: </strong>
				<span>See {jsxLink}</span>
			</>
		);
	}

	// One location found
	if (totalUSLocations === 1) {
		// Get full state name from state code
		const stateName = getStateNameFromAbbr(
			sites[lastUSLocationSite].org_state_or_province.toUpperCase()
		);
		// Return text in format "org name, org city, state"
		return (
			<>
				<strong>Location: </strong>
				{sites[lastUSLocationSite].org_name +
					', ' +
					sites[lastUSLocationSite].org_city +
					(stateName?.length ? ', ' + stateName : '')}
			</>
		);
	}

	// Otherwise, more than 1 location found, return location count with text
	return (
		<>
			<strong>Location: </strong>
			{`${totalUSLocations} locations`}
		</>
	);
};
