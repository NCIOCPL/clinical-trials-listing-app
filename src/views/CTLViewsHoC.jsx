/* eslint-disable */
import PropTypes from 'prop-types';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { useFilters } from '../features/filters/context/FilterContext/FilterContext';
import { Spinner } from '../components';
import { ErrorPage, PageNotFound } from './ErrorBoundary';
import { useAppPaths, useListingSupport } from '../hooks';
import { useStateValue } from '../store/store';
import { getTrialType } from '../services/api/actions';
// Import the new utility function
import { appendOrUpdateToQueryString, getIdOrNameAction, getKeyValueFromQueryString, convertObjectToBase64, removeQueryParam } from '../utils';
import { hocReducer, hocStates, setLoading, setSuccessfulFetch, setFailedFetch, setNotFound, setRedirecting } from './hocReducer';
import Sidebar from '../features/filters/components/Sidebar';
/**
 * Higher order component for fetching disease information from the trial listing support API.
 *
 * @param {*} WrappedView This should either be a results view, or the notrials view.
 */

const CTLViewsHoC = (WrappedView) => {
	const WithPreFetch = ({ redirectPath, routeParamMap, ...props }) => {
		const location = useLocation(); // Need location early for log
		// console.log(`[CTLViewsHoC ${WrappedView.name}] Start Render. Path: ${location.pathname}, Search: ${location.search}, State: ${JSON.stringify(location.state)}`);
		const { NoTrialsPath } = useAppPaths();
		const params = useParams();
		const navigate = useNavigate();
		const { search } = location;
		const [{ baseHost }] = useStateValue();

		// Capture initial location state to preserve it across re-renders
		const [initialLocationState] = useState({
			redirectStatus: location.state?.redirectStatus,
			prerenderLocation: location.state?.prerenderLocation,
		});
		console.log(`[CTLViewsHoC ${WrappedView.name}] Captured initialLocationState:`, JSON.stringify(initialLocationState)); // LOG

		const [state, hocDispatch] = useReducer(hocReducer, {
			status: hocStates.LOADING_STATE,
			listingData: null,
			actionsHash: '',
		});

		// First thing we need to do is figure out what we are fetching.
		// The route will be the notrials route.
		const isNoTrials = location.pathname === NoTrialsPath();

		// Setup the actions for the fetch.
		if (!routeParamMap) {
			throw new Error(`You must supply a routeParamMap to your CTLViewsHoC wrapped component.`);
		}

		// Remove any parameters we did not receive. Since react-router does not suck, we
		// can be sure that the params passed to us will be what we expect. (e.g. it would
		// not allow /:codeOrPurl/:trial_type/:interventionCodeOrPurl to work with trialtype
		// is not in the params list.)
		//
		// Remember that the routeParamMap has the parameters in the order they can appear.
		// if the first element of routeParamMap is ':type', but your route actually has
		// ':codeOrPurl' first, then you are doing this wrong. In that case, your routeParamMap
		// needs to have ':codeOrPurl' first. This is why we can assume order of the
		// filtered list will be maintained, and that no "gaps" will be created.
		const filteredRouteParamMap = isNoTrials ? routeParamMap.filter((param, idx) => search.includes(`p${idx + 1}=`)) : routeParamMap.filter((param) => params[param.paramName]);

		// Collate provided fetch actions and filter out actions with no payloads
		const fetchActions = filteredRouteParamMap.map((param, idx) => {
			switch (param.type) {
				case 'listing-information': {
					return getIdOrNameAction(isNoTrials, params[param.paramName], idx + 1, search);
				}
				case 'trial-type': {
					return getTrialType({
						trialType: !isNoTrials ? params[param.paramName] : getKeyValueFromQueryString(`p${idx + 1}`, search),
					});
				}
				default:
					throw new Error(`${param.type} route param type is unknown.`);
			}
		});

		// Get a hash of the actions so that we can check= if the response data's
		// 'originating hash' matches the current hash during render. Changes from
		// the same route with different data will trigger a re-render with the
		// old data before the spinner is displayed.
		const currentActionsHash = convertObjectToBase64(fetchActions);

		// Initiate the fetch here. This will be called no matter what, we will rely
		// on useListingSupport to handle any caching.
		const getListingInfo = useListingSupport(fetchActions);

		//Effect to handle fetching the listing info
		useEffect(() => {
			// Either this is a brand new load, or we got redirected and we are loading
			// a new action.
			// NOTE 2: The reducer is smart enough not to change the state object if
			// it will result in an equivalent object. So setting loading -> loading
			// will not trigger a reload.
			if (getListingInfo.loading) {
				// console.log(`[CTLViewsHoC ${WrappedView.name} Effect] getListingInfo is loading. Dispatching setLoading.`); // LOG + Action
				hocDispatch(setLoading());
			}

			if (!getListingInfo.loading && getListingInfo.payload) {
				// console.log(`[CTLViewsHoC ${WrappedView.name} Effect] getListingInfo loaded. Payload received.`); // LOG
				// Check if any of the elements of the payload are null,
				// this is a 404.
				if (getListingInfo.payload.some((res) => res === null)) {
					// Handle 404. Currently this is a bit hacky, but
					// we will just throw here for the ErrorBoundary.
					// console.log(`[CTLViewsHoC ${WrappedView.name} Effect] Payload contains null. Dispatching setNotFound.`); // LOG + Action
					hocDispatch(setNotFound());
					return;
				}

				// Now we need to check if we must redirect. This would be if
				// any of the requests did not match the redirect. We only
				// handle redirects if we are not showing /notrials, for
				// sanity.

				// If we just redirected (redirect=true is in the query string), don't check again.
				const alreadyRedirected = search.includes('redirect=true');

				if (!isNoTrials && !alreadyRedirected) { // Check if not already redirected
					// console.log(`[CTLViewsHoC ${WrappedView.name} Effect] Before redirect check. Fetch actions:`, fetchActions, 'Payload:', getListingInfo.payload); // LOG
					const redirectCheck = fetchActions.some((action, idx) => (action.type === 'id' && getListingInfo.payload[idx].prettyUrlName) || (action.type === 'trialType' && action.payload !== getListingInfo.payload[idx].prettyUrlName));

					if (redirectCheck) {
						const queryString = appendOrUpdateToQueryString(search, 'redirect', 'true');

						// Setup redirect params
						const redirectParams = filteredRouteParamMap.reduce((ac, param, idx) => {
							switch (param.type) {
								case 'listing-information': {
									return {
										...ac,
										[param.paramName]: getListingInfo.payload[idx]?.prettyUrlName ? getListingInfo.payload[idx]?.prettyUrlName : getListingInfo.payload[idx]?.conceptId.join(','),
									};
								}
								case 'trial-type': {
									return {
										...ac,
										[param.paramName]: getListingInfo.payload[idx]?.prettyUrlName ? getListingInfo.payload[idx]?.prettyUrlName : getListingInfo.payload[idx]?.idString,
									};
								}
								// We know by this point if any types were invalid, so no need to
								// have a default only to never get code coverage.
							}
						}, {});
						// Check if this is a code-to-pretty URL redirect
						const isCodeToPrettyRedirect = fetchActions.some(action => action.type === 'id');
						const redirectStatus = isCodeToPrettyRedirect ? '301' : '302';
						const redirectPathOnly = redirectPath(redirectParams);
						const redirectUrl = `${redirectPathOnly}${queryString}`;
						console.log(`[CTLViewsHoC ${WrappedView.name} Effect] Redirect check passed. isCodeToPretty: ${isCodeToPrettyRedirect}, Calculated Status: ${redirectStatus}, PathOnly: ${redirectPathOnly}`); // LOG

						// For code-to-pretty redirects, we need to preserve the redirectStatus
						// and set the prerender-header Location to the final URL
						if (isCodeToPrettyRedirect) {
							console.log(`[CTLViewsHoC ${WrappedView.name} Effect] Code-to-pretty redirect needed.`); // LOG
							// Set state to REDIR_STATE with 301 status
							// hocDispatch(setRedirecting('301')); // Dispatching twice below

							// Set state for navigation
							const navigationState = {
								redirectStatus: '301',
								// Don't include query params in prerender Location header
								prerenderLocation: baseHost + redirectPathOnly
							};

							// Set state first
							console.log(`[CTLViewsHoC ${WrappedView.name} Effect] Dispatching setRedirecting('301').`); // LOG Action
							hocDispatch(setRedirecting('301'));

							// Then navigate
							console.log(`[CTLViewsHoC ${WrappedView.name} Effect] Navigating (replace: true) to ${redirectUrl} with state:`, JSON.stringify(navigationState)); // LOG Navigate
							navigate(redirectUrl, {
								replace: true,
								state: navigationState
							});

							// Return early to ensure state is set
							return;
						} else {
							// For other redirects, use the provided status
							console.log(`[CTLViewsHoC ${WrappedView.name} Effect] Other redirect needed. Dispatching setRedirecting('${redirectStatus}').`); // LOG Action
							hocDispatch(setRedirecting(redirectStatus));

							// Set state for navigation
							const navigationState = {
								redirectStatus
							};

							// Navigate with state
							console.log(`[CTLViewsHoC ${WrappedView.name} Effect] Navigating (replace: true) to ${redirectUrl} with state:`, JSON.stringify(navigationState)); // LOG Navigate
							navigate(redirectUrl, {
								replace: true,
								state: navigationState
							});

							// Return early to ensure state is set
							return;
						}
					}
				}

				// At this point, the wrapped view is going to handle this request.
				console.log(`[CTLViewsHoC ${WrappedView.name} Effect] No redirect needed or already redirected. Dispatching setSuccessfulFetch.`); // LOG Action
				hocDispatch(setSuccessfulFetch(currentActionsHash, getListingInfo.payload));
			} else if (!getListingInfo.loading && getListingInfo.error) {
				// Raise error for ErrorBoundary for now.
				console.error(`[CTLViewsHoC ${WrappedView.name} Effect] getListingInfo failed. Dispatching setFailedFetch. Error:`, getListingInfo.error); // LOG + Action
				hocDispatch(setFailedFetch());
			}
			// This effect should only fire if getListingInfo has been updated, even
			// if we get redirected to the same route, the route params will change,
			// the actions will get updated, and that will trigger getListingInfo to
			// update.
			//
			// NOTE: If the route changed and therefore the actions changed, this will
			// fire. So this effect should also handle the hocState going from a
			// previously good fetch with data, back to a loading state.
		}, [getListingInfo]);

		// Effect to clean up the redirect=true query parameter after successful load
		useEffect(() => {
			console.log('[CTLViewsHoC Cleanup Effect] Running. Status:', state.status, 'Search:', search); // LOG
			if (state.status === hocStates.LOADED_STATE && search.includes('redirect=true')) {
				console.log('[CTLViewsHoC Cleanup Effect] Conditions met. Removing redirect=true.'); // LOG
				const newSearch = removeQueryParam(search, 'redirect');
				// Use navigate with object form to preserve existing state
				navigate(
					{
						pathname: location.pathname,
						search: newSearch,
					},
                {
                    replace: true,
                    // state: location.state, // Remove state preservation during cleanup
                }
            );
			}
			// Depend on status and search string to re-run when needed
		}, [state.status, search, location.pathname, navigate, location.state]);

		console.log(`[CTLViewsHoC ${WrappedView.name}] Rendering. HoC State:`, state, 'Passing lastHoCRedirectStatus:', state.lastHoCRedirectStatus); // LOG

		return (
			<div>
				<div className="page-options-container" />
				{(() => {
					const isLoading = getListingInfo.loading || state.status === hocStates.REDIR_STATE || state.status === hocStates.LOADING_STATE || (state.status === hocStates.LOADED_STATE && state.actionsHash !== currentActionsHash);

					// First check for 404 regardless of component type
					if (state.status === hocStates.NOTFOUND_STATE) {
						return <PageNotFound />;
					}

					// Handle loading state for all components
					if (isLoading) {
						return <Spinner />;
					}

					// Handle 404 state
					if (state.status === hocStates.NOTFOUND_STATE) {
						return <PageNotFound />;
					}

					// Handle error state
					if (state.status === hocStates.ERROR_STATE) {
						return <ErrorPage />;
					}

					// Render the wrapped component only when data is loaded
					if (state.status === hocStates.LOADED_STATE) {
						return <WrappedView
							routeParamMap={filteredRouteParamMap}
							routePath={redirectPath}
							{...props}
							data={state.listingData}
							isInitialLoading={isLoading} // This will be false here
							state={state}
							// Pass down the status of the last HoC redirect
							lastHoCRedirectStatus={state.lastHoCRedirectStatus}
							// Pass redirect status and prerender location for NoTrials view
							redirectStatus={initialLocationState.redirectStatus}
							prerenderLocation={initialLocationState.prerenderLocation}
						/>;
					}

					// Fallback for unexpected states (should not be reached)
					return null;
				})()}
			</div>
		);
	};

	WithPreFetch.propTypes = {
		children: PropTypes.node,
		redirectPath: PropTypes.func.isRequired,
		routeParamMap: PropTypes.arrayOf(
			PropTypes.shape({
				paramName: PropTypes.string,
				textReplacementKey: PropTypes.string,
				type: PropTypes.oneOf(['listing-information', 'trial-type']),
			})
		).isRequired,
	};

	return WithPreFetch;
};

export default CTLViewsHoC;
