import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router';
import track, { useTracking } from 'react-tracking';

import { Pager, NoResults, ResultsList, Spinner } from '../../components';
import { useAppPaths, useCustomQuery } from '../../hooks';
import { getClinicalTrials } from '../../services/api/actions';
import { useStateValue } from '../../store/store';

import {
	appendOrUpdateToQueryString,
	getKeyValueFromQueryString,
	getPageOffset,
	TokenParser,
	getTextReplacementContext,
	getNoTrialsRedirectParams,
	getParamsForRoute,
	getAnalyticsParamsForRoute,
} from '../../utils';

const Disease = ({ routeParamMap, routePath, data }) => {
	const { NoTrialsPath } = useAppPaths();
	const location = useLocation();
	const [trialsPayload, setTrialsPayload] = useState(null);
	const navigate = useNavigate();
	const { search } = location;

	const [
		{
			baseHost,
			canonicalHost,
			detailedViewPagePrettyUrlFormatter,
			dynamicListingPatterns,
			itemsPerPage,
			language,
			siteName,
			trialListingPageType,
		},
	] = useStateValue();

	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const pagerDefaults = {
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	};
	const [pager, setPager] = useState(pagerDefaults);

	const setupRequestFilters = () => {
		const query = data.reduce((acQuery, paramData, idx) => {
			const paramInfo = routeParamMap[idx];

			// TODO: Find some way to make this more generic
			switch (paramInfo.paramName) {
				case 'codeOrPurl':
					return {
						...acQuery,
						'diseases.nci_thesaurus_concept_id': paramData.conceptId,
					};
				case 'type':
					return {
						...acQuery,
						'primary_purpose.primary_purpose_code': paramData.idString,
					};
				case 'interCodeOrPurl':
					return {
						...acQuery,
						'arms.interventions.intervention_code': paramData.conceptId,
					};
				default:
					throw new Error(`Unknown parameter ${paramInfo.paramName}`);
			}
		}, {});
		return query;
	};

	const setupReplacementText = () => {
		// Replace tokens within page title, browser title, intro text, and meta description
		const context = getTextReplacementContext(data, routeParamMap);

		// The config to the app will provide an array of listing patterns that map to the
		// number of params that this route has.
		// TODO: move this to app.js, the route setup, should control which listing pattern to use
		const listingPatternIndex = routeParamMap.length - 1;
		const listingPattern = Object.values(dynamicListingPatterns)[
			listingPatternIndex
		];

		return {
			pageTitle: TokenParser.replaceTokens(listingPattern.pageTitle, context),
			browserTitle: TokenParser.replaceTokens(
				listingPattern.browserTitle,
				context
			),
			introText: TokenParser.replaceTokens(listingPattern.introText, context),
			metaDescription: TokenParser.replaceTokens(
				listingPattern.metaDescription,
				context
			),
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
			if (queryResponse.payload.trials.length === 0) {
				const redirectStatusCode = location.state?.redirectStatus
					? location.state?.redirectStatus
					: '302';

				const prerenderLocation = location.state?.redirectStatus
					? baseHost + window.location.pathname
					: null;

				// So this is handling the redirect to the no trials page.
				// it is the job of the dynamic route views to property
				// set the p1,p2,p3 parameters.
				const redirectParams = getNoTrialsRedirectParams(data, routeParamMap);

				navigate(
					`${NoTrialsPath()}?${redirectParams.replace(new RegExp('/&$/'), '')}`,
					{
						replace: true,
						state: {
							redirectStatus: redirectStatusCode,
							prerenderLocation: prerenderLocation,
						},
					}
				);
			}
			setTrialsPayload(queryResponse.payload);
		}
	}, [queryResponse.loading, queryResponse.payload]);

	// Setup data for tracking
	const trackingData = getAnalyticsParamsForRoute(data, routeParamMap);

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
				...trackingData,
			});
		}
	}, [trialsPayload]);

	useEffect(() => {
		if (pn !== pager.page.toString()) {
			setPager({
				...pager,
				offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
				page: typeof pn === 'string' ? pn : 1,
			});
		}
	}, [pn]);

	const onPageNavigationChangeHandler = (pagination) => {
		setPager(pagination);
		const { page } = pagination;
		const qryStr = appendOrUpdateToQueryString(search, 'pn', page);

		const paramsObject = getParamsForRoute(data, routeParamMap);

		navigate(`${routePath(paramsObject)}${qryStr}`);

		window.scrollTo(0, 0);
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
						{trialsPayload?.total > itemsPerPage && (
							<div className="paging-section__pager">
								<Pager
									current={Number(pager.page)}
									onPageNavigationChange={onPageNavigationChangeHandler}
									resultsPerPage={pager.pageUnit}
									totalResults={trialsPayload?.total ?? 0}
								/>
							</div>
						)}
					</div>
				)}
			</>
		);
	};

	const ResultsListWithPage = track({
		currentPage: Number(pager.page),
	})(ResultsList);

	return (
		<>
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
			{(() => {
				if (queryResponse.loading) {
					return <Spinner />;
				} else if (!queryResponse.loading && trialsPayload?.trials.length) {
					return (
						<ResultsListWithPage
							results={trialsPayload.trials}
							resultsItemTitleLink={detailedViewPagePrettyUrlFormatter}
						/>
					);
				} else {
					return <NoResults />;
				}
			})()}
			{/* ::: Bottom Paging Section ::: */}
			{renderPagerSection('bottom')}
		</>
	);
};

Disease.propTypes = {
	routeParamMap: PropTypes.arrayOf(
		PropTypes.shape({
			paramName: PropTypes.string,
			textReplacementKey: PropTypes.string,
			type: PropTypes.oneOf(['listing-information', 'trial-type']),
		})
	).isRequired,
	routePath: PropTypes.func.isRequired,
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

export default Disease;
