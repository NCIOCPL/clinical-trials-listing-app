import React, { useEffect } from 'react';
import { useTracking } from 'react-tracking';

import { useStateValue } from '../../store/store';
import { i18n } from '../../utils';

const ErrorPage = () => {
	const [{ canonicalHost, language }] = useStateValue();
	const tracking = useTracking();

	useEffect(() => {
		const pageTitle = 'Errors Occurred';
		tracking.trackEvent({
			event: 'SitewideSearchApp:Load:Error',
			metaTitle: pageTitle,
			name: `${canonicalHost.replace('https://', '')}${
				window.location.pathname
			}`,
			title: pageTitle,
			type: 'PageLoad',
		});
	}, []);

	return (
		<div className="error-container">
			<h1>{i18n.errorPageText[language]}</h1>
		</div>
	);
};

export default ErrorPage;
