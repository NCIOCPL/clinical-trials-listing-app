import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import { Spinner } from '../components';
import { queryParamType } from '../constants';
import { useAppPaths, useListingSupport } from '../hooks';

import {
	appendOrUpdateToQueryString,
	getKeyValueFromQueryString,
	matchQueryParam,
	getIdOrNameAction,
} from '../utils';

/**
 * Higher order component for fetching disease information from the trial listing support API.
 *
 * @param {*} WrappedView This should either be a results view, or the notrials view.
 */
const CTLViewsHoC = (WrappedView) => {
	const WithPreFetch = (props) => {
		const { CodeOrPurlPath } = useAppPaths();
		const { codeOrPurl } = useParams();
		const location = useLocation();
		const navigate = useNavigate();
		const { search } = location;

		const [showNoTrialsFound, setShowNoTrialsFound] = useState(false);
		const [prerenderStatusCode, setPrerenderStatusCode] = useState(null);
		const [shouldFetchListingInfo, setShouldFetchListingInfo] = useState(false);
		const [stateListingInfo, setStateListingInfo] = useState(null);
		const [doneLoading, setDoneLoading] = useState(false);
		const [hasBeenRedirected, setHasBeenRedirected] = useState(false);
		const [paramType, setParamType] = useState(queryParamType.code);
		const [queryParam, setQueryParam] = useState();

		// First thing we need to do is figure out what we are fetching.
		// Parameters for notrials route come from the query parameters.
		const isNoTrials = codeOrPurl.startsWith('notrials');

		const fetchActions = [getIdOrNameAction(isNoTrials, codeOrPurl, 1, search)];

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
					throw new Error('404');
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

						// This should move us away from this route, which should
						// then be re-evaluated.
						navigate(
							`${CodeOrPurlPath({
								codeOrPurl: getListingInfo.payload[0].prettyUrlName,
							})}${queryString}`,
							{
								replace: true,
								state: {
									redirectStatus: '301',
								},
							}
						);
					}
				}

				// At this point, the wrapped view is going to handle this request.
				// so we just need to figure out some things relating to status and
				// metadata.

				// This sets the data that our views will need.
				setStateListingInfo(getListingInfo.payload);
			} else if (!getListingInfo.loading && getListingInfo.error) {
				// Raise error for ErrorBoundary for now.
				throw getListingInfo.error;
			}
		}, [getListingInfo]);

		// The purpose of this useEffect is to: handle no trials?
		useEffect(() => {
			if (isNoTrials) {
				if (
					location.state?.isNoTrialsRedirect &&
					location.state?.listingInfo &&
					location.state?.redirectStatus
				) {
					setShowNoTrialsFound(true);
					setPrerenderStatusCode(location.state.redirectStatus);
					setStateListingInfo(location.state.listingInfo);
				} else {
					setShowNoTrialsFound(true);
					setPrerenderStatusCode('404');

					const p1 = getKeyValueFromQueryString('p1', search);
					setFetchByIdOrName(p1);
					setShouldFetchListingInfo(true);
				}
			} else if (!isNoTrials) {
				if (location.state?.redirectStatus) {
					setPrerenderStatusCode(location.state.redirectStatus);
				}

				setFetchByIdOrName(codeOrPurl);
				setShouldFetchListingInfo(true);
			}
		}, [codeOrPurl]);

		// The purpose of this useEffect is to determine that the fetching and
		//
		useEffect(() => {
			if (stateListingInfo !== null) {
				setDoneLoading(true);
			}
		}, [stateListingInfo]);

		const setFetchByIdOrName = (param) => {
			const fetchParam = matchQueryParam(param);
			setParamType(fetchParam.paramType);
			setQueryParam(fetchParam.queryParam);
		};

		return (
			<div>
				{(() => {
					if (!doneLoading) {
						return <Spinner />;
					} else {
						return (
							<WrappedView
								{...props}
								data={stateListingInfo}
								status={prerenderStatusCode}
								prerenderLocation={location.state?.prerenderLocation}
							/>
						);
					}
				})()}
			</div>
		);
	};
	return WithPreFetch;
};

CTLViewsHoC.propTypes = {
	children: PropTypes.node,
};

export default CTLViewsHoC;
