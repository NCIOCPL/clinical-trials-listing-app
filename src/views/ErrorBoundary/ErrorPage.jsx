import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
			name: `${canonicalHost.replace(/^(http|https):\/\//g, '')}${
				window.location.pathname
			}`,
			title: pageTitle,
			type: 'PageLoad',
		});
	}, []);

	const renderHelmet = () => {
		return (
			<Helmet>
				<title>Errors Occurred</title>
				<meta property="dcterms.subject" content="Error Pages" />
				<meta property="dcterms.type" content="errorpage" />
				<meta name="prerender-status-code" content="500" />
			</Helmet>
		);
	};

	return (
		<>
			{renderHelmet()}
			<div className="error-container">
				<h1>{i18n.errorPageText[language]}</h1>
			</div>
		</>
	);
};

export default ErrorPage;
