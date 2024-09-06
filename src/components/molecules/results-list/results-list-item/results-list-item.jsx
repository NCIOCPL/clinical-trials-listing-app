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
		<li className="ct-list-item">
			<a className="ct-list-item__title" href={titleLink} onClick={handleResultItemTitleClick}>
				{title}
			</a>
			<p className="ct-list-item__body">{summary}</p>
			<div className="location-info">{locationInfo}</div>
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
