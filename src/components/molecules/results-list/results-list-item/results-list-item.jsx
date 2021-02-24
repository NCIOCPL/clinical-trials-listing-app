import PropTypes from 'prop-types';
import React from 'react';

import { TokenParser } from '../../../../utils';

const ResultsListItem = ({
	locationInfo,
	nciId,
	resultsItemTitleLink,
	summary,
	title,
}) => {
	const context = { nci_id: nciId };
	const titleLink = TokenParser.replaceTokens(resultsItemTitleLink, context);

	return (
		<li className="ct-list-item">
			<a className="ct-list-item__title" href={titleLink}>
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
};

export default ResultsListItem;
