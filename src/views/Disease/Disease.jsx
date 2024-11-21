// src/views/Disease/Disease.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router';
import track, { useTracking } from 'react-tracking';

// Components
import { FilterProvider } from '../../features/filters/context/FilterContext/FilterContext';
import { useFilters } from '../../features/filters/context/FilterContext/FilterContext';
import Sidebar from '../../features/filters/components/Sidebar/Sidebar';
import { Pager, NoResults, ResultsList, ScrollRestoration, Spinner } from '../../components';
import { ErrorPage } from '../ErrorBoundary';

// Hooks and utilities
import { useAppPaths } from '../../hooks';
import { useStateValue } from '../../store/store';
import { useTrialSearch } from '../../features/filters/hooks/useTrialSearch';
import { appendOrUpdateToQueryString, getKeyValueFromQueryString, getPageOffset, TokenParser, getTextReplacementContext, getNoTrialsRedirectParams, getParamsForRoute, getAnalyticsParamsForRoute } from '../../utils';

// Styles
import './Disease.scss';

const DiseaseContent = ({ routeParamMap, routePath, data, baseHost, canonicalHost, detailedViewPagePrettyUrlFormatter, dynamicListingPatterns, itemsPerPage, language, siteName, trialListingPageType }) => {
	const { NoTrialsPath } = useAppPaths();
	const location = useLocation();
	const navigate = useNavigate();
	const { search } = location;
	const tracking = useTracking();

	// Filter state management
	const { state: filterState, getCurrentFilters } = useFilters();
	const [shouldFetchTrials, setShouldFetchTrials] = useState(true);

	// Get disease ID for base filters
	const diseaseData = data.find((d) => routeParamMap.find((p) => p.paramName === 'codeOrPurl' && p.textReplacementKey === 'disease'));
	const diseaseId = diseaseData?.conceptId?.[0];

	// Base request filter - only set disease ID
	const baseFilters = {
		'diseases.nci_thesaurus_concept_id': [diseaseId],
	};

	// Pagination state
	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const pagerDefaults = {
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	};
	const [pager, setPager] = useState(pagerDefaults);

	// Watch for filter changes
	useEffect(() => {
		if (filterState.shouldSearch) {
			setShouldFetchTrials(true);

			// Explicitly reset pager state
			// setPager({
			// 	offset: 0,
			// 	page: 1,
			// 	pageUnit: itemsPerPage,
			// });
		}
	}, [filterState.shouldSearch]);

	// Combine base filters with applied filters
	const searchFilters = {
		...baseFilters,
		...getCurrentFilters(),
	};

	// Use trial search with combined filters
	const {
		trials,
		isLoading: isLoadingTrials,
		error,
	} = useTrialSearch(
		{
			...searchFilters,
			from: pager.offset,
			size: pager.pageUnit,
		},
		shouldFetchTrials
	);

	// Convert to fetchState format for existing code compatibility
	const fetchState = {
		loading: isLoadingTrials,
		payload: trials,
		error: error ? { message: error.message } : null,
	};

	// Setup replacement text
	const setupReplacementText = () => {
		const context = getTextReplacementContext(data, routeParamMap);
		const listingPatternIndex = routeParamMap.length - 1;
		const listingPattern = Object.values(dynamicListingPatterns)[listingPatternIndex];

		return {
			pageTitle: TokenParser.replaceTokens(listingPattern.pageTitle, context),
			browserTitle: TokenParser.replaceTokens(listingPattern.browserTitle, context),
			introText: TokenParser.replaceTokens(listingPattern.introText, context),
			metaDescription: TokenParser.replaceTokens(listingPattern.metaDescription, context),
		};
	};

	const replacedText = setupReplacementText();

	// Handle redirects and analytics tracking
	useEffect(() => {
		if (!fetchState.loading && fetchState.error && fetchState.error.message === 'Trial count mismatch from the API') {
			const redirectStatusCode = location.state?.redirectStatus || '404';
			const prerenderLocation = location.state?.redirectStatus ? baseHost + window.location.pathname : null;
			const redirectParams = getNoTrialsRedirectParams(data, routeParamMap);

			navigate(`${NoTrialsPath()}?${redirectParams}`, {
				replace: true,
				state: {
					redirectStatus: redirectStatusCode,
					prerenderLocation: prerenderLocation,
				},
			});
		} else if (!fetchState.loading && fetchState.payload) {
			if (fetchState.payload.total === 0) {
				const redirectStatusCode = location.state?.redirectStatus || '302';
				const prerenderLocation = location.state?.redirectStatus ? baseHost + window.location.pathname : null;
				const redirectParams = getNoTrialsRedirectParams(data, routeParamMap);

				navigate(`${NoTrialsPath()}?${redirectParams}`, {
					replace: true,
					state: {
						redirectStatus: redirectStatusCode,
						prerenderLocation: prerenderLocation,
					},
				});
			}

			if (fetchState.payload.total > 0) {
				tracking.trackEvent({
					type: 'PageLoad',
					event: 'TrialListingApp:Load:Results',
					name: canonicalHost.replace(/^(http|https):\/\//, '') + window.location.pathname,
					title: replacedText.pageTitle,
					language: language === 'en' ? 'english' : 'spanish',
					metaTitle: `${replacedText.pageTitle} - ${siteName}`,
					numberResults: fetchState.payload?.total,
					trialListingPageType: `${trialListingPageType.toLowerCase()}`,
					...getAnalyticsParamsForRoute(data, routeParamMap),
				});
			}
		}
	}, [fetchState]);

	// Handle pagination updates
	useEffect(() => {
		if (pn !== pager.page.toString()) {
			setPager({
				...pager,
				offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
				page: typeof pn === 'string' ? pn : 1,
			});
			setShouldFetchTrials(true);
		}
	}, [pn]);

	// Handle pagination updates
	const onPageNavigationChangeHandler = (pagination) => {
		setPager(pagination);
		const { page } = pagination;

		// Get current URL params
		const params = new URLSearchParams(search);
		// Update page number
		params.set('pn', page.toString());

		// Create the new URL
		const paramsObject = getParamsForRoute(data, routeParamMap);
		const newPath = routePath(paramsObject);
		const newSearch = `?${params.toString()}`;

		setShouldFetchTrials(true);

		navigate(`${newPath}${newSearch}`, {
			replace: true,
		});
	};

	// Helmet for SEO
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
				{status && <meta name="prerender-status-code" content={status} />}
				{status === '301' && <meta name="prerender-header" content={`Location: ${prerenderHeader}`} />}
			</Helmet>
		);
	};

	// Render pager section
	// const renderPagerSection = (placement) => {
	// 	const page = pn ?? 1;
	// 	const pagerOffset = getPageOffset(page, itemsPerPage);
	//
	// 	return (
	// 		<div className="ctla-results__summary grid-container">
	// 			<div className="grid-row">{placement === 'top' && <div className="ctla-results__count grid-col">{`Trials ${pagerOffset + 1}-${Math.min(pagerOffset + itemsPerPage, fetchState.payload.total)} of ${fetchState.payload.total}`}</div>}</div>
	// 			<div className="grid-row">
	// 				{fetchState.payload.total > itemsPerPage && (
	// 					<div className="ctla-results__pager grid-col">
	// 						<Pager current={Number(pager.page)} onPageNavigationChange={onPageNavigationChangeHandler} resultsPerPage={pager.pageUnit} totalResults={fetchState.payload.total} />
	// 					</div>
	// 				)}
	// 			</div>
	// 		</div>
	// 	);
	// };
	//

	const renderPagerSection = (placement) => {
		const total = fetchState.payload?.total || 0;

		// Only calculate offsets if we have results
		if (total === 0) {
			return (
				<div className="ctla-results__summary grid-container">
					<div className="grid-row">{placement === 'top' && <div className="ctla-results__count grid-col">No trials found</div>}</div>
				</div>
			);
		}

		// Calculate correct start and end counts
		const pagerOffset = getPageOffset(pager.page, itemsPerPage);
		const startCount = pagerOffset + 1;
		const endCount = Math.min(pagerOffset + itemsPerPage, total);

		// Validate that our counts make sense
		if (startCount > total) {
			// If we somehow got an invalid page, reset to page 1
			setPager({
				offset: 0,
				page: 1,
				pageUnit: itemsPerPage,
			});
			setShouldFetchTrials(true);
			return null; // Don't render until we've reset
		}

		return (
			<div className="ctla-results__summary grid-container">
				<div className="grid-row">{placement === 'top' && <div className="ctla-results__count grid-col">{`Trials ${startCount}-${endCount} of ${total}`}</div>}</div>
				<div className="grid-row">
					{total > itemsPerPage && (
						<div className="ctla-results__pager grid-col">
							<Pager current={Number(pager.page)} onPageNavigationChange={onPageNavigationChangeHandler} resultsPerPage={pager.pageUnit} totalResults={total} />
						</div>
					)}
				</div>
			</div>
		);
	};

	const ResultsListWithPage = track({
		currentPage: Number(pager.page),
	})(ResultsList);

	return (
		<div className="disease-view">
			{renderHelmet()}
			<div className="disease-view__container">
				<Sidebar />
				<main className="disease-view__main">
					<h1>{replacedText.pageTitle}</h1>

					{/* Moved intro text outside of the conditional rendering */}
					{replacedText.introText.length > 0 && (
						<div className="ctla-results__intro">
							<div
								dangerouslySetInnerHTML={{
									__html: replacedText.introText,
								}}
							/>
						</div>
					)}

					{(() => {
						if (fetchState.loading) {
							return <Spinner />;
						} else if (!fetchState.loading && fetchState.payload) {
							if (fetchState.payload.total > 0) {
								return (
									<>
										{renderPagerSection('top')}
										<ScrollRestoration />
										<ResultsListWithPage results={fetchState.payload.data} resultsItemTitleLink={detailedViewPagePrettyUrlFormatter} />
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
	);
};

DiseaseContent.propTypes = {
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
	baseHost: PropTypes.string.isRequired,
	canonicalHost: PropTypes.string.isRequired,
	detailedViewPagePrettyUrlFormatter: PropTypes.string.isRequired,
	dynamicListingPatterns: PropTypes.object.isRequired,
	itemsPerPage: PropTypes.number.isRequired,
	language: PropTypes.string.isRequired,
	siteName: PropTypes.string.isRequired,
	trialListingPageType: PropTypes.string.isRequired,
};

// Main Disease component wrapper
const Disease = ({ routeParamMap, routePath, data, isInitialLoading }) => {
	const [state] = useStateValue();

	if (isInitialLoading) {
		return (
			<div className="disease-view">
				<div className="disease-view__container">
					<Sidebar />
					{/*<main className="disease-view__main">*/}
					{/*	<Spinner />*/}
					{/*</main>*/}
				</div>
			</div>
		);
	}

	return <DiseaseContent routeParamMap={routeParamMap} routePath={routePath} data={data} baseHost={state.baseHost} canonicalHost={state.canonicalHost} detailedViewPagePrettyUrlFormatter={state.detailedViewPagePrettyUrlFormatter} dynamicListingPatterns={state.dynamicListingPatterns} itemsPerPage={state.itemsPerPage} language={state.language} siteName={state.siteName} trialListingPageType={state.trialListingPageType} />;
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
