import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useTracking } from 'react-tracking';

import { Pager, NoResults, ResultsList, Spinner } from '../../components';
import { useAppPaths, useCustomQuery } from '../../hooks';
import { getClinicalTrials } from '../../services/api/actions';
import { useStateValue } from '../../store/store';

import {
	appendOrUpdateToQueryString,
	getKeyValueFromQueryString,
	getPageOffset,
	TokenParser,
} from '../../utils';

const Disease = ({ data }) => {
	const { codeOrPurl } = useParams();
	const { CodeOrPurlPath } = useAppPaths();
	const location = useLocation();
	const [trialsPayload, setTrialsPayload] = useState(null);
	const navigate = useNavigate();
	const { search } = location;

	const [
		{
			baseHost,
			browserTitle,
			canonicalHost,
			detailedViewPagePrettyUrlFormatter,
			introText,
			itemsPerPage,
			language,
			metaDescription,
			pageTitle,
			siteName,
			trialListingPageType,
		},
	] = useStateValue();

	const { conceptId, name, prettyUrlName } = data;

	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const pagerDefaults = {
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	};
	const [pager, setPager] = useState(pagerDefaults);

	const setupRequestFilters = () => {
		return { 'diseases.nci_thesaurus_concept_id': conceptId };
	};

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

	const requestFilters = setupRequestFilters();
	const replacedText = setupReplacementText();
	const tracking = useTracking();

	const queryResponse = useCustomQuery(
		getClinicalTrials({
			from: pager.offset,
			requestFilters,
			size: pager.pageUnit,
		})
	);

	useEffect(() => {
		if (!queryResponse.loading && queryResponse.payload) {
			if (queryResponse.payload.total === 0) {
				const noTrialsParam = prettyUrlName ? prettyUrlName : codeOrPurl;
				navigate(
					`${CodeOrPurlPath({ codeOrPurl: 'notrials' })}?p1=${noTrialsParam}`,
					{
						state: { wasRedirected: true, listingInfo: data },
					}
				);
			}
			setTrialsPayload(queryResponse.payload);
		}
	}, [queryResponse.loading, queryResponse.payload]);

	useEffect(() => {
		// Fire off a page load event. Usually this would be in
		// some effect when something loaded.
		if (trialsPayload && trialsPayload.total > 0) {
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

	const onPageNavigationChangeHandler = (pagination) => {
		setPager(pagination);
		const { page } = pagination;
		const qryStr = appendOrUpdateToQueryString(search, 'pn', page);
		navigate(`${CodeOrPurlPath({ codeOrPurl })}${qryStr}`, { replace: true });
	};

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

	const renderPagerSection = (placement) => {
		const page = pn ?? 1;
		const pagerOffset = getPageOffset(page, itemsPerPage);
		return (
			<>
				{trialsPayload?.trials?.length > 0 && (
					<div className="paging-section">
						{placement === 'top' && (
							<div className="paging-section__page-info">
								{`
								Trials ${pagerOffset + 1}-${Math.min(
									pagerOffset + itemsPerPage,
									trialsPayload.total
								)} of
								${trialsPayload.total}
							`}
							</div>
						)}
						<div className="paging-section__pager">
							<Pager
								current={Number(pager.page)}
								onPageNavigationChange={onPageNavigationChangeHandler}
								resultsPerPage={pager.pageUnit}
								totalResults={trialsPayload?.total ?? 0}
							/>
						</div>
					</div>
				)}
			</>
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
			{/* ::: Top Paging Section ::: */}
			{renderPagerSection('top')}
			<hr />
			{(() => {
				if (queryResponse.loading) {
					return <Spinner />;
				} else if (!queryResponse.loading && trialsPayload?.trials.length) {
					return (
						<ResultsList
							results={trialsPayload.trials}
							resultsItemTitleLink={detailedViewPagePrettyUrlFormatter}
						/>
					);
				} else {
					return <NoResults />;
				}
			})()}
			<hr />
			{/* ::: Bottom Paging Section ::: */}
			{renderPagerSection('bottom')}
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