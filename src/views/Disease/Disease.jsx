import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';

import { NoResults, ResultsList, Spinner } from '../../components';
import { useCustomQuery } from '../../hooks';
import { getClinicalTrials } from '../../services/api/actions';
import { useStateValue } from '../../store/store';

import { TokenParser } from '../../utils';

const Disease = ({ data }) => {
	const [trialsPayload, setTrialsPayload] = useState(null);
	const [
		{
			baseHost,
			browserTitle,
			canonicalHost,
			detailedViewPagePrettyUrlFormatter,
			introText,
			language,
			metaDescription,
			pageTitle,
			siteName,
			trialListingPageType,
		},
	] = useStateValue();

	const { conceptId, name } = data;

	const setupReplacementText = () => {
		// Replace tokens within page title, browser title, intro text, and meta description
		const context = {
			disease_label: name.label,
			disease_normalized: name.normalized,
		};

		return {
			pageTitle: TokenParser.replaceTokens(pageTitle, context),
			browserTitle: TokenParser.replaceTokens(browserTitle, context),
			introText: TokenParser.replaceTokens(introText, context),
			metaDescription: TokenParser.replaceTokens(metaDescription, context),
		};
	};

	const setupRequestFilters = () => {
		return { 'diseases.nci_thesaurus_concept_id': conceptId };
	};

	const requestFilters = setupRequestFilters();
	const replacedText = setupReplacementText();
	const queryResponse = useCustomQuery(getClinicalTrials({ requestFilters }));
	const tracking = useTracking();

	useEffect(() => {
		if (!queryResponse.loading && queryResponse.payload) {
			setTrialsPayload(queryResponse.payload);
		}
	}, [queryResponse.loading, queryResponse.payload]);

	useEffect(() => {
		// Fire off a page load event. Usually this would be in
		// some effect when something loaded.
		if (trialsPayload) {
			tracking.trackEvent({
				// These properties are required.
				type: 'PageLoad',
				event: 'TrialListingApp:Load:Results',
				name: canonicalHost.replace('https://', '') + window.location.pathname,
				title: replacedText.pageTitle,
				language: language === 'en' ? 'english' : 'spanish',
				metaTitle: `${replacedText.pageTitle} - ${siteName}`,
				// Any additional properties fall into the "page.additionalDetails" bucket
				// for the event.
				numberResults: queryResponse.payload?.total,
				trialListingPageType: `${trialListingPageType.toLowerCase()}`,
				diseaseName: name.normalized,
			});
		}
	}, [trialsPayload]);

	const renderHelmet = () => {
		return (
			<Helmet>
				<title>{`${replacedText.browserTitle} - ${siteName}`}</title>
				<meta property="og:title" content={`${replacedText.pageTitle}`} />
				<meta property="og:url" content={baseHost + window.location.pathname} />
				<meta name="description" content={replacedText.metaDescription} />
				<meta
					property="og:description"
					content={replacedText.metaDescription}
				/>
				<link rel="canonical" href={canonicalHost + window.location.pathname} />
			</Helmet>
		);
	};

	return (
		<div>
			{renderHelmet()}
			<h1>{replacedText.pageTitle}</h1>
			{replacedText.introText.length > 0 &&
				!queryResponse.loading &&
				trialsPayload?.trials.length > 0 && (
					<div
						className="intro-text"
						dangerouslySetInnerHTML={{ __html: replacedText.introText }}></div>
				)}
			{(() => {
				if (queryResponse.loading) {
					return <Spinner />;
				} else if (!queryResponse.loading && trialsPayload?.trials.length) {
					return (
						<ResultsList
							listingType={trialListingPageType}
							results={trialsPayload.trials}
							resultsItemTitleLink={detailedViewPagePrettyUrlFormatter}
						/>
					);
				} else {
					return <NoResults />;
				}
			})()}
		</div>
	);
};

Disease.propTypes = {
	data: PropTypes.shape({
		conceptId: PropTypes.array,
		name: PropTypes.shape({
			label: PropTypes.string,
			normalized: PropTypes.string,
		}),
		prettyUrlName: PropTypes.string,
	}),
};

export default Disease;
