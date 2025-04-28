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
import { formatLocationString, getAppliedFieldsString } from '../../features/filters/utils/analytics.js';
import { FILTER_EVENTS, INTERACTION_TYPES } from '../../features/filters/tracking/filterEvents';
import { useFilterCounters } from '../../features/filters/hooks/useFilterCounters';
import { hocStates } from '../../views/hocReducer';
import NoResultsWithFilters from '../../components/molecules/NoResultsWithFilters/NoResultsWithFilters';

// Add lastHoCRedirectStatus to props
const Disease = ({ routeParamMap, routePath, data, isInitialLoading, state, lastHoCRedirectStatus }) => {
	const location = useLocation(); // Need location early for log
	// console.log(`[Disease] Start Render. Props: lastHoCRedirectStatus=${lastHoCRedirectStatus}, isInitialLoading=${isInitialLoading}. Location State:`, JSON.stringify(location.state)); // LOG
	const { NoTrialsPath } = useAppPaths();
	const navigate = useNavigate();
	const { search } = location;
	const tracking = useTracking();

	const [{ baseHost, canonicalHost, detailedViewPagePrettyUrlFormatter, dynamicListingPatterns, itemsPerPage, language, siteName, trialListingPageType }] = useStateValue();

	// Filter and pagination state
	const { state: filterState, getCurrentFilters, isApplyingFilters } = useFilters();
	const [shouldFetchTrials, setShouldFetchTrials] = useState(true);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [filtersSubmitted, setFiltersSubmitted] = useState(false);
	const [initialTotalCount, setInitialTotalCount] = useState(null);
	const [pendingFilterEvent, setPendingFilterEvent] = useState(null); // { type: 'apply'|'clear', filters?, counter, appliedCounter? }
	const { filterRemovedCounter } = useFilterCounters();
	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const [pager, setPager] = useState({
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	});
	// const trackingData = getAnalyticsParamsForRoute(data, routeParamMap);

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

	// // spmething has wrong or no trials
	// useEffect(() => {
	// 	if (fetchState && !fetchState.loading && fetchState.error != null && fetchState.error.message === 'Trial count mismatch from the API') {
	// 		//	handleRedirect('404');
	//
	// 		const redirectStatusCode = location.state?.redirectStatus ? location.state?.redirectStatus : '404';
	//
	// 		const prerenderLocation = location.state?.redirectStatus ? baseHost + window.location.pathname : null;
	//
	// 		// So this is handling the redirect to the no trials page.
	// 		// it is the job of the dynamic route views to property
	// 		// set the p1,p2,p3 parameters.
	// 		const redirectParams = getNoTrialsRedirectParams(data, routeParamMap);
	//
	// 		navigate(`${NoTrialsPath()}?${redirectParams.replace(new RegExp('/&$/'), '')}`, {
	// 			replace: true,
	// 			state: {
	// 				redirectStatus: redirectStatusCode,
	// 				prerenderLocation: prerenderLocation,
	// 			},
	// 		});
	// 	} else if (fetchState && !fetchState.loading && fetchState.payload) {
	// 		if (fetchState.payload.total === 0) {
	// 			// Ww have no trials
	// 			const redirectStatusCode = location.state?.redirectStatus ? location.state?.redirectStatus : '302';
	// 			const prerenderLocation = location.state?.redirectStatus ? baseHost + window.location.pathname : null;
	//
	// 			// So this is handling the redirect to the no trials page.
	// 			// it is the job of the dynamic route views to property
	// 			// set the p1,p2,p3 parameters.
	// 			const redirectParams = getNoTrialsRedirectParams(data, routeParamMap);
	//
	// 			navigate(`${NoTrialsPath()}?${redirectParams.replace(new RegExp('/&$/'), '')}`, {
	// 				replace: true,
	// 				state: {
	// 					redirectStatus: redirectStatusCode,
	// 					prerenderLocation: prerenderLocation,
	// 				},
	// 			});
	// 			// return ;
	// 		}
	//
	// 		// Fire off a page load event. Usually this would be in
	// 		// some effect when something loaded.
	// 		if (fetchState.payload.total > 0) {
	// 			tracking.trackEvent({
	// 				// These properties are required.
	// 				type: 'PageLoad',
	// 				event: 'TrialListingApp:Load:Results',
	// 				name: canonicalHost.replace(/^(http|https):\/\//, '') + window.location.pathname,
	// 				title: replacedText.pageTitle,
	// 				language: language === 'en' ? 'english' : 'spanish',
	// 				metaTitle: `${replacedText.pageTitle} - ${siteName}`,
	// 				// Any additional properties fall into the "page.additionalDetails" bucket
	// 				// for the event.
	// 				numberResults: fetchState.payload?.total,
	// 				trialListingPageType: `${trialListingPageType.toLowerCase()}`,
	// 				// ...trackingData,
	// 			});
	// 		}
	// 	}
	// }, [fetchState]);

	// Watch for filter changes
	useEffect(() => {
		if (filterState.shouldSearch && hasRequiredData) {
			setShouldFetchTrials(true);
			setFiltersSubmitted(true); // Set flag when filters are submitted
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
		// Removed temporary log

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

			// Capture initial total count
			if (isInitialLoad && !loading && fetchState?.total > 0) {
				setInitialTotalCount(fetchState.total);
			}

			// Handle truly empty results (no trials at all)
			// console.log(`[Disease Effect] Before total check. fetchState.total=${fetchState?.total}, hasAppliedFilters=${hasAppliedFilters()}, lastHoCRedirectStatus=${lastHoCRedirectStatus}`); // LOG
			if (fetchState?.total === 0) {
				// Only redirect to NoTrialsFound if no filters are applied
				if (!hasAppliedFilters()) {
					// Use 301 if the last HoC redirect was 301, otherwise 302
					const statusForNoTrials = lastHoCRedirectStatus === '301' ? '301' : '302';
					// console.log(`[Disease Effect] No trials found and no filters applied. Calculated statusForNoTrials: ${statusForNoTrials}. Calling handleRedirect.`); // LOG
					handleRedirect(statusForNoTrials);
				}
				// If filters are applied, stay on page and show NoResultsWithFilters (handled in render)
			} else if (fetchState?.total > 0) {
				// Only fire tracking event on initial load or when filters are submitted
				if (isInitialLoad || filtersSubmitted) {
					trackPageView();

					// Filter apply tracking moved to dedicated useEffect

					// Reset flags after firing the event
					if (isInitialLoad) {
						setIsInitialLoad(false);
					}
					if (filtersSubmitted) {
						setFiltersSubmitted(false);
					}
				}
			}
		}
	}, [loading, fetchState, error, isInitialLoad, filtersSubmitted]);

	// Dedicated useEffect for filter analytics
	useEffect(() => {
		// Only process when we have a pending event, data fetch is complete, and we have results
		if (pendingFilterEvent && !loading && fetchState && fetchState.total !== undefined) {
			// Handle different event types
			if (pendingFilterEvent.type === 'apply') {
				const { filters, counter } = pendingFilterEvent;

				// Check if actual filters were applied (not just clicking apply with no filters)
				const isAgeApplied = !!filters.age?.toString().trim();
				const isLocationApplied = !!filters.location?.zipCode;

				if (isAgeApplied || isLocationApplied) {
					// Use the utility functions with the exact filters that were applied
					// Use "none" for age when no age filter is set
					const age = filters.age?.toString().trim() || 'none';
					// Use "all" for loc when no location filter is set
					const loc = filters.location?.zipCode ? formatLocationString(filters.location) : 'all';
					const fieldsUsed = getAppliedFieldsString(filters);

					tracking.trackEvent({
						type: 'Other',
						event: FILTER_EVENTS.APPLY,
						linkName: FILTER_EVENTS.APPLY,
						interactionType: INTERACTION_TYPES.FILTER_APPLIED,
						numberResults: fetchState.total, // Current results with applied filters
						fieldsUsed: fieldsUsed,
						age: age,
						loc: loc,
						filterAppliedCounter: counter,
						filterRemovedCounter: filterRemovedCounter,
					});
				}
			} else if (pendingFilterEvent.type === 'clear') {
				// Handle clear filters event
				tracking.trackEvent({
					type: 'Other',
					event: FILTER_EVENTS.MODIFY,
					linkName: FILTER_EVENTS.MODIFY,
					interactionType: INTERACTION_TYPES.CLEAR_ALL,
					fieldRemoved: 'all',
					filterAppliedCounter: pendingFilterEvent.appliedCounter,
					filterRemovedCounter: pendingFilterEvent.counter,
					numberResults: fetchState.total, // Current unfiltered results count
				});
			}

			// Clear the pending event once processed
			setPendingFilterEvent(null);
		}
	}, [pendingFilterEvent, loading, fetchState, filterRemovedCounter, tracking]);

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
		// console.log(`[Disease handleRedirect] Called with status: ${status}`); // LOG
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

		// Use the status determined by the calling useEffect
		const finalRedirectStatus = status;

		// Determine prerenderLocation based on the final status
		let prerenderLocation;
		if (finalRedirectStatus === '301') {
			// For 301 (code -> pretty -> notrials), point to the pretty URL
			prerenderLocation = baseHost + location.pathname;
		} else if (finalRedirectStatus === '302') {
			// For 302 (pretty -> notrials), point to the notrials URL
			const destinationUrl = baseHost + NoTrialsPath() + '?' + redirectParams.replace(new RegExp('/&$/'), '');
			prerenderLocation = destinationUrl;
		} else {
			// Handle 404 or other cases
			prerenderLocation = null;
		}

		// console.log(`[Disease handleRedirect] Final redirect status: ${finalRedirectStatus}. Prerender Location: ${prerenderLocation}. Navigating...`); // LOG

		// We want an immediate return to ensure the redirect happens synchronously
		return navigate(`${NoTrialsPath()}?${redirectParams.replace(new RegExp('/&$/'), '')}`, {
			replace: true,
			state: {
				redirectStatus: finalRedirectStatus, // Directly use the passed status
				prerenderLocation: prerenderLocation,
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

		// Prioritize the persistent status from the last HoC redirect
		if (lastHoCRedirectStatus) {
			redirectStatus = lastHoCRedirectStatus;
		}
		// Then check other potential sources (though lastHoCRedirectStatus should cover the 301 case)
		else if (state?.status === hocStates.REDIR_STATE) {
			redirectStatus = '301'; // This might be redundant if lastHoCRedirectStatus is always set
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
					<Sidebar
						pageType="Disease"
						initialTotalCount={initialTotalCount}
						onFilterApplied={(appliedFilters, counterValue) => {
							setPendingFilterEvent({
								type: 'apply',
								filters: appliedFilters,
								counter: counterValue,
							});
						}}
						onFilterCleared={(counterValue, appliedCounter) => {
							setPendingFilterEvent({
								type: 'clear',
								counter: counterValue,
								appliedCounter: appliedCounter,
							});
						}}
					/>
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
				<Sidebar
					pageType="Disease"
					initialTotalCount={initialTotalCount}
					onFilterApplied={(appliedFilters, counterValue) => {
						setPendingFilterEvent({
							type: 'apply',
							filters: appliedFilters,
							counter: counterValue,
						});
					}}
					onFilterCleared={(counterValue, appliedCounter) => {
						setPendingFilterEvent({
							type: 'clear',
							counter: counterValue,
							appliedCounter: appliedCounter,
						});
					}}
				/>

				<h1 className="disease-view__heading nci-heading-h1">{replacedText.pageTitle}</h1>

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
	// Add prop type for lastHoCRedirectStatus
	lastHoCRedirectStatus: PropTypes.string,
};

export default Disease;
