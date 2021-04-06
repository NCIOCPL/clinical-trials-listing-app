import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router';
import { useTracking } from 'react-tracking';

import { NoResults, Pager, ResultsList, Spinner } from '../../components';
import { useAppPaths, useCustomQuery } from '../../hooks';
import { getClinicalTrials } from '../../services/api/actions';
import { useStateValue } from '../../store/store';
import {
	appendOrUpdateToQueryString,
	getKeyValueFromQueryString,
	getPageOffset,
} from '../../utils';

const Manual = () => {
	const { BasePath } = useAppPaths();
	const location = useLocation();
	const navigate = useNavigate();
	const { search } = location;
	const tracking = useTracking();
	const [trialsPayload, setTrialsPayload] = useState(null);
	const [
		{
			detailedViewPagePrettyUrlFormatter,
			pageTitle,
			requestFilters,
			siteName,
			introText,
			language,
			canonicalHost,
			trialListingPageType,
			baseHost,
			metaDescription,
			itemsPerPage,
		},
	] = useStateValue();

	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const pagerDefaults = {
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	};
	const [pager, setPager] = useState(pagerDefaults);

	const queryResponse = useCustomQuery(
		getClinicalTrials({
			from: pager.offset,
			requestFilters,
			size: pager.pageUnit,
		})
	);

	useEffect(() => {
		if (!queryResponse.loading && queryResponse.payload) {
			setTrialsPayload(queryResponse.payload);
		}
	}, [queryResponse.loading, queryResponse.payload]);

	useEffect(() => {
		// Fire off a page load event. Usually this would be in
		// some effect when something loaded.
		if (trialsPayload) {
			tracking.trackEvent({
				// These properties are required.
				type: 'PageLoad',
				event: 'TrialListingApp:Load:Results',
				name: canonicalHost.replace('https://', '') + window.location.pathname,
				title: pageTitle,
				language: language === 'en' ? 'english' : 'spanish',
				metaTitle: `${pageTitle} - ${siteName}`,
				// Any additional properties fall into the "page.additionalDetails" bucket
				// for the event.
				numberResults: queryResponse.payload?.total,
				trialListingPageType: `${trialListingPageType.toLowerCase()} parameters`,
			});
		}
	}, [trialsPayload]);

	const onPageNavigationChangeHandler = (pagination) => {
		setPager(pagination);
		const { page } = pagination;
		const qryStr = appendOrUpdateToQueryString(search, 'pn', page);
		navigate(`${BasePath()}${qryStr}`, { replace: true });
	};

	const renderHelmet = () => {
		return (
			<Helmet>
				<title>{`${pageTitle} - ${siteName}`}</title>
				<meta property="og:title" content={`${pageTitle}`} />
				<meta property="og:url" content={baseHost + window.location.pathname} />
				<meta name="description" content={metaDescription} />
				<meta property="og:description" content={metaDescription} />
				<link rel="canonical" href={canonicalHost + window.location.pathname} />
			</Helmet>
		);
	};

	const renderPagerSection = (placement) => {
		const page = pn ?? 1;
		const pagerOffset = getPageOffset(page, itemsPerPage);
		return (
			<>
				{trialsPayload?.trials?.length > 0 && (
					<div className="paging-section">
						{placement === 'top' && (
							<div className="paging-section__page-info">
								{`
								Trials ${pagerOffset + 1}-${Math.min(
									pagerOffset + itemsPerPage,
									trialsPayload.total
								)} of
								${trialsPayload.total}
							`}
							</div>
						)}
						<div className="paging-section__pager">
							<Pager
								current={Number(pager.page)}
								onPageNavigationChange={onPageNavigationChangeHandler}
								resultsPerPage={pager.pageUnit}
								totalResults={trialsPayload?.total ?? 0}
							/>
						</div>
					</div>
				)}
			</>
		);
	};

	return (
		<div>
			{renderHelmet()}
			<h1>{pageTitle}</h1>

			{/* ::: Intro Text ::: */}
			{introText.length > 0 && trialsPayload?.trials?.length > 0 && (
				<div
					className="intro-text"
					dangerouslySetInnerHTML={{ __html: introText }}
				/>
			)}

			{/* ::: Top Paging Section ::: */}
			{renderPagerSection('top')}
			<hr />
			{(() => {
				if (queryResponse.loading) {
					return <Spinner />;
				} else if (!queryResponse.loading && trialsPayload?.trials?.length) {
					return (
						<ResultsList
							results={trialsPayload.trials}
							resultsItemTitleLink={detailedViewPagePrettyUrlFormatter}
						/>
					);
				} else {
					return <NoResults />;
				}
			})()}
			<hr />
			{/* ::: Bottom Paging Section ::: */}
			{renderPagerSection('bottom')}
		</div>
	);
};

export default Manual;
