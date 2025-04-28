import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';
// Removed useLocation as it might not be needed anymore
// import { useLocation } from 'react-router';

import { CISBanner, NoResults } from '../../components';
import { useStateValue } from '../../store/store';
import { TokenParser } from '../../utils';
import { FilterProvider } from '../../features/filters/context/FilterContext/FilterContext';
import { Sidebar } from '../../features/filters/components';
import './NoTrialsFound.scss'; // Import our custom stylesheet that extends Disease.scss

// Added redirectStatus and prerenderLocation props
const NoTrialsFound = ({ routeParamMap, data, redirectStatus, prerenderLocation }) => {
	// console.log('[NoTrialsFound] Rendering. Props:', { redirectStatus, prerenderLocation }); // LOG PROPS
	// Removed location hook
	// const location = useLocation();
	const tracking = useTracking();
	const [{ baseHost, canonicalHost, dynamicListingPatterns, language, siteName, trialListingPageType }] = useStateValue();

	const listingPatternIndex = routeParamMap.length - 1;
	const listingPattern = Object.values(dynamicListingPatterns)[listingPatternIndex];

	const setupReplacementText = () => {
		// Replace tokens within page title, browser title, meta description, and no trials html
		const context = data.reduce((ac, info, idx) => {
			const contextEntryInfo = routeParamMap[idx];

			if (contextEntryInfo.textReplacementKey !== 'trial_type') {
				return {
					...ac,
					[`${contextEntryInfo.textReplacementKey}_label`]: info.name.label,
					[`${contextEntryInfo.textReplacementKey}_normalized`]: info.name.normalized,
				};
			}

			return {
				...ac,
				[`${contextEntryInfo.textReplacementKey}_label`]: info.label,
				[`${contextEntryInfo.textReplacementKey}_normalized`]: info.label.toLowerCase(),
			};
		}, {});

		return {
			pageTitle: TokenParser.replaceTokens(listingPattern.pageTitle, context),
			browserTitle: TokenParser.replaceTokens(listingPattern.browserTitle, context),
			metaDescription: TokenParser.replaceTokens(listingPattern.metaDescription, context),
			noTrialsHtml: TokenParser.replaceTokens(listingPattern.noTrialsHtml, context),
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
			name: canonicalHost.replace(/^(http|https):\/\//, '') + window.location.pathname,
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
		// Use props for status and header, with fallbacks
		const status = redirectStatus || '404';
		const finalPrerenderLocation = prerenderLocation || baseHost + window.location.pathname + window.location.search;

		// console.log('[NoTrialsFound Helmet] Status:', status, 'Location:', finalPrerenderLocation); // LOG HELMET VALUES

		return (
			<Helmet>
				<title>{`${replacementText.browserTitle} - ${siteName}`}</title>
				<meta property="og:title" content={`${replacementText.pageTitle}`} />
				<meta property="og:url" content={baseHost + window.location.pathname} />
				<meta name="description" content={replacementText.metaDescription} />
				<meta property="og:description" content={replacementText.metaDescription} />
				<link rel="canonical" href={canonicalHost + window.location.pathname} />
				<meta name="prerender-status-code" content={status} />
				{(() => {
					if (status !== '404') {
						// Use the prop-derived value
						return <meta name="prerender-header" content={`Location: ${finalPrerenderLocation}`} />;
					}
				})()}
				<meta name="robots" content="noindex" />
			</Helmet>
		);
	};

	const onLiveHelpClickHandler = (liveHelpUrl) => {
		window.open(liveHelpUrl, 'ProactiveLiveHelpForCTS', 'height=600,width=633');
	};

	const baseFilters = data.reduce((acQuery, paramData, idx) => {
		const paramInfo = routeParamMap[idx];

		switch (paramInfo.paramName) {
			case 'codeOrPurl':
				return {
					...acQuery,
					'diseases.nci_thesaurus_concept_id': paramData?.conceptId || [],
					diseaseName: paramData?.name?.label || '',
				};
			case 'type':
				return {
					...acQuery,
					primary_purpose: paramData?.idString || '',
					trialType: paramData?.label || '',
				};
			case 'interCodeOrPurl':
				return {
					...acQuery,
					'arms.interventions.nci_thesaurus_concept_id': paramData?.conceptId || [],
					interventionName: paramData?.name?.label || '',
				};
			default:
				return acQuery;
		}
	}, {});

	return (
		<div className="disease-view no-trials-page">
			{' '}
			{/* Added no-trials-page class for specific styling */}
			{renderHelmet()}
			<FilterProvider baseFilters={baseFilters} pageType={trialListingPageType}>
				<div className="disease-view__container">
					<Sidebar pageType={trialListingPageType} isDisabled={true} />
					{/* H1 remains a direct child */}
					<h1 className="disease-view__heading nci-heading-h1">{replacementText.pageTitle}</h1>
					{/* Empty intro area for proper grid layout */}
					<div className="disease-view__intro"></div>
					{/* NoResults and CISBanner inside content area */}
					<div className="disease-view__content">
						<NoResults replacedNoTrialsHtml={replacementText.noTrialsHtml} />
						<CISBanner onLiveHelpClick={onLiveHelpClickHandler} />
					</div>
				</div>
			</FilterProvider>
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
	// Add new prop types
	redirectStatus: PropTypes.string,
	prerenderLocation: PropTypes.string,
};

export default NoTrialsFound;
