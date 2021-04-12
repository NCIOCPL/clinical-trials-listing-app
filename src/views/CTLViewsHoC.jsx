import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import { Spinner } from '../components';
import NoTrialsFound from './NoTrialsFound';
import { queryParamType } from '../constants';
import { useAppPaths, useCustomQuery } from '../hooks';

import {
	appendOrUpdateToQueryString,
	getKeyValueFromQueryString,
	matchQueryParam,
} from '../utils';

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

		const [showNoTrialsFound, setShowNoTrialsFound] = useState(false);
		const [prerenderStatusCode, setPrerenderStatusCode] = useState(null);
		const [shouldFetchListingInfo, setShouldFetchListingInfo] = useState(false);
		const [stateListingInfo, setStateListingInfo] = useState(null);
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
								data={stateListingInfo}
								status={prerenderStatusCode}
								prerenderLocation={location.state?.prerenderLocation}
							/>
						);
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
