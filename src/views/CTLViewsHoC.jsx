import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Spinner } from '../components';
import { queryParamType } from '../constants';
import { useCustomQuery } from '../hooks';
import { matchQueryParam } from '../utils';
import {
	getListingInformationById,
	getListingInformationByName,
} from '../services/api/actions';

const CTLViewsHoC = (WrappedView) => {
	const WithPreFetch = (props) => {
		const { codeOrPurl } = useParams();
		const [shouldFetchListingInfo, setShouldFetchListingInfo] = useState(false);
		const [stateListingInfo, setStateListingInfo] = useState(null);
		const [doneLoading, setDoneLoading] = useState(false);
		const [paramType, setParamType] = useState(queryParamType.code);
		const [queryParam, setQueryParam] = useState();

		const getFetchByIdOrName =
			paramType === 'code'
				? getListingInformationById
				: getListingInformationByName;
		const getListingInfo = useCustomQuery(
			getFetchByIdOrName({ queryParam }),
			shouldFetchListingInfo
		);

		useEffect(() => {
			setFetchByIdOrName();
			setShouldFetchListingInfo(true);
		}, [codeOrPurl]);

		useEffect(() => {
			if (!getListingInfo.loading && getListingInfo.payload) {
				setStateListingInfo(getListingInfo.payload);
			}
		}, [getListingInfo.loading, getListingInfo.payload]);

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
