import PropTypes from 'prop-types';
import React from 'react';
import { useTracking } from 'react-tracking';

import { TokenParser } from '../../../../utils';

const ResultsListItem = ({ locationInfo, nciId, resultsItemTitleLink, summary, title, resultIndex }) => {
	const context = { nci_id: nciId };
	const titleLink = TokenParser.replaceTokens(resultsItemTitleLink, context);
	const tracking = useTracking();

	const handleResultItemTitleClick = () => {
		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Other:ResultClick',
			linkName: 'CTSLink',
			resultIndex: resultIndex + 1,
		});
	};
	return (
		<li className="ctla-results__list-item grid-container">
			<div className="grid-row">
				<a className="ctla-results__list-item-title grid-col" href={titleLink} onClick={handleResultItemTitleClick}>
					{title}
				</a>
			</div>
			<div className="grid-row">
				<p className="ctla-results__list-item-body grid-col">{summary}</p>
			</div>
			<div className="grid-row">
				<div className="ctla-results__list-item-location grid-col">{locationInfo}</div>
			</div>
		</li>
	);
};

ResultsListItem.propTypes = {
	nciId: PropTypes.string.isRequired,
	locationInfo: PropTypes.node.isRequired,
	resultsItemTitleLink: PropTypes.string.isRequired,
	summary: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	resultIndex: PropTypes.number.isRequired,
};

export default ResultsListItem;
