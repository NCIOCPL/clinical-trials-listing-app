import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import { Spinner } from '../components';
import NoTrialsFound from './NoTrialsFound';
import { queryParamType } from '../constants';
import { useAppPaths, fetchAllTheThings } from '../hooks';

import {
	appendOrUpdateToQueryString,
	getKeyValueFromQueryString,
	matchQueryParam,
} from '../utils';

// import {
// 	getListingInformationById,
// 	getListingInformationByName,
// } from '../services/api/actions';

const CTLViewsHoC = (WrappedView) => {
	const WithPreFetch = (props) => {
		const { CodeOrPurlPath } = useAppPaths();
		const { codeOrPurl } = useParams();
		const location = useLocation();
		const navigate = useNavigate();
		const { search } = location;
		const isNoTrials = codeOrPurl.startsWith('notrials');
		const listingPattern = WrappedView?.name;

		const [showNoTrialsFound, setShowNoTrialsFound] = useState(false);
		const [prerenderStatusCode, setPrerenderStatusCode] = useState(null);
		//const [shouldFetchListingInfo, setShouldFetchListingInfo] = useState(false);
		const [stateListingInfo, setStateListingInfo] = useState(null);
		const [doneLoading, setDoneLoading] = useState(false);
		const [hasBeenRedirected, setHasBeenRedirected] = useState(false);
		const [paramType, setParamType] = useState(queryParamType.code);
		const [queryParam, setQueryParam] = useState();

		const getFetchByIdOrName =
			paramType === queryParamType.code
				? 'getListingInformationById'
				: 'getListingInformationByName';

		const paramToFetch = {
			fetchName: getFetchByIdOrName,
			fetchParams: queryParam,
		};

		// const getListingInfo = useCustomQuery(
		// 	getFetchByIdOrName({ queryParam }),
		// 	shouldFetchListingInfo && !hasBeenRedirected
		// );
		const getListingInfo = fetchAllTheThings(paramToFetch);

		useEffect(() => {
			// If our current route is '/notrials', we have different logic
			// for handling the No Trials Found page.
			if (isNoTrials) {
				// If we have the listing information in the state,
				// we have been redirected here.
				if (
					location.state?.isNoTrialsRedirect &&
					location.state?.listingInfo &&
					location.state?.redirectStatus
				) {
					setShowNoTrialsFound(true);
					setPrerenderStatusCode(location.state.redirectStatus);
					setStateListingInfo(location.state.listingInfo);
				} else {
					// We have come directly to '/notrials' and we need to look
					// up the listing information for the given param.
					setShowNoTrialsFound(true);
					setPrerenderStatusCode('404');

					const p1 = getKeyValueFromQueryString('p1', search);
					setFetchByIdOrName(p1);
					//setShouldFetchListingInfo(true);
				}
			} else if (!isNoTrials) {
				// If we are a code or pretty URL name, do the lookup to handle
				// the Disease page.

				// If we've been redirected to a pretty URL, set this status code.
				// This turns on the prerender status stuff for Helmet
				if (location.state?.redirectStatus) {
					setPrerenderStatusCode(location.state.redirectStatus);
				}

				setFetchByIdOrName(codeOrPurl);
				//setShouldFetchListingInfo(true);
			}
		}, [codeOrPurl]);

		useEffect(() => {
			if (
				!getListingInfo.loading &&
				getListingInfo.payload[0] &&
				!hasBeenRedirected
			) {
				const { prettyUrlName } = getListingInfo.payload[0];

				setStateListingInfo(getListingInfo.payload[0]);

				// Redirect to pretty url if one exists for listing info
				if (prettyUrlName && paramType === 'code' && !isNoTrials) {
					setHasBeenRedirected(true);

					const queryString = appendOrUpdateToQueryString(
						search,
						'redirect',
						'true'
					);
					navigate(
						`${CodeOrPurlPath({ codeOrPurl: prettyUrlName })}${queryString}`,
						{
							replace: true,
							state: {
								redirectStatus: '301',
							},
						}
					);
				}
			}
		}, [getListingInfo.loading, getListingInfo.payload, hasBeenRedirected]);

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
					} else if (showNoTrialsFound && prerenderStatusCode && doneLoading) {
						return (
							<NoTrialsFound
								listingPattern={listingPattern}
								data={stateListingInfo}
								status={prerenderStatusCode}
								prerenderLocation={location.state?.prerenderLocation}
							/>
						);
					} else {
						return (
							<WrappedView
								{...props}
								data={stateListingInfo}
								status={prerenderStatusCode}
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
