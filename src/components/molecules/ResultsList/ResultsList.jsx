import PropTypes from 'prop-types';
import React from 'react';
import { getLocationInfoFromSites, filterSitesByActiveRecruitment } from '../../../utils';
import ResultsListItem from './ResultsListItem';
import './ResultsList.scss';
import { useFilters } from '../../../features/filters/context/FilterContext/FilterContext';

import { isWithinRadius } from '../../../utils/isWithinRadius';

const ResultsList = ({ results, resultsItemTitleLink }) => {
	const { state, appliedZipCoords } = useFilters();
	const { appliedFilters } = state;

	let zipRadius = appliedFilters.location?.radius;
	var hasZipInput = false;
	var zipInputReturn = '';

	function displayLocation(sitesList, zipCoords, zipRadius) {
		// Filter sites by active recruitment status before counting nearby sites
		const activeSites = filterSitesByActiveRecruitment(sitesList);

		const countNearbySitesByZip = (arr) => {
			return arr.reduce((count, itemSite) => count + isWithinRadius(zipCoords, itemSite.org_coordinates, zipRadius), 0);
		};

		const nearbyCount = countNearbySitesByZip(activeSites);
		zipInputReturn = `, including ${nearbyCount} near you`;
		return nearbyCount;
	}

	return (
		<div className="ctla-results__list grid-container">
			<div className="grid-row">
				<div className="grid-col">
					{appliedFilters.length > 0 && (
						<div className="ctla-results__filters-summary">
							Showing results for:
							{appliedFilters.map((filter) => (
								<span key={filter.type} className="ctla-results__filter-tag">
									{filter.label}
								</span>
							))}
						</div>
					)}
					<ul>
						{results
							.filter((resultItem) => {
								// If location filter is applied, filter out trials with 0 nearby locations
								if (appliedZipCoords !== null) {
									hasZipInput = true;
									zipRadius = appliedFilters.location.radius;

									// Count nearby locations and filter out trials with 0 nearby locations
									const nearbyCount = displayLocation(resultItem.sites, appliedZipCoords, zipRadius);
									return nearbyCount > 0;
								}
								return true;
							})
							.map((resultItem, index) => {
								const { brief_title, current_trial_status, nci_id, nct_id, sites } = resultItem;

								if (appliedZipCoords !== null) {
									hasZipInput = true;
									zipRadius = appliedFilters.location.radius;

									// We already calculated this in the filter, but we need to set the global-ish zipInputReturn again
									displayLocation(sites, appliedZipCoords, zipRadius);
								}

								const locationInfo = getLocationInfoFromSites(current_trial_status, nct_id, sites, hasZipInput, zipInputReturn);

								return <ResultsListItem key={nci_id} locationInfo={locationInfo} nciId={nci_id} status={current_trial_status} title={brief_title} resultsItemTitleLink={resultsItemTitleLink} resultIndex={index} />;
							})}
					</ul>
				</div>
			</div>
		</div>
	);
};

ResultsList.propTypes = {
	results: PropTypes.arrayOf(
		PropTypes.shape({
			brief_summary: PropTypes.string,
			brief_title: PropTypes.string,
			current_trial_status: PropTypes.string,
			nci_id: PropTypes.string,
			nct_id: PropTypes.string,
			sites: PropTypes.array,
		})
	).isRequired,
	resultsItemTitleLink: PropTypes.string.isRequired,
	appliedFilters: PropTypes.array,
};

export default ResultsList;
