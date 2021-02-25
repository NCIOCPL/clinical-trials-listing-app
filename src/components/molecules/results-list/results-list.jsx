import PropTypes from 'prop-types';
import React from 'react';

import { getLocationInfoFromSites } from '../../../utils';

import ResultsListItem from './results-list-item';

const ResultsList = ({ listingType, results, resultsItemTitleLink }) => {
	return (
		<>
			<hr />
			<div className="list">
				<ul>
					{results.map((resultItem, index) => {
						const {
							brief_summary,
							brief_title,
							current_trial_status,
							nci_id,
							nct_id,
							sites,
						} = resultItem;
						const locationInfo = getLocationInfoFromSites(
							current_trial_status,
							nct_id,
							sites
						);

						return (
							<ResultsListItem
								key={index}
								listingType={listingType}
								locationInfo={locationInfo}
								nciId={nci_id}
								summary={brief_summary}
								title={brief_title}
								resultsItemTitleLink={resultsItemTitleLink}
							/>
						);
					})}
				</ul>
			</div>
		</>
	);
};

ResultsList.propTypes = {
	listingType: PropTypes.string.isRequired,
	results: PropTypes.array.isRequired,
	resultsItemTitleLink: PropTypes.string.isRequired,
};

export default ResultsList;
