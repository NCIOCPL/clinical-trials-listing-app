import React from 'react';

import { useStateValue } from '../../../store/store.js';

const NoResults = () => {
	const [{ noTrialsHtml }] = useStateValue();

	return (
		<>
			<div dangerouslySetInnerHTML={{ __html: noTrialsHtml }}></div>
		</>
	);
};

export default NoResults;
