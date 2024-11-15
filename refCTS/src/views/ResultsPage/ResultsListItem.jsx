import React from 'react';
import * as queryString from 'query-string';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
	filterSitesByActiveRecruitment,
	isWithinRadius,
} from '../../utilities';
import { NIH_ZIPCODE } from '../../constants';
import { useTracking } from 'react-tracking';
import { useAppSettings } from '../../store/store.js';
import { useAppPaths } from '../../hooks/routing';

const ResultsListItem = ({
	id,
	item,
	isChecked,
	onCheckChange,
	searchCriteria,
	itemIndex,
	resultsPage,
	formType,
}) => {
	const { zipCoords, zipRadius, location, country, states, city, vaOnly, qs } =
		searchCriteria;

	const [{ analyticsName }] = useAppSettings();
	const tracking = useTracking();

	const qsQbj = queryString.parse(qs);
	qsQbj.id = item.nci_id;
	const itemQueryString = queryString.stringify(qsQbj, {
		arrayFormat: 'none',
	});
	const { TrialDescriptionPagePath } = useAppPaths();

	//TODO: Add param comments for all of these

	//compare site values against user criteria
	const isLocationParamMatch = (itemSite) => {
		// If search params have a city, but it does
		// not match.
		if (
			city !== '' &&
			(!itemSite.org_city ||
				itemSite.org_city.toLowerCase() !== city.toLowerCase())
		) {
			return false;
		}

		// Now check country
		if (
			country !== '' &&
			(!itemSite.org_country ||
				itemSite.org_country.toLowerCase() !== country.toLowerCase())
		) {
			return false;
		}

		// If states are provided and there is not a state match
		// Note, let's pretend the abbreviation matches against
		// another countries state abbreviation -- the country
		// check would fail in that case...
		if (states.length > 0) {
			// This site has no state so it can't be a match.
			if (!itemSite.org_state_or_province) {
				return false;
			}
			// Extract abbreviations
			const stateAbbrs = states.map((st) => st.abbr.toUpperCase());
			if (!stateAbbrs.includes(itemSite.org_state_or_province.toUpperCase())) {
				return false;
			}
		}

		// If we get here, then everything is a match.
		return true;
	};

	//compare site values against user criteria
	const isNIHParamMatch = (itemSite) => {
		return itemSite.org_postal_code === NIH_ZIPCODE;
	};

	const countNearbySitesByZip = (arr) => {
		return arr.reduce(
			(count, itemSite) =>
				count + isWithinRadius(zipCoords, itemSite.org_coordinates, zipRadius),
			0
		);
	};

	const countNearbySitesByCountryParams = (arr) => {
		return arr.reduce(
			(count, itemSite) => count + isLocationParamMatch(itemSite),
			0
		);
	};

	const countNearbySitesByNIHParams = (arr) => {
		return arr.reduce(
			(count, itemSite) => count + isNIHParamMatch(itemSite),
			0
		);
	};

	const getGenderDisplay = (genderVal) => {
		const displays = {
			MALE: 'Male',
			FEMALE: 'Female',
			BOTH: 'Male or Female',
		};
		return displays[genderVal];
	};

	const getAgeDisplay = () => {
		const minAge = item.eligibility.structured.min_age_number;
		const maxAge = item.eligibility.structured.max_age_number;

		const minAgeUnit = item.eligibility.structured.min_age_unit.toLowerCase();
		const maxAgeUnit = item.eligibility.structured.max_age_unit.toLowerCase();

		// CASE: Not specified / the incoming age range is out of bounds
		if (minAge === 0 && maxAge > 120) {
			return 'Not Specified';
		}

		// CASE: No minimum age for trial
		if (minAge === 0 && maxAge < 120) {
			return `${maxAge} ${maxAgeUnit} and younger`;
		}
		// CASE: No maximum age for trial
		if (minAge > 0 && maxAge > 120) {
			return `${minAge} ${minAgeUnit} and over`;
		}
		// CASE: Bound age range for trial
		if (minAge > 0 && maxAge < 120) {
			// If the units are the same we omit the minAgeUnit
			if (minAgeUnit === maxAgeUnit) {
				return `${minAge} to ${maxAge} ${maxAgeUnit}`;
			}
			// Base Case
			return `${minAge} ${minAgeUnit} to ${maxAge} ${maxAgeUnit}`;
		}
	};

	const getLocationDisplay = () => {
		// NOTE: Displays for count should be ONLY US sites
		// unless it is a country search and the country
		// is not US.
		const sitesListAllUnfiltered = () => {
			// Early exit and return an empty array if sites doesn't exist
			if (!item.sites) {
				return [];
			}

			return location === 'search-location-country' &&
				country !== 'United States'
				? item.sites
				: item.sites.filter((site) => site.org_country === 'United States');
		};

		// Filter the sites by active recruitment.
		const sitesListAll = filterSitesByActiveRecruitment(
			sitesListAllUnfiltered()
		);

		// If there are no sites we need to display special information
		if (sitesListAll.length === 0) {
			// The old code also referenced a "not yet active" status, which does not exist, so
			// we are going to ignore that.
			if (
				item.current_trial_status === 'Approved' ||
				item.current_trial_status === 'In Review'
			) {
				return 'Location information is not yet available';
			} else {
				return (
					<>
						See{' '}
						<a
							href={`https://www.clinicaltrials.gov/study/${item.nct_id}`}
							target="_blank"
							rel="noopener noreferrer">
							ClinicalTrials.gov
						</a>
					</>
				);
			}
		}

		// A single study site shows the name of the organiztion.
		// Don't ask me (bp) what the ID is of a trial that has no
		// US sites and only a single foreign site.
		if (sitesListAll.length === 1) {
			const site = sitesListAll[0];
			let displayText = `${site.org_name}, ${site.org_city}, `;
			displayText +=
				site.org_country === 'United States'
					? site.org_state_or_province
					: site.org_country;
			return displayText;
		}

		// We filter on VA here to cut down on conditionals
		// in all the count by.
		const sitesListForNearCount = vaOnly
			? sitesListAll.filter((site) => site.org_va)
			: sitesListAll;

		// Assume that search-location-zip means that
		// you have a properly filled in zip code.
		if (location === 'search-location-zip') {
			//has a zip
			if (zipCoords.lat !== '' && zipCoords.long !== '') {
				return `${sitesListAll.length} location${
					sitesListAll.length === 1 ? '' : 's'
				}, including ${countNearbySitesByZip(sitesListForNearCount)} near you`;
			}
		} else if (location === 'search-location-country') {
			return `${sitesListAll.length} location${
				sitesListAll.length === 1 ? '' : 's'
			}, including ${countNearbySitesByCountryParams(
				sitesListForNearCount
			)} near you`;
		} else if (location === 'search-location-nih') {
			return `${sitesListAll.length} location${
				sitesListAll.length === 1 ? '' : 's'
			}, including ${countNearbySitesByNIHParams(
				sitesListForNearCount
			)} near you`;
		} else if (vaOnly) {
			// This accounts for search-location-all and vaOnly. The old code made sure
			// hospital + va would not display, but the new logic should not have this
			// issue.
			return `${sitesListAll.length} location${
				sitesListAll.length === 1 ? '' : 's'
			}, including ${sitesListForNearCount.length} near you`;
		}
		return `${sitesListAll.length} location${
			sitesListAll.length === 1 ? '' : 's'
		}`;
	};

	const handleLinkClick = () => {
		tracking.trackEvent({
			// These properties are required.
			type: 'Other',
			event: 'ClinicalTrialsSearchApp:Other:ResultsListItem',
			analyticsName,
			// Any additional properties fall into the "page.additionalDetails" bucket
			// for the event.
			pageNum: resultsPage, // This is obviously 1 based.
			resultsPosition: itemIndex + 1, //This is 1 based.
			formType,
			linkName: 'UnknownLinkName',
		});
	};
	return (
		<div className="results-list-item results-list__item">
			<div className="results-list-item__checkbox">
				<div className="cts-checkbox ">
					<input
						id={id || item.nci_id}
						className="cts-checkbox__input"
						type="checkbox"
						onChange={() => onCheckChange(id)}
						name={item.nci_id}
						checked={isChecked}
						value={item.nci_id}
					/>
					<label className="cts-checkbox__label" htmlFor={item.nci_id}>
						<span className="show-for-sr">Select this article for print</span>
					</label>
				</div>
			</div>
			<div className="results-list-item__contents">
				<div className="results-list-item__title">
					<Link
						to={`${TrialDescriptionPagePath()}?${itemQueryString}`}
						state={{ result: item }}
						onClick={handleLinkClick}>
						{item.brief_title}
					</Link>
				</div>
				<div className="results-list-item__category">
					<span>Status:</span>
					{item.current_trial_status ? 'Active' : 'Active'}
				</div>
				<div className="results-list-item__category">
					<span>Age:</span>
					{getAgeDisplay()}
				</div>
				<div className="results-list-item__category">
					<span>Gender:</span>
					{item.eligibility &&
						getGenderDisplay(item.eligibility.structured.gender)}
				</div>
				<div className="results-list-item__category">
					<span>Location:</span>
					{getLocationDisplay()}
				</div>
			</div>
		</div>
	);
};

ResultsListItem.propTypes = {
	id: PropTypes.string,
	item: PropTypes.object,
	isChecked: PropTypes.bool,
	onCheckChange: PropTypes.func.isRequired,
	searchCriteria: PropTypes.object,
	itemIndex: PropTypes.number,
	resultsPage: PropTypes.number,
	formType: PropTypes.string,
};

ResultsListItem.defaultProps = {
	results: [],
	isChecked: false,
};

export default ResultsListItem;
