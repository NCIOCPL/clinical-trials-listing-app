import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router';
import track, { useTracking } from 'react-tracking';

import { Pager, ResultsList, ScrollRestoration, Spinner } from '../../components';
import NoResultsWithFilters from '../../components/molecules/NoResultsWithFilters/NoResultsWithFilters';
import { ErrorPage } from '../ErrorBoundary';
import { useAppPaths } from '../../hooks';
import { useFilters } from '../../features/filters/context/FilterContext/FilterContext';
import Sidebar from '../../features/filters/components/Sidebar/Sidebar';
import { useStateValue } from '../../store/store';
import { appendOrUpdateToQueryString, getKeyValueFromQueryString, getPageOffset, TokenParser, getAnalyticsParamsForRoute, getNoTrialsRedirectParams, getParamsForRoute } from '../../utils';
import { formatLocationString, getAppliedFieldsString } from '../../features/filters/utils/analytics';
import { FILTER_EVENTS, INTERACTION_TYPES } from '../../features/filters/tracking/filterEvents';
import { useFilterCounters } from '../../features/filters/hooks/useFilterCounters';
import { hocStates } from '../hocReducer';
import { useTrialSearch } from '../../features/filters/hooks/useTrialSearch';

// Add lastHoCRedirectStatus and isInitialLoading to props
const Intervention = ({ routeParamMap, routePath, data, isInitialLoading, state, lastHoCRedirectStatus }) => {
	const location = useLocation(); // Need location early for log
	// console.log(`[Intervention] Start Render. Props: lastHoCRedirectStatus=${lastHoCRedirectStatus}, isInitialLoading=${isInitialLoading}. Location State:`, JSON.stringify(location.state)); // LOG
	const { NoTrialsPath } = useAppPaths();
	const navigate = useNavigate();
	const { search } = location;

	const [{ baseHost, canonicalHost, detailedViewPagePrettyUrlFormatter, dynamicListingPatterns, itemsPerPage, language, siteName, trialListingPageType }] = useStateValue();

	// Add filter related state and hooks
	const { state: filterState, getCurrentFilters, isApplyingFilters } = useFilters();
	const [shouldFetchTrials, setShouldFetchTrials] = useState(true);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [filtersSubmitted, setFiltersSubmitted] = useState(false);
	const [initialTotalCount, setInitialTotalCount] = useState(null);
	const [pendingFilterEvent, setPendingFilterEvent] = useState(null); // { type: 'apply'|'clear', filters?, counter, appliedCounter? }
	const { filterRemovedCounter } = useFilterCounters();

	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const pagerDefaults = {
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	};

	const [pager, setPager] = useState(pagerDefaults);

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
		} catch (error) {
			console.error('Error in setupRequestFilters:', error);
			return {};
		}
	};

	const setupReplacementText = () => {
		// Replace tokens within page title, browser title, intro text, and meta description
		try {
			if (!data || !routeParamMap) {
				return {
					pageTitle: '',
					browserTitle: '',
					introText: '',
					metaDescription: '',
				};
			}
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

	const baseRequestFilters = setupRequestFilters();
	const replacedText = setupReplacementText();
	const tracking = useTracking();

	// Helper function to determine if user has applied any filters
	const hasAppliedFilters = () => {
		const filters = getCurrentFilters();

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

	const handleRedirect = (status) => {
		// console.log(`[Intervention handleRedirect] Called with status: ${status}`); // LOG
		let redirectParams = '';

		// If data is available, use getNoTrialsRedirectParams
		if (data && routeParamMap) {
			redirectParams = getNoTrialsRedirectParams(data, routeParamMap);
		} else {
			// Extract intervention name from URL path for direct navigation cases
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

		// console.log(`[Intervention handleRedirect] Final redirect status: ${finalRedirectStatus}. Prerender Location: ${prerenderLocation}. Navigating...`); // LOG

		return navigate(`${NoTrialsPath()}?${redirectParams.replace(new RegExp('/&$/'), '')}`, {
			replace: true,
			state: {
				redirectStatus: finalRedirectStatus, // Directly use the passed status
				prerenderLocation: prerenderLocation,
			},
		});
	};

	// Watch for filter changes
	// Add a check to ensure we have required data before fetching
	const hasRequiredData = Boolean(data && routeParamMap);

	useEffect(() => {
		if (filterState.shouldSearch && hasRequiredData) {
			setShouldFetchTrials(true);
			setFiltersSubmitted(true); // Set flag when filters are submitted
		}
	}, [filterState.shouldSearch, hasRequiredData]);

	// Combine base filters with applied filters
	const searchFilters = {
		...baseRequestFilters,
		...getCurrentFilters(),
	};

	// Rename loading to avoid conflict with isInitialLoading prop
	const {
		trials: fetchState,
		isLoading: isTrialSearchLoading,
		error: trialSearchError,
	} = useTrialSearch(
		{
			...searchFilters,
			from: pager.offset,
			size: pager.pageUnit,
		},
		shouldFetchTrials && hasRequiredData
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

	useEffect(() => {
		// Removed temporary log

		// If you try to access a nonexistent page, eg: try to access page 41 of 1-40 pages
		// Use trialSearchError here
		if (!isTrialSearchLoading && trialSearchError?.message === 'Trial count mismatch from the API') {
			handleRedirect('404');
		} else if (!isTrialSearchLoading && fetchState) {
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
			// Use isTrialSearchLoading here
			if (isInitialLoad && !isTrialSearchLoading && fetchState?.total > 0) {
				setInitialTotalCount(fetchState.total);
			}

			// Handle truly empty results (no trials at all)
			// console.log(`[Intervention Effect] Before total check. fetchState.total=${fetchState?.total}, hasAppliedFilters=${hasAppliedFilters()}, lastHoCRedirectStatus=${lastHoCRedirectStatus}`); // LOG
			if (fetchState?.total === 0) {
				// Only redirect to NoTrialsFound if no filters are applied
				if (!hasAppliedFilters()) {
					// Use 301 if the last HoC redirect was 301, otherwise 302
					const statusForNoTrials = lastHoCRedirectStatus === '301' ? '301' : '302';
					// console.log(`[Intervention Effect] No trials found and no filters applied. Calculated statusForNoTrials: ${statusForNoTrials}. Calling handleRedirect.`); // LOG
					handleRedirect(statusForNoTrials);
				}
				// If filters are applied, stay on page and show NoResultsWithFilters (handled in render)
			} else if (fetchState?.total > 0) {
				// Only fire tracking event on initial load or when filters are submitted
				if (isInitialLoad || filtersSubmitted) {
					// Fire off tracking event for successful results
					// Create trackingData inside the event to ensure data is available
					const trackingData = getAnalyticsParamsForRoute(data, routeParamMap);
					tracking.trackEvent({
						type: 'PageLoad',
						event: 'TrialListingApp:Load:Results',
						name: canonicalHost.replace(/^(http|https):\/\//, '') + window.location.pathname,
						title: replacedText.pageTitle,
						language: language === 'en' ? 'english' : 'spanish',
						metaTitle: `${replacedText.pageTitle} - ${siteName}`,
						numberResults: fetchState.total,
						trialListingPageType: `${trialListingPageType.toLowerCase()}`,
						...(trackingData || {}),
					});

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
		// Update dependency array with renamed variables
	}, [isTrialSearchLoading, fetchState, trialSearchError, isInitialLoad, filtersSubmitted]);

	// Dedicated useEffect for filter analytics
	useEffect(() => {
		// Only process when we have a pending event, data fetch is complete, and we have results
		// Use isTrialSearchLoading here
		if (pendingFilterEvent && !isTrialSearchLoading && fetchState && fetchState.total !== undefined) {
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
		// Update dependency array with renamed variable
	}, [pendingFilterEvent, isTrialSearchLoading, fetchState, filterRemovedCounter, tracking]);

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
		const pathAndPage = window.location.pathname + `?pn=${pager.page}`;

		// Get redirect status from state or location.state
		let redirectStatus = '';

		// Prioritize the persistent status from the last HoC redirect - THIS IS THE KEY ADDITION
		if (lastHoCRedirectStatus) {
			redirectStatus = lastHoCRedirectStatus;
		}
		// Then check other potential sources
		else if (state && state.status === hocStates.REDIR_STATE) {
			redirectStatus = '301';
		} else if ((state && state.redirectStatus === '301') || location.state?.redirectStatus === '301') {
			redirectStatus = '301';
		} else if (location.state?.redirectStatus) {
			redirectStatus = location.state.redirectStatus;
		}

		// Force '301' status for code-to-pretty URL redirects
		if (location.search.includes('redirect=true')) {
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
			{renderHelmet()}

			<div className="disease-view__container">
				<aside className="ctla-sidebar">
					<Sidebar
						pageType="Intervention"
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
				</aside>

				<h1 className="disease-view__heading nci-heading-h1">{replacedText.pageTitle}</h1>

				{/* ::: Intro Text ::: */}
				{replacedText.introText.length > 0 && <div className="disease-view__intro ctla-results__intro" dangerouslySetInnerHTML={{ __html: replacedText.introText }}></div>}

				<div className="disease-view__content">
					<main className="disease-view__main">
						{(() => {
							// Use isInitialLoading prop from HoC first
							if (isInitialLoading) {
								// Use the prop here
								return <Spinner />;
							}
							// Then check trial search specific loading/applying state
							if (isTrialSearchLoading || isApplyingFilters) {
								return <Spinner />;
							}
							// Handle trial search error
							else if (trialSearchError) {
								console.error('Error from useTrialSearch:', trialSearchError);
								return <ErrorPage />;
							}
							// Check fetchState only after loading and error checks
							else if (fetchState) {
								if (fetchState.total > 0) {
									return (
										<>
											{/* ::: Top Paging Section ::: */}
											{renderPagerSection('top')}
											<ScrollRestoration />
											<ResultsListWithPage results={fetchState.data} resultsItemTitleLink={detailedViewPagePrettyUrlFormatter} />
											{/* ::: Bottom Paging Section ::: */}
											{renderPagerSection('bottom')}
										</>
									);
								} else {
									// fetchState.total === 0
									// No trials found case
									return (
										<>
											<div className="ctla-results__summary grid-container">
												<div className="grid-row">
													<div className="ctla-results__count grid-col">Trials 0 of 0</div>
												</div>
											</div>
											<hr className="ctla-results__divider" />
											<NoResultsWithFilters />
										</>
									);
								}
							}
							// Fallback case if none of the above conditions are met
							else {
								console.warn('Intervention render: Unexpected state - HoC loaded, trial search not loading/error, but no fetchState.');
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
	state: PropTypes.object,
	// Add prop type for isInitialLoading
	isInitialLoading: PropTypes.bool,
	// Add prop type for lastHoCRedirectStatus
	lastHoCRedirectStatus: PropTypes.string,
};

export default Intervention;
``;
