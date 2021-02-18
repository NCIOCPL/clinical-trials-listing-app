import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';

import { NoResults, ResultsList, Spinner } from '../../components';
import CTLViewsHoC from '../CTLViewsHoC';
import { useCustomQuery } from '../../hooks';
import { getClinicalTrials } from '../../services/api/actions';
import { useStateValue } from '../../store/store';
import { testIds } from '../../constants';

const Manual = () => {
	const [trialsPayload, setTrialsPayload] = useState(null);
	const [
		{
			pageTitle,
			requestFilters,
			siteName,
			introText,
			language,
			canonicalHost,
			trialListingPageType,
			baseHost,
			metaDescription,
		},
	] = useStateValue();
	const queryResponse = useCustomQuery(getClinicalTrials(requestFilters));
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
				title: pageTitle,
				language: language === 'en' ? 'english' : 'spanish',
				metaTitle: `${pageTitle} - ${siteName}`,
				// Any additional properties fall into the "page.additionalDetails" bucket
				// for the event.
				numberResults: queryResponse.payload?.total,
				trialListingPageType: `${trialListingPageType.toLowerCase()} parameters`,
			});
		}
	}, [trialsPayload]);

	const renderHelmet = () => {
		return (
			<Helmet>
				<title>{`${pageTitle} - ${siteName}`}</title>
				<meta property="og:title" content={`${pageTitle}`} />
				<meta property="og:url" content={baseHost + window.location.pathname} />
				<meta name="description" content={metaDescription} />
				<meta property="og:description" content={metaDescription} />
				<link rel="canonical" href={canonicalHost + window.location.pathname} />
			</Helmet>
		);
	};

	return (
		<div>
			{renderHelmet()}
			<h1>{pageTitle}</h1>
			{introText.length > 0 &&
				!queryResponse.loading &&
				trialsPayload?.trials.length > 0 && (
					<div
						className="intro-text"
						dangerouslySetInnerHTML={{ __html: introText }}></div>
				)}
			{(() => {
				if (queryResponse.loading) {
					return <Spinner />;
				} else if (!queryResponse.loading && trialsPayload?.trials.length) {
					return <ResultsList results={trialsPayload.trials} />;
				} else {
					return <NoResults />;
				}
			})()}
		</div>
	);
};

export default CTLViewsHoC(Manual);
