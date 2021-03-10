import React from 'react';
import PropTypes from 'prop-types';

import { useStateValue } from '../../../store/store.js';

import { TokenParser } from '../../../utils';

const NoResults = ({ diseaseName }) => {
	const [{ noTrialsHtml }] = useStateValue();

	let replacedNoTrialsHtml = noTrialsHtml;
	if(diseaseName !== undefined) {
		const context = {
			disease_normalized: diseaseName
		};

		replacedNoTrialsHtml = TokenParser.replaceTokens(noTrialsHtml, context);
	}

	return (
		<>
			<div dangerouslySetInnerHTML={{ __html: replacedNoTrialsHtml }}></div>
		</>
	);
};

NoResults.propTypes = {
	diseaseName: PropTypes.string,
};

export default NoResults;
