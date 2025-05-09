/* eslint-disable */
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';

import { useStateValue } from '../../store/store';
import { i18n } from '../../utils';

const ErrorPage = ({ error }) => {
	const [{ canonicalHost, language }] = useStateValue();
	const tracking = useTracking();

	useEffect(() => {
		const pageTitle = 'Errors Occurred';
		tracking.trackEvent({
			event: 'TrialsListingApp:Load:Error',
			metaTitle: pageTitle,
			name: `${canonicalHost.replace(/^(http|https):\/\//g, '')}${window.location.pathname}`,
			title: pageTitle,
			type: 'PageLoad',
		});
	}, []);

	console.error('Error Boundary caught error:', error);

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
				<h1 class="nci-heading-h1">{i18n.errorPageText[language]}</h1>
			</div>
		</>
	);
};

export default ErrorPage;
