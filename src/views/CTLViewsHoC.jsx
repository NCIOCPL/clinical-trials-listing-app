import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import { Spinner } from '../components';
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
			setFetchByIdOrName();
			setShouldFetchListingInfo(true);
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
				if (prettyUrlName) {
					setHasBeenRedirected(true);
					const queryString = appendOrUpdateToQueryString(
						search,
						'redirect',
						'true'
					);
					navigate(
						`${CodeOrPurlPath({ codeOrPurl: prettyUrlName })}${queryString}`
					);
				}
			}
		}, [getListingInfo.loading, getListingInfo.payload, hasBeenRedirected]);

		useEffect(() => {
			if (stateListingInfo !== null) {
				setDoneLoading(true);
			}
		}, [stateListingInfo]);

		const setFetchByIdOrName = () => {
			const fetchParam = matchQueryParam(codeOrPurl);
			setParamType(fetchParam.paramType);
			setQueryParam(fetchParam.queryParam);
		};

		return (
			<div>
				{(() => {
					if (!doneLoading) {
						return <Spinner />;
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
