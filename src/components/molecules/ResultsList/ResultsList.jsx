import PropTypes from 'prop-types';
import React from 'react';
import { useFilters } from '../../../features/filters/context/FilterContext/FilterContext';
import { getLocationInfoFromSites } from '../../../utils';
import ResultsListItem from './ResultsListItem';
import './ResultsList.scss';

const ResultsList = ({ results, resultsItemTitleLink }) => {
	const { state } = useFilters();
	const { appliedFilters } = state;

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
						{results.map((resultItem, index) => {
							const { brief_summary, brief_title, current_trial_status, nci_id, nct_id, sites } = resultItem;

							const locationInfo = getLocationInfoFromSites(current_trial_status, nct_id, sites);

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
};

export default ResultsList;
