import React from 'react';
import PropTypes from 'prop-types';

import { useStateValue } from '../../../store/store';

const NoResults = ({ replacedNoTrialsHtml }) => {
	const [{ noTrialsHtml }] = useStateValue();

	const noTrialsHtmlToDisplay = replacedNoTrialsHtml == null ? noTrialsHtml : replacedNoTrialsHtml;

	return (
		<>
			<div dangerouslySetInnerHTML={{ __html: noTrialsHtmlToDisplay }}></div>
		</>
	);
};

NoResults.propTypes = {
	replacedNoTrialsHtml: PropTypes.string,
};

export default NoResults;
