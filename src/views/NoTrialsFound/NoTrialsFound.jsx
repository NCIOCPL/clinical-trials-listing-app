import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';
import { useLocation } from 'react-router';

import { CISBanner, NoResults } from '../../components';
import { useStateValue } from '../../store/store';
import { TokenParser } from '../../utils';

const NoTrialsFound = ({ routeParamMap, data }) => {
	const location = useLocation();
	const tracking = useTracking();
	const [
		{
			baseHost,
			canonicalHost,
			dynamicListingPatterns,
			language,
			siteName,
			trialListingPageType,
		},
	] = useStateValue();

	const listingPatternIndex = routeParamMap.length - 1;
	const listingPattern = Object.values(dynamicListingPatterns)[
		listingPatternIndex
	];

	const setupReplacementText = () => {
		// Replace tokens within page title, browser title, meta description, and no trials html
		const context = data.reduce((ac, info, idx) => {
			const contextEntryInfo = routeParamMap[idx];

			if (contextEntryInfo.textReplacementKey !== 'trial_type') {
				return {
					...ac,
					[`${contextEntryInfo.textReplacementKey}_label`]: info.name.label,
					[`${contextEntryInfo.textReplacementKey}_normalized`]:
						info.name.normalized,
				};
			}

			return {
				...ac,
				[`${contextEntryInfo.textReplacementKey}_label`]: info.label,
				[`${contextEntryInfo.textReplacementKey}_normalized`]:
					info.label.toLowerCase(),
			};
		}, {});

		return {
			pageTitle: TokenParser.replaceTokens(listingPattern.pageTitle, context),
			browserTitle: TokenParser.replaceTokens(
				listingPattern.browserTitle,
				context
			),
			metaDescription: TokenParser.replaceTokens(
				listingPattern.metaDescription,
				context
			),
			noTrialsHtml: TokenParser.replaceTokens(
				listingPattern.noTrialsHtml,
				context
			),
		};
	};

	const replacementText = setupReplacementText();

	useEffect(() => {
		const paramTracking = data.reduce((ac, info, idx) => {
			const contextEntryInfo = routeParamMap[idx];

			if (contextEntryInfo.textReplacementKey !== 'trial_type') {
				return {
					...ac,
					[`${contextEntryInfo.textReplacementKey}Name`]: info.name.normalized,
				};
			}

			return {
				...ac,
				trialType: info.label.toLowerCase(),
			};
		}, {});

		// Fire off a page load event.
		tracking.trackEvent({
			// These properties are required.
			type: 'PageLoad',
			event: 'TrialListingApp:Load:NoTrialsFound',
			name:
				canonicalHost.replace(/^(http|https):\/\//, '') +
				window.location.pathname,
			title: replacementText.pageTitle,
			language: language === 'en' ? 'english' : 'spanish',
			metaTitle: `${replacementText.pageTitle} - ${siteName}`,
			// Any additional properties fall into the "page.additionalDetails" bucket
			// for the event.
			numberResults: 0,
			trialListingPageType: `${trialListingPageType.toLowerCase()}`,
			...paramTracking,
		});
	}, []);

	const renderHelmet = () => {
		const prerenderHeader = location.state?.prerenderLocation
			? location.state?.prerenderLocation
			: baseHost + window.location.pathname + window.location.search;

		/*
			=============================================================================
					Issue #227: As long as a status code is not set on location state,
					which currently sets a redirect code or a 404 for a non-existent page,
					set 200 status code for trials that do not return results.
			=============================================================================
		*/
		const status = location.state?.redirectStatus
			? location.state?.redirectStatus
			: '200';

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
	routeParamMap: PropTypes.arrayOf(
		PropTypes.shape({
			paramName: PropTypes.string,
			textReplacementKey: PropTypes.string,
			type: PropTypes.oneOf(['listing-information', 'trial-type']),
		})
	).isRequired,
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
