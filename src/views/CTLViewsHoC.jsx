import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import { Spinner } from '../components';
import { PageNotFound } from './ErrorBoundary';
import NoTrialsFound from './NoTrialsFound';
import { queryParamType } from '../constants';
import { useAppPaths, useCustomQuery } from '../hooks';
import { appendOrUpdateToQueryString, matchQueryParam } from '../utils';
import {
	getListingInformationById,
	getListingInformationByName,
} from '../services/api/actions';

const CTLViewsHoC = (WrappedView) => {
	const WithPreFetch = (props) => {
		const { CodeOrPurlPath } = useAppPaths();
		const { codeOrPurl } = useParams();
		const location = useLocation();
		const navigate = useNavigate();
		const { search } = location;
		const isNoTrials = codeOrPurl.startsWith('notrials');
		const hasTrialsRedirectState = isNoTrials && location.state;
		const [showNoTrialsFound, setShowNoTrialsFound] = useState(false);
		const [shouldFetchListingInfo, setShouldFetchListingInfo] = useState(false);
		const [stateListingInfo, setStateListingInfo] = useState(null);
		const [showPageNotFound, setShowPageNotFound] = useState(false);
		const [doneLoading, setDoneLoading] = useState(false);
		const [hasBeenRedirected, setHasBeenRedirected] = useState(false);
		const [paramType, setParamType] = useState(queryParamType.code);
		const [queryParam, setQueryParam] = useState();

		const getFetchByIdOrName =
			paramType === 'code'
				? getListingInformationById
				: getListingInformationByName;
		const getListingInfo = useCustomQuery(
			getFetchByIdOrName({ queryParam }),
			shouldFetchListingInfo && !hasBeenRedirected
		);
		useEffect(() => {
			if (isNoTrials && !hasTrialsRedirectState) {
				setShowPageNotFound(true);
			}
		}, []);

		useEffect(() => {
			if (
				hasTrialsRedirectState &&
				location.state?.wasRedirected &&
				location.state?.listingInfo
			) {
				setShowNoTrialsFound(true);
				setStateListingInfo(location.state.listingInfo);
			} else if (!isNoTrials) {
				setFetchByIdOrName(codeOrPurl);
				setShouldFetchListingInfo(true);
			}
		}, [codeOrPurl]);

		useEffect(() => {
			if (
				!getListingInfo.loading &&
				getListingInfo.payload &&
				!hasBeenRedirected
			) {
				const { prettyUrlName } = getListingInfo.payload;

				setStateListingInfo(getListingInfo.payload);

				// Redirect to pretty url if one exists for listing info
				if (prettyUrlName && paramType === 'code') {
					setHasBeenRedirected(true);
					const queryString = appendOrUpdateToQueryString(
						search,
						'redirect',
						'true'
					);
					navigate(
						`${CodeOrPurlPath({ codeOrPurl: prettyUrlName })}${queryString}`,
						{ replace: true }
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
					if (showPageNotFound) {
						return <PageNotFound />;
					} else if (!doneLoading) {
						return <Spinner />;
					} else if (doneLoading && showNoTrialsFound) {
						return <NoTrialsFound data={stateListingInfo} />;
					} else {
						return <WrappedView {...props} data={stateListingInfo} />;
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
