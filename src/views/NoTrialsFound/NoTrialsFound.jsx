import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';
import { useLocation } from 'react-router';

import { CISBanner, NoResults } from '../../components';
import { useStateValue } from '../../store/store';
import { TokenParser } from '../../utils';

const NoTrialsFound = ({ data }) => {
	const location = useLocation();
	const tracking = useTracking();
	const [
		{
			baseHost,
			browserTitle,
			canonicalHost,
			language,
			pageTitle,
			metaDescription,
			noTrialsHtml,
			siteName,
			trialListingPageType,
		},
	] = useStateValue();
	const [{ name }] = data;

	const setupReplacementText = () => {
		// Replace tokens within page title, browser title, meta description, and no trials html
		const context = {
			disease_label: name.label,
			disease_normalized: name.normalized,
		};

		return {
			pageTitle: TokenParser.replaceTokens(pageTitle, context),
			browserTitle: TokenParser.replaceTokens(browserTitle, context),
			metaDescription: TokenParser.replaceTokens(metaDescription, context),
			noTrialsHtml: TokenParser.replaceTokens(noTrialsHtml, context),
		};
	};

	const replacementText = setupReplacementText();

	useEffect(() => {
		// Fire off a page load event.
		tracking.trackEvent({
			// These properties are required.
			type: 'PageLoad',
			event: 'TrialListingApp:Load:NoTrialsFound',
			name:
				canonicalHost.replace('https://', '') +
				window.location.pathname +
				window.location.search,
			title: replacementText.pageTitle,
			language: language === 'en' ? 'english' : 'spanish',
			metaTitle: `${replacementText.pageTitle} - ${siteName}`,
			// Any additional properties fall into the "page.additionalDetails" bucket
			// for the event.
			numberResults: 0,
			trialListingPageType: `${trialListingPageType.toLowerCase()}`,
			diseaseName: name.normalized,
		});
	}, []);

	const renderHelmet = () => {
		const prerenderHeader = location.state?.prerenderLocation
			? location.state?.prerenderLocation
			: baseHost + window.location.pathname + window.location.search;

		const status = location.state?.redirectStatus
			? location.state?.redirectStatus
			: '404';

		return (
			<Helmet>
				<title>{`${replacementText.browserTitle} - ${siteName}`}</title>
				<meta property="og:title" content={`${replacementText.pageTitle}`} />
				<meta property="og:url" content={baseHost + window.location.pathname} />
				<meta name="description" content={replacementText.metaDescription} />
				<meta
					property="og:description"
					content={replacementText.metaDescription}
				/>
				<link rel="canonical" href={canonicalHost + window.location.pathname} />
				<meta name="prerender-status-code" content={status} />
				{(() => {
					if (status !== '404') {
						return (
							<meta
								name="prerender-header"
								content={`Location: ${prerenderHeader}`}
							/>
						);
					}
				})()}
				<meta name="robots" content="noindex" />
			</Helmet>
		);
	};

	const onLiveHelpClickHandler = (liveHelpUrl) => {
		window.open(liveHelpUrl, 'ProactiveLiveHelpForCTS', 'height=600,width=633');
	};

	return (
		<div>
			{renderHelmet()}
			<h1>{replacementText.pageTitle}</h1>
			<NoResults replacedNoTrialsHtml={replacementText.noTrialsHtml} />
			<CISBanner onLiveHelpClick={onLiveHelpClickHandler} />
		</div>
	);
};

NoTrialsFound.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			conceptId: PropTypes.array,
			name: PropTypes.shape({
				label: PropTypes.string,
				normalized: PropTypes.string,
			}),
			prettyUrlName: PropTypes.string,
		})
	),
};

export default NoTrialsFound;
