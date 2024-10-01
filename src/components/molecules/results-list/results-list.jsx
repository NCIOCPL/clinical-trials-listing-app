import PropTypes from 'prop-types';
import React from 'react';

import { getLocationInfoFromSites } from '../../../utils';

import ResultsListItem from './results-list-item';

const ResultsList = ({ results, resultsItemTitleLink }) => {
	return (
		<>
			<div className="ctla-results__list grid-container">
				<div className="grid-row">
					<div className="grid-col">
						<ul>
							{results.map((resultItem, index) => {
								const { brief_summary, brief_title, current_trial_status, nci_id, nct_id, sites } = resultItem;
								const locationInfo = getLocationInfoFromSites(current_trial_status, nct_id, sites);

								return <ResultsListItem key={index} locationInfo={locationInfo} nciId={nci_id} summary={brief_summary} title={brief_title} resultsItemTitleLink={resultsItemTitleLink} resultIndex={index} />;
							})}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

ResultsList.propTypes = {
	results: PropTypes.array.isRequired,
	resultsItemTitleLink: PropTypes.string.isRequired,
};

export default ResultsList;
