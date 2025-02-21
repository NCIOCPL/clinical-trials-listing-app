import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router';
import track, { useTracking } from 'react-tracking';

import { Pager, NoResults, ResultsList, ScrollRestoration, Spinner } from '../../components';
import { ErrorPage } from '../ErrorBoundary';
import { useAppPaths } from '../../hooks';
import { useFilters } from '../../features/filters/context/FilterContext/FilterContext';
import Sidebar from '../../features/filters/components/Sidebar/Sidebar';
import { useStateValue } from '../../store/store';
import { appendOrUpdateToQueryString, getKeyValueFromQueryString, getPageOffset, TokenParser, getAnalyticsParamsForRoute, getNoTrialsRedirectParams, getParamsForRoute } from '../../utils';
import { useTrialSearch } from '../../features/filters/hooks/useTrialSearch';

const Intervention = ({ routeParamMap, routePath, data }) => {
	const { NoTrialsPath } = useAppPaths();
	const location = useLocation();
	const navigate = useNavigate();
	const { search } = location;

	const [{ baseHost, canonicalHost, detailedViewPagePrettyUrlFormatter, dynamicListingPatterns, itemsPerPage, language, siteName, trialListingPageType }] = useStateValue();

	// Add filter related state and hooks
	const { state: filterState, getCurrentFilters, isApplyingFilters } = useFilters();
	const [shouldFetchTrials, setShouldFetchTrials] = useState(true);

	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const pagerDefaults = {
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	};

	const [pager, setPager] = useState(pagerDefaults);

	const setupRequestFilters = () => {
		return data.reduce((acQuery, paramData, idx) => {
			const paramInfo = routeParamMap[idx];
			switch (paramInfo.paramName) {
				case 'codeOrPurl':
					return {
						...acQuery,
						'arms.interventions.nci_thesaurus_concept_id': paramData.conceptId,
					};
				case 'type':
					return {
						...acQuery,
						primary_purpose: paramData.idString,
					};
				default:
					throw new Error(`Unknown parameter ${paramInfo.paramName}`);
			}
		}, {});
	};

	const setupReplacementText = () => {
		// Replace tokens within page title, browser title, intro text, and meta description
		const context = data.reduce((acQuery, paramData, idx) => {
			const paramInfo = routeParamMap[idx];

			switch (paramInfo.paramName) {
				case 'codeOrPurl':
					return {
						...acQuery,
						intervention_label: paramData.name.label,
						intervention_normalized: paramData.name.normalized,
					};
				case 'type':
					return {
						...acQuery,
						trial_type_label: paramData.label,
						trial_type_normalized: paramData.label.toLowerCase(),
					};
				default:
					throw new Error(`Unknown parameter type ${paramInfo.paramName}`);
			}
		}, {});

		const listingPatternIndex = routeParamMap.length - 1;
		const listingPattern = Object.values(dynamicListingPatterns)[listingPatternIndex];
		return {
			pageTitle: TokenParser.replaceTokens(listingPattern.pageTitle, context),
			browserTitle: TokenParser.replaceTokens(listingPattern.browserTitle, context),
			introText: TokenParser.replaceTokens(listingPattern.introText, context),
			metaDescription: TokenParser.replaceTokens(listingPattern.metaDescription, context),
		};
	};

	const baseRequestFilters = setupRequestFilters();
	const replacedText = setupReplacementText();
	const tracking = useTracking();

	// Watch for filter changes
	useEffect(() => {
		if (filterState.shouldSearch) {
			setShouldFetchTrials(true);
		}
	}, [filterState.shouldSearch]);

	// Combine base filters with applied filters
	const searchFilters = {
		...baseRequestFilters,
		...getCurrentFilters(),
	};

	const {
		trials: fetchState,
		isLoading: loading,
		error,
	} = useTrialSearch(
		{
			...searchFilters,
			from: pager.offset,
			size: pager.pageUnit,
		},
		shouldFetchTrials
	);

	// const {
	// 	loading,
	// 	error,
	// 	payload: fetchState,
	// 	aborted,
	// } = useCtsApi({
	// 	type: 'fetchTrials',
	// 	payload: {
	// 		...searchFilters,
	// 		from: pager.offset,
	// 		size: pager.pageUnit,
	// 	},
	// });

	// Setup data for tracking
	const trackingData = getAnalyticsParamsForRoute(data, routeParamMap);

	useEffect(() => {
		//if you try to access a nonexistent page, eg: try to access page 41 of 1-40 pages
		if (!loading && error != null && error.message === 'Trial count mismatch from the API') {
			const redirectStatusCode = location.state?.redirectStatus ? location.state?.redirectStatus : '404';

			const prerenderLocation = location.state?.redirectStatus ? baseHost + window.location.pathname : null;

			// So this is handling the redirect to the no trials page.
			// it is the job of the dynamic route views to property
			// set the p1,p2,p3 parameters.
			const redirectParams = getNoTrialsRedirectParams(data, routeParamMap);

			navigate(`${NoTrialsPath()}?${redirectParams.replace(new RegExp('/&$/'), '')}`, {
				replace: true,
				state: {
					redirectStatus: redirectStatusCode,
					prerenderLocation: prerenderLocation,
				},
			});
		} else if (!loading && fetchState) {
			if (fetchState.total === 0) {
				const redirectStatusCode = location.state?.redirectStatus ? location.state?.redirectStatus : '302';

				const prerenderLocation = location.state?.redirectStatus ? baseHost + window.location.pathname : null;

				// So this is handling the redirect to the no trials page.
				// it is the job of the dynamic route views to property
				// set the p1,p2,p3 parameters.
				const redirectParams = data.reduce((acQuery, paramData, idx) => {
					const paramInfo = routeParamMap[idx];

					switch (paramInfo.paramName) {
						case 'codeOrPurl': {
							return `p${idx + 1}=${paramData.prettyUrlName ? paramData.prettyUrlName : paramData.conceptId.join(',')}`;
						}
						case 'type': {
							return `${acQuery}&p${idx + 1}=${paramData.prettyUrlName}`;
						}
					}
				}, {});

				navigate(`${NoTrialsPath()}?${redirectParams}`, {
					replace: true,
					state: {
						redirectStatus: redirectStatusCode,
						prerenderLocation: prerenderLocation,
					},
				});
			}

			// Fire off a page load event. Usually this would be in
			// some effect when something loaded.
			if (fetchState.total > 0) {
				tracking.trackEvent({
					// These properties are required.
					type: 'PageLoad',
					event: 'TrialListingApp:Load:Results',
					name: canonicalHost.replace(/^(http|https):\/\//, '') + window.location.pathname,
					title: replacedText.pageTitle,
					language: language === 'en' ? 'english' : 'spanish',
					metaTitle: `${replacedText.pageTitle} - ${siteName}`,
					// Any additional properties fall into the "page.additionalDetails" bucket
					// for the event.
					numberResults: fetchState.total,
					trialListingPageType: `${trialListingPageType.toLowerCase()}`,
					...trackingData,
				});
			}
		}
	}, [loading, fetchState, error]);

	useEffect(() => {
		// Check if page number exceeds total pages
		if (fetchState?.total && pn) {
			const totalPages = Math.ceil(fetchState.total / itemsPerPage);
			if (Number(pn) > totalPages) {
				// Redirect to page 1
				const qryStr = appendOrUpdateToQueryString(search, 'pn', 1);
				const paramsObject = getParamsForRoute(data, routeParamMap);
				navigate(`${routePath(paramsObject)}${qryStr}`, { replace: true });
				return;
			}
		}

		if (pn !== pager.page.toString()) {
			setPager({
				...pager,
				offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
				page: typeof pn === 'string' ? pn : 1,
			});
		}
	}, [pn, fetchState?.total]);

	const onPageNavigationChangeHandler = (pagination) => {
		setPager(pagination);
		const { page } = pagination;
		const qryStr = appendOrUpdateToQueryString(search, 'pn', page);
		const paramsObject = getParamsForRoute(data, routeParamMap);

		navigate(`${routePath(paramsObject)}${qryStr}`);
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
				<meta property="og:description" content={replacedText.metaDescription} />
				<link rel="canonical" href={canonicalHost + window.location.pathname} />
				{(() => {
					if (status) {
						return <meta name="prerender-status-code" content={status} />;
					}
				})()}
				{(() => {
					if (status === '301') {
						return <meta name="prerender-header" content={`Location: ${prerenderHeader}`} />;
					}
				})()}
			</Helmet>
		);
	};

	// It is assumed this function will be called only if there are
	// trials.
	const renderPagerSection = (placement) => {
		const page = pn ?? 1;
		const pagerOffset = getPageOffset(page, itemsPerPage);
		return (
			<>
				<div className="ctla-results__summary grid-container">
					<div className="grid-row">
						{placement === 'top' && (
							<div className="ctla-results__count grid-col">
								{`
   							Trials ${pagerOffset + 1}-${Math.min(pagerOffset + itemsPerPage, fetchState.total)} of
   							${fetchState.total}
   						`}
							</div>
						)}
					</div>
					<div className="grid-row">
						{fetchState.total > itemsPerPage && (
							<div className="ctla-results__pager grid-col">
								<Pager current={Number(pager.page)} onPageNavigationChange={onPageNavigationChangeHandler} resultsPerPage={pager.pageUnit} totalResults={fetchState.total} />
							</div>
						)}
					</div>
				</div>
			</>
		);
	};

	const ResultsListWithPage = track({
		currentPage: Number(pager.page),
	})(ResultsList);

	return (
		<div className="disease-view">
			<div className="disease-view__container">
				<aside className="ctla-sidebar">
					<Sidebar pageType="Intervention" />
				</aside>

				<div className="disease-view__content">
					{renderHelmet()}
					<h1>{replacedText.pageTitle}</h1>

					<main className="disease-view__main">
						{(() => {
							if (loading || isApplyingFilters) {
								return <Spinner />;
							} else if (!loading && fetchState) {
								if (fetchState.total > 0) {
									return (
										<>
											{/* ::: Intro Text ::: */}
											{replacedText.introText.length > 0 && (
												<div className="ctla-results__intro grid-container">
													<div>
														<div
															className="grid-col"
															dangerouslySetInnerHTML={{
																__html: replacedText.introText,
															}}></div>
													</div>
												</div>
											)}
											{/* ::: Top Paging Section ::: */}
											{renderPagerSection('top')}
											<ScrollRestoration />
											<ResultsListWithPage results={fetchState.data} resultsItemTitleLink={detailedViewPagePrettyUrlFormatter} />
											{/* ::: Bottom Paging Section ::: */}
											{renderPagerSection('bottom')}
										</>
									);
								} else {
									return <NoResults />;
								}
							} else {
								return <ErrorPage />;
							}
						})()}
					</main>
				</div>
			</div>
		</div>
	);
};

Intervention.propTypes = {
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

export default Intervention;
``;
