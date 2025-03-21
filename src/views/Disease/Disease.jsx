import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router';
import track, { useTracking } from 'react-tracking';
import PropTypes from 'prop-types';

import { Pager, NoResults, ResultsList, ScrollRestoration, Spinner } from '../../components';
import { ErrorPage } from '../ErrorBoundary';
import { useAppPaths } from '../../hooks';
import { useFilters } from '../../features/filters/context/FilterContext/FilterContext';
import Sidebar from '../../features/filters/components/Sidebar/Sidebar';
import { useStateValue } from '../../store/store';
import { useTrialSearch } from '../../features/filters/hooks/useTrialSearch';
import { appendOrUpdateToQueryString, getKeyValueFromQueryString, getPageOffset, TokenParser, getAnalyticsParamsForRoute, getNoTrialsRedirectParams, getParamsForRoute, getTextReplacementContext } from '../../utils';
import { hocStates } from '../../views/hocReducer';
import NoResultsWithFilters from '../../components/molecules/NoResultsWithFilters/NoResultsWithFilters';

const Disease = ({ routeParamMap, routePath, data, isInitialLoading, state }) => {
	const { NoTrialsPath } = useAppPaths();
	const location = useLocation();
	const navigate = useNavigate();
	const { search } = location;
	const tracking = useTracking();

	const [{ baseHost, canonicalHost, detailedViewPagePrettyUrlFormatter, dynamicListingPatterns, itemsPerPage, language, siteName, trialListingPageType }] = useStateValue();

	// Filter and pagination state
	const { state: filterState, getCurrentFilters, isApplyingFilters } = useFilters();
	const [shouldFetchTrials, setShouldFetchTrials] = useState(true);
	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const [pager, setPager] = useState({
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	});

	/**
	 * Sets up text content by replacing placeholders with dynamic values from the provided data.
	 * This includes page title, browser title, intro text, and meta description.
	 */
	const setupReplacementText = () => {
		try {
			const context = getTextReplacementContext(data, routeParamMap);
			const listingPatternIndex = routeParamMap.length - 1 || 0;
			const listingPattern = Object.values(dynamicListingPatterns)[listingPatternIndex];

			if (!listingPattern) {
				console.error('No listing pattern found');
				return {
					pageTitle: '',
					browserTitle: '',
					introText: '',
					metaDescription: '',
				};
			}

			return {
				pageTitle: TokenParser.replaceTokens(listingPattern.pageTitle, context),
				browserTitle: TokenParser.replaceTokens(listingPattern.browserTitle, context),
				introText: TokenParser.replaceTokens(listingPattern.introText, context),
				metaDescription: TokenParser.replaceTokens(listingPattern.metaDescription, context),
			};
		} catch (error) {
			console.error('Error in setupReplacementText:', error);
			return {
				pageTitle: '',
				browserTitle: '',
				introText: '',
				metaDescription: '',
			};
		}
	};

	/**
	 * Builds API request filters based on route parameters and disease/intervention data.
	 */
	const setupRequestFilters = () => {
		try {
			if (!data || !routeParamMap) {
				return {};
			}

			return data.reduce((acQuery, paramData, idx) => {
				const paramInfo = routeParamMap[idx];

				switch (paramInfo.paramName) {
					case 'codeOrPurl':
						return {
							...acQuery,
							'diseases.nci_thesaurus_concept_id': paramData?.conceptId || [],
						};
					case 'type':
						return {
							...acQuery,
							primary_purpose: paramData?.idString || '',
						};
					case 'interCodeOrPurl':
						return {
							...acQuery,
							'arms.interventions.nci_thesaurus_concept_id': paramData?.conceptId || [],
						};
					default:
						console.warn(`Unknown parameter ${paramInfo.paramName}`);
						return acQuery;
				}
			}, {});
		} catch (error) {
			console.error('Error in setupRequestFilters:', error);
			return {};
		}
	};

	const baseRequestFilters = setupRequestFilters();
	const replacedText = setupReplacementText();
	const searchFilters = {
		...baseRequestFilters,
		...getCurrentFilters(),
	};
	const hasRequiredData = Boolean(data && routeParamMap && !isInitialLoading);

	// Fetch trials
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
		shouldFetchTrials && hasRequiredData
	);

	useEffect(() => {
		if (fetchState && !fetchState.loading && fetchState.error != null && fetchState.error.message === 'Trial count mismatch from the API') {
			handleRedirect('404');
		}
	}, [fetchState]);

	// Watch for filter changes
	useEffect(() => {
		if (filterState.shouldSearch && hasRequiredData) {
			setShouldFetchTrials(true);
		}
	}, [filterState.shouldSearch, hasRequiredData]);

	// Handle trial fetch results
	// useEffect(() => {
	// 	if (!loading && error?.message === 'Trial count mismatch from the API') {
	// 		const redirectStatusCode = location.state?.redirectStatus ? location.state?.redirectStatus : '404';
	// 		const prerenderLocation = location.state?.redirectStatus ? baseHost + window.location.pathname : null;
	//
	// 		const redirectParams = getNoTrialsRedirectParams(data, routeParamMap);
	// 		navigate(`${NoTrialsPath()}?${redirectParams.replace(new RegExp('/&$/'), '')}`, {
	// 			replace: true,
	// 			state: {
	// 				redirectStatus: redirectStatusCode,
	// 				prerenderLocation,
	// 			},
	// 		});
	// 	} else if (!loading && fetchState) {
	// 		if (fetchState.total === 0) {
	// 			const redirectStatusCode = location.state?.redirectStatus ? location.state?.redirectStatus : '302';
	// 			const prerenderLocation = location.state?.redirectStatus ? baseHost + window.location.pathname : null;
	//
	// 			const redirectParams = getNoTrialsRedirectParams(data, routeParamMap);
	// 			navigate(`${NoTrialsPath()}?${redirectParams.replace(new RegExp('/&$/'), '')}`, {
	// 				replace: true,
	// 				state: {
	// 					redirectStatus: redirectStatusCode,
	// 					prerenderLocation,
	// 				},
	// 			});
	// 		} else if (fetchState.total > 0) {
	// 			trackPageView();
	// 		}
	// 	}
	// }, [loading, fetchState, error]);
	// Helper function to determine if user has applied any filters
	const hasAppliedFilters = () => {
		const filters = getCurrentFilters();
		// const baseFilters = baseRequestFilters;

		// Check if age filter is applied
		if (filters['eligibility.structured.min_age_in_years_lte'] || filters['eligibility.structured.max_age_in_years_gte']) {
			return true;
		}

		// Check if location filter is applied
		if (filters['sites.org_coordinates_lat'] || filters['sites.org_coordinates_lon'] || filters['sites.org_coordinates_dist']) {
			return true;
		}

		return false;
	};

	useEffect(() => {
		if (!loading && error?.message === 'Trial count mismatch from the API') {
			handleRedirect('404');
		} else if (!loading && fetchState) {
			// If we have trials (total > 0) but current page is empty,
			// this is an invalid page number situation
			if (fetchState?.total > 0 && fetchState?.data && fetchState.data.length === 0) {
				// Simply update the URL to page 1 instead of redirecting to NoTrialsFound
				const qryStr = appendOrUpdateToQueryString(search, 'pn', 1);
				const paramsObject = getParamsForRoute(data, routeParamMap);
				navigate(`${routePath(paramsObject)}${qryStr}`, { replace: true });
				return; // Exit early to prevent other conditions from executing
			}

			// Handle truly empty results (no trials at all)
			if (fetchState?.total === 0) {
				// Only redirect to NoTrialsFound if no filters are applied
				if (!hasAppliedFilters()) {
					handleRedirect('302');
				}
				// If filters are applied, stay on page and show NoResultsWithFilters (handled in render)
			} else if (fetchState?.total > 0) {
				trackPageView();
			}
		}
	}, [loading, fetchState, error]);

	// Handle pagination
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
	}, [pn, location.pathname, location.search, fetchState?.total]);
	const handleRedirect = (status) => {
		let redirectParams = '';

		// If data is available, use getNoTrialsRedirectParams
		if (data && routeParamMap) {
			redirectParams = getNoTrialsRedirectParams(data, routeParamMap);
		} else {
			// Extract disease name from URL path for direct navigation cases
			const pathParts = location.pathname.split('/');
			if (pathParts.length > 1 && pathParts[1]) {
				redirectParams = `p1=${pathParts[1]}`;
			}
		}

		const prerenderLocation = status === '404' ? null : baseHost + location.pathname;

		// Preserve existing redirectStatus if present, otherwise use the new status
		const redirectStatus = location.state?.redirectStatus || status;

		// We want an immediate return to ensure the redirect happens synchronously
		return navigate(`${NoTrialsPath()}?${redirectParams.replace(new RegExp('/&$/'), '')}`, {
			replace: true,
			state: {
				redirectStatus,
				prerenderLocation,
			},
		});
	};

	const onPageNavigationChange = (pagination) => {
		setPager(pagination);
		const { page } = pagination;
		const qryStr = appendOrUpdateToQueryString(search, 'pn', page);
		const paramsObject = getParamsForRoute(data, routeParamMap);
		navigate(`${routePath(paramsObject)}${qryStr}`);
	};

	const trackPageView = () => {
		const trackingData = getAnalyticsParamsForRoute(data, routeParamMap);
		tracking.trackEvent({
			type: 'PageLoad',
			event: 'TrialListingApp:Load:Results',
			name: canonicalHost.replace(/^(http|https):\/\//, '') + location.pathname,
			title: replacedText.pageTitle,
			language: language === 'en' ? 'english' : 'spanish',
			metaTitle: `${replacedText.pageTitle} - ${siteName}`,
			numberResults: fetchState.total,
			trialListingPageType: `${trialListingPageType.toLowerCase()}`,
			...trackingData,
		});
	};

	const ResultsListWithPage = track({
		currentPage: Number(pager.page),
	})(ResultsList);

	const renderPagerSection = (placement) => {
		if (!fetchState?.total) return null;

		const pagerOffset = getPageOffset(pager.page, itemsPerPage);
		const startCount = pagerOffset + 1;
		const endCount = Math.min(pagerOffset + itemsPerPage, fetchState.total);

		return (
			<div className="ctla-results__summary grid-container">
				<div className="grid-row">{placement === 'top' && <div className="ctla-results__count grid-col">{`Trials ${startCount}-${endCount} of ${fetchState.total}`}</div>}</div>
				<div className="grid-row">
					{fetchState.total > itemsPerPage && (
						<div className="ctla-results__pager grid-col">
							<Pager current={Number(pager.page)} onPageNavigationChange={onPageNavigationChange} resultsPerPage={pager.pageUnit} totalResults={fetchState.total} />
						</div>
					)}
				</div>
			</div>
		);
	};

	const renderHelmet = () => {
		const pathAndPage = window.location.pathname + `?pn=${pager.page}`;
		// Get redirect status from state or location.state
		let redirectStatus = '';

		// Check if we're in a redirect state
		if (state?.status === hocStates.REDIR_STATE) {
			redirectStatus = '301';
		} else if (state?.redirectStatus === '301' || location.state?.redirectStatus === '301') {
			redirectStatus = '301';
		} else if (location.state?.redirectStatus) {
			redirectStatus = location.state.redirectStatus;
		} else if (filterState.isInitialLoad && location.search.includes('redirect=true')) {
			// Handle case where page is loaded initially with redirect=true parameter
			redirectStatus = '301';
		}

		// Get prerender location from location.state
		const prerenderLocation = location.state?.prerenderLocation || baseHost + location.pathname;

		return (
			<Helmet>
				<title>{`${replacedText.browserTitle} - ${siteName}`}</title>
				<meta property="og:title" content={replacedText.pageTitle} />
				<meta property="og:url" content={baseHost + pathAndPage} />
				<meta name="description" content={replacedText.metaDescription} />
				<meta property="og:description" content={replacedText.metaDescription} />
				<link rel="canonical" href={canonicalHost + pathAndPage} />
				{redirectStatus && <meta name="prerender-status-code" content={redirectStatus} />}
				{redirectStatus === '301' && <meta name="prerender-header" content={`Location: ${prerenderLocation}`} />}
			</Helmet>
		);
	};

	// Early return for loading state
	if (isInitialLoading || !data || !routeParamMap) {
		return (
			<div className="disease-view">
				<div className="disease-view__container">
					<Sidebar pageType="Disease" />
					<div className="disease-view__content">
						<Spinner />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="disease-view">
			{renderHelmet()}

			<div className="disease-view__container">
				<Sidebar pageType="Disease" />

				<h1 className="disease-view__heading">{replacedText.pageTitle}</h1>

				{replacedText.introText && <div className="disease-view__intro ctla-results__intro" dangerouslySetInnerHTML={{ __html: replacedText.introText }} />}

				<div className="disease-view__content">
					<main className="disease-view__main">
						{loading || isApplyingFilters || isInitialLoading ? (
							<Spinner />
						) : fetchState?.total === 0 ? (
							<>
								<div className="ctla-results__summary grid-container">
									<div className="grid-row">
										<div className="ctla-results__count grid-col">Trials 0 of 0</div>
									</div>
								</div>
								<hr className="ctla-results__divider" />
								<NoResultsWithFilters />
							</>
						) : fetchState?.total > 0 ? (
							<>
								{renderPagerSection('top')}
								<ScrollRestoration />
								<ResultsListWithPage results={fetchState.data} resultsItemTitleLink={detailedViewPagePrettyUrlFormatter} />
								{renderPagerSection('bottom')}
							</>
						) : error ? (
							<ErrorPage />
						) : (
							<NoResults />
						)}
					</main>
				</div>
			</div>
		</div>
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
	isInitialLoading: PropTypes.bool,
	state: PropTypes.object,
};

export default Disease;
