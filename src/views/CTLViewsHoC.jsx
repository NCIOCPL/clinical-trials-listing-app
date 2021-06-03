import PropTypes from 'prop-types';
import React, { useEffect, useReducer } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import { Spinner } from '../components';
import { ErrorPage, PageNotFound } from './ErrorBoundary';
import { useAppPaths, useListingSupport } from '../hooks';
import { getTrialType } from '../services/api/actions';
import {
	appendOrUpdateToQueryString,
	getIdOrNameAction,
	getKeyValueFromQueryString,
	convertObjectToBase64,
} from '../utils';
import {
	hocReducer,
	hocStates,
	setLoading,
	setSuccessfulFetch,
	setFailedFetch,
	setNotFound,
	setRedirecting,
} from './hocReducer';

/**
 * Higher order component for fetching disease information from the trial listing support API.
 *
 * @param {*} WrappedView This should either be a results view, or the notrials view.
 */
const CTLViewsHoC = (WrappedView) => {
	const WithPreFetch = ({ redirectPath, routeParamMap, ...props }) => {
		const { NoTrialsPath } = useAppPaths();
		const params = useParams();
		const location = useLocation();
		const navigate = useNavigate();
		const { search } = location;

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
			throw new Error(
				`You must supply a routeParamMap to your CTLViewsHoC wrapped component.`
			);
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
		const filteredRouteParamMap = isNoTrials
			? routeParamMap.filter((param, idx) => search.includes(`p${idx + 1}=`))
			: routeParamMap.filter((param) => params[param.paramName]);

		// Collate provided fetch actions and filter out actions with no payloads
		const fetchActions = filteredRouteParamMap.map((param, idx) => {
			switch (param.type) {
				case 'listing-information': {
					return getIdOrNameAction(
						isNoTrials,
						params[param.paramName],
						idx + 1,
						search
					);
				}
				case 'trial-type': {
					return getTrialType({
						trialType: !isNoTrials
							? params[param.paramName]
							: getKeyValueFromQueryString(`p${idx + 1}`, search),
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
				hocDispatch(setLoading());
			}

			if (!getListingInfo.loading && getListingInfo.payload) {
				// Check if any of the elements of the payload are null,
				// this is a 404.
				if (getListingInfo.payload.some((res) => res === null)) {
					// Handle 404. Currently this is a bit hacky, but
					// we will just throw here for the ErrorBoundary.
					hocDispatch(setNotFound());
					return;
				}

				// Now we need to check if we must redirect. This would be if
				// any of the requests did not match the redirect. We only
				// handle redirects if we are not showing /notrials, for
				// sanity.
				if (!isNoTrials) {
					const redirectCheck = fetchActions.some(
						(action, idx) =>
							(action.type === 'id' &&
								getListingInfo.payload[idx].prettyUrlName) ||
							(action.type === 'trialType' &&
								action.payload !== getListingInfo.payload[idx].prettyUrlName)
					);

					if (redirectCheck) {
						const queryString = appendOrUpdateToQueryString(
							search,
							'redirect',
							'true'
						);

						// Setup redirect params
						const redirectParams = filteredRouteParamMap.reduce(
							(ac, param, idx) => {
								switch (param.type) {
									case 'listing-information': {
										return {
											...ac,
											[param.paramName]: getListingInfo.payload[idx]
												?.prettyUrlName
												? getListingInfo.payload[idx]?.prettyUrlName
												: getListingInfo.payload[idx]?.conceptId.join(','),
										};
									}
									case 'trial-type': {
										return {
											...ac,
											[param.paramName]: getListingInfo.payload[idx]
												?.prettyUrlName
												? getListingInfo.payload[idx]?.prettyUrlName
												: getListingInfo.payload[idx]?.idString,
										};
									}
									// We know by this point if any types were invalid, so no need to
									// have a default only to never get code coverage.
								}
							},
							{}
						);
						// Let's set the state BEFORE we navigate
						hocDispatch(setRedirecting());

						// Navigate to the passed in redirectPath. This is really cause
						// we can't easily figure out the current route from react-router.
						navigate(`${redirectPath(redirectParams)}${queryString}`, {
							replace: true,
							state: {
								redirectStatus: '301',
							},
						});
						return;
					}
				}

				// At this point, the wrapped view is going to handle this request.
				hocDispatch(
					setSuccessfulFetch(currentActionsHash, getListingInfo.payload)
				);
			} else if (!getListingInfo.loading && getListingInfo.error) {
				// Raise error for ErrorBoundary for now.
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

		return (
			<div>
				<div className="page-options-container" />
				{(() => {
					// Show loading.
					if (
						getListingInfo.loading ||
						state.status === hocStates.REDIR_STATE ||
						state.status === hocStates.LOADING_STATE ||
						(state.status === hocStates.LOADED_STATE &&
							state.actionsHash !== currentActionsHash)
					) {
						return <Spinner />;
					} else {
						// We have finished loading and either need to display
						// 404, error or the results.
						switch (state.status) {
							case hocStates.NOTFOUND_STATE: {
								return <PageNotFound />;
							}
							case hocStates.LOADED_STATE: {
								if (isNoTrials) {
									return (
										<WrappedView
											routeParamMap={filteredRouteParamMap}
											{...props}
											data={state.listingData}
										/>
									);
								} else {
									return (
										<WrappedView
											routeParamMap={filteredRouteParamMap}
											routePath={redirectPath}
											{...props}
											data={state.listingData}
										/>
									);
								}
							}
							default: {
								// This should only happen for hocStates.ERROR_STATE, but it
								// felt very wrong for there not to be a default here.
								return <ErrorPage />;
							}
						}
					}
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
