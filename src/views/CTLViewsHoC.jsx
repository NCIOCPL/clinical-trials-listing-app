import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import { Spinner } from '../components';
import { ErrorPage, PageNotFound } from './ErrorBoundary';
import { useAppPaths, useListingSupport } from '../hooks';

import { appendOrUpdateToQueryString, getIdOrNameAction } from '../utils';

// Let's use some constands for our state var so we can handle
// loading, loaded, 404 and error, without resorting to a reducer.
const LOADING_STATE = 'loading_state';
const LOADED_STATE = 'loaded_state';
const NOTFOUND_STATE = 'notfound_state';
const ERROR_STATE = 'error_state';
const REDIR_STATE = 'redir_state';

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

		const [loadingState, setloadingState] = useState(LOADING_STATE);
		// First thing we need to do is figure out what we are fetching.
		// The route will be the notrials route.
		const isNoTrials = location.pathname === NoTrialsPath();

		// Setup the actions for the fetch.
		if (!routeParamMap) {
			throw new Error(
				`You must supply a routeParamMap to your CTLViewsHoC wrapped component.`
			);
		}
		const fetchActions = routeParamMap.map((param, idx) => {
			switch (param.type) {
				case 'listing-information': {
					return getIdOrNameAction(
						isNoTrials,
						params[param.paramName],
						idx + 1,
						search
					);
				}
				default:
					throw new Error(`${param.type} route param type is unknown.`);
			}
		});
		// Initiate the fetch here. This will be called no matter what, we will rely
		// on useListingSupport to handle any caching.
		const getListingInfo = useListingSupport(fetchActions);

		// Next we need to determine what the current route state is:
		// - are we loading fresh c-code or pretty url request
		// - are we handling c-code -> pretty url redirect
		// - are we handling 0 trial c-code or purl -> no trials
		// - are we handling a fresh notrials request.

		// The purpose of this useEffect is to handle the load for the
		// trial listing support API lookups.
		useEffect(() => {
			if (!getListingInfo.loading && getListingInfo.payload) {
				// Check if any of the elements of the payload are null,
				// this is a 404.
				if (getListingInfo.payload.some((res) => res === null)) {
					// Handle 404. Currently this is a bit hacky, but
					// we will just throw here for the ErrorBoundary.
					setloadingState(NOTFOUND_STATE);
					return;
				}

				// Now we need to check if we must redirect. This would be if
				// any of the requests did not match the redirect. We only
				// handle redirects if we are not showing /notrials, for
				// sanity.
				if (!isNoTrials) {
					const redirectCheck = fetchActions.some(
						(action, idx) =>
							action.type === 'id' && getListingInfo.payload[idx].prettyUrlName
					);

					if (redirectCheck) {
						const queryString = appendOrUpdateToQueryString(
							search,
							'redirect',
							'true'
						);

						// Setup redirect params
						const redirectParams = routeParamMap.reduce((ac, param, idx) => {
							switch (param.type) {
								case 'listing-information': {
									return {
										...ac,
										[param.paramName]: getListingInfo.payload[idx].prettyUrlName
											? getListingInfo.payload[idx].prettyUrlName
											: getListingInfo.payload[idx].conceptId.join(','),
									};
								}
								// We know by this point if any types were invalid, so no need to
								// have a default only to never get code coverage.
							}
						}, {});

						// Navigate to the passed in redirectPath. This is really cause
						// we can't easily figure out the current route from react-router.
						navigate(`${redirectPath(redirectParams)}${queryString}`, {
							replace: true,
							state: {
								redirectStatus: '301',
							},
						});
						setloadingState(REDIR_STATE);
						return;
					}
				}

				// At this point, the wrapped view is going to handle this request.
				setloadingState(LOADED_STATE);
			} else if (!getListingInfo.loading && getListingInfo.error) {
				// Raise error for ErrorBoundary for now.
				setloadingState(ERROR_STATE);
			}
			// The page should change its states when either the listing info changes
			// or the fetchActions change.
		}, [getListingInfo, fetchActions]);

		return (
			<div>
				{(() => {
					switch (loadingState) {
						case NOTFOUND_STATE:
							return <PageNotFound />;
						case ERROR_STATE:
							return <ErrorPage />;
						case LOADED_STATE:
							if (isNoTrials) {
								return (
									<WrappedView
										routeParamMap={routeParamMap}
										{...props}
										data={getListingInfo.payload}
									/>
								);
							} else {
								return <WrappedView {...props} data={getListingInfo.payload} />;
							}
						default:
							return <Spinner />;
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
