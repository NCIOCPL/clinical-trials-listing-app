import PropTypes from 'prop-types';
import React from 'react';

import { useStateValue } from '../../../../store/store';

const ResultsListItem = ({ nciId, locationInfo, summary, title }) => {
	const [{ resultsItemTitleLink }] = useStateValue();
	return (
		<li className="ct-list-item">
			<a
				className="ct-list-item__title"
				href={`${resultsItemTitleLink}?id=${nciId}`}>
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
	summary: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

export default ResultsListItem;
