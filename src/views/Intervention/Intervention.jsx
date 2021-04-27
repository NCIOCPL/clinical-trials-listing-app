import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router';
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

const Intervention = ({ data: [data] }) => {
	const { CodeOrPurlPath, NoTrialsPath } = useAppPaths();
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

	const interventionParam = prettyUrlName ? prettyUrlName : conceptId.join(',');

	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const pagerDefaults = {
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	};
	const [pager, setPager] = useState(pagerDefaults);

	const setupRequestFilters = () => {
		return { 'arms.interventions.intervention_code': conceptId };
	};

	const setupReplacementText = () => {
		// Replace tokens within page title, browser title, intro text, and meta description
		const context = {
			intervention_label: name.label,
			intervention_normalized: name.normalized,
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
				const redirectStatusCode = location.state?.redirectStatus
					? location.state?.redirectStatus
					: '302';

				const prerenderLocation = location.state?.redirectStatus
					? baseHost + window.location.pathname
					: null;

				// So this is handling the redirect to the no trials page.
				// it is the job of the dynamic route views to property
				// set the p1,p2,p3 parameters.
				navigate(`${NoTrialsPath()}?p1=${interventionParam}`, {
					replace: true,
					state: {
						redirectStatus: redirectStatusCode,
						prerenderLocation: prerenderLocation,
					},
				});
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
				interventionName: name.normalized,
				trialType: 'none',
			});
		}
	}, [trialsPayload]);

	const onPageNavigationChangeHandler = (pagination) => {
		setPager(pagination);
		const { page } = pagination;
		const qryStr = appendOrUpdateToQueryString(search, 'pn', page);
		navigate(`${CodeOrPurlPath({ codeOrPurl: interventionParam })}${qryStr}`, {
			replace: true,
		});
	};

	const renderHelmet = () => {
		const prerenderHeader = baseHost + window.location.pathname;
		const status = location.state?.redirectStatus;

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
				{(() => {
					if (status) {
						return <meta name="prerender-status-code" content={status} />;
					}
				})()}
				{(() => {
					if (status === '301') {
						return (
							<meta
								name="prerender-header"
								content={`Location: ${prerenderHeader}`}
							/>
						);
					}
				})()}
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

Intervention.propTypes = {
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

export default Intervention;
