/* eslint-disable */

import PropTypes from 'prop-types';
import React from 'react';
import { useTracking } from 'react-tracking';

import { TokenParser } from '../../../../utils';

const ResultsListItem = ({ locationInfo, nciId, resultsItemTitleLink, status, title, resultIndex }) => {
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
				<div className="ctla-results__list-item-status grid-col">
					<strong>Status:</strong> {status}
				</div>
			</div>
			<div className="grid-row">
				<div className="ctla-results__list-item-location grid-col">{locationInfo}</div>
			</div>
		</li>
	);
};

ResultsListItem.propTypes = {
	nciId: PropTypes.string.isRequired,
	resultsItemTitleLink: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	resultIndex: PropTypes.number.isRequired,
};

export default ResultsListItem;
