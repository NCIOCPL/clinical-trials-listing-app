import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router';
import track, { useTracking } from 'react-tracking';

import { NoResults, Pager, ResultsList, ScrollRestoration, Spinner } from '../../components';
import ErrorPage from '../ErrorBoundary/ErrorPage';
import { useAppPaths, useCtsApi } from '../../hooks';
import { getClinicalTrials } from '../../services/api/actions';
import { useStateValue } from '../../store/store';
import { appendOrUpdateToQueryString, getKeyValueFromQueryString, getPageOffset } from '../../utils';

const Manual = () => {
	const { BasePath } = useAppPaths();
	const location = useLocation();
	const navigate = useNavigate();
	const { search } = location;
	const tracking = useTracking();
	const [{ detailedViewPagePrettyUrlFormatter, pageTitle, requestFilters, siteName, introText, language, canonicalHost, trialListingPageType, baseHost, metaDescription, itemsPerPage, noTrialsHtml }] = useStateValue();

	const pn = getKeyValueFromQueryString('pn', search.toLowerCase());
	const pagerDefaults = {
		offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
		page: pn ?? 1,
		pageUnit: itemsPerPage,
	};
	const [pager, setPager] = useState(pagerDefaults);
	const requestQuery = getClinicalTrials({
		from: pager.offset,
		requestFilters,
		size: pager.pageUnit,
	});

	// Kick off the CTS Api Fetch
	const fetchState = useCtsApi(requestQuery);

	useEffect(() => {
		// Fire off a page load event once payload is returned.
		if (!fetchState.loading && fetchState.payload) {
			tracking.trackEvent({
				// These properties are required.
				type: 'PageLoad',
				event: 'TrialListingApp:Load:Results',
				name: canonicalHost.replace(/^(http|https):\/\//, '') + window.location.pathname,
				title: pageTitle,
				language: language === 'en' ? 'english' : 'spanish',
				metaTitle: `${pageTitle} - ${siteName}`,
				// Any additional properties fall into the "page.additionalDetails" bucket
				// for the event.
				numberResults: fetchState.payload?.total,
				trialListingPageType: `${trialListingPageType.toLowerCase()} parameters`,
			});
		}
	}, [fetchState]);

	useEffect(() => {
		if (pn !== pager.page.toString()) {
			setPager({
				...pager,
				offset: pn ? getPageOffset(pn, itemsPerPage) : 0,
				page: typeof pn === 'string' ? pn : 1,
			});
		}
	}, [pn]);

	const onPageNavigationChangeHandler = (pagination) => {
		setPager(pagination);
		const { page } = pagination;
		const qryStr = appendOrUpdateToQueryString(search, 'pn', page);
		navigate(`${BasePath()}${qryStr}`);
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

	// It is assumed this function will be called only if there are
	// trials.
	const renderPagerSection = (placement) => {
		const page = pn ?? 1;
		const pagerOffset = getPageOffset(page, itemsPerPage);
		return (
			<>
				<div className="ctla-results__summary grid-container">
					<div className="grid-row">
						{placement === 'top' && (
							<div className="ctla-results__count grid-col-1">
								{`
								Trials ${pagerOffset + 1}-${Math.min(pagerOffset + itemsPerPage, fetchState.payload.total)} of
								${fetchState.payload.total}
							`}
							</div>
						)}
						{fetchState.payload.total > itemsPerPage && (
							<div className="ctla-results__pager grid-col-2">
								<Pager current={Number(pager.page)} onPageNavigationChange={onPageNavigationChangeHandler} resultsPerPage={pager.pageUnit} totalResults={fetchState.payload.total} />
							</div>
						)}
					</div>
				</div>
			</>
		);
	};

	const ResultsListWithPage = track({
		currentPage: Number(pager.page),
	})(ResultsList);
	return (
		<div className="grid-container">
			<div className="grid-row">
				<div className="grid-col">
					{renderHelmet()}
					<h1>{pageTitle}</h1>
					<div className="page-options-container" />
					{(() => {
						if (fetchState.loading) {
							return <Spinner />;
						} else if (!fetchState.loading && fetchState.payload) {
							if (fetchState.payload.total > 0) {
								return (
									<>
										{/* ::: Intro Text ::: */}
										{introText.length > 0 && (
											<div className="ctla-results__intro grid-container">
												<div className="grid-row">
													<div
														className="grid-col"
														dangerouslySetInnerHTML={{
															__html: introText,
														}}></div>
												</div>
											</div>
										)}

										{/* ::: Top Paging Section ::: */}
										{renderPagerSection('top')}

										<ScrollRestoration />
										<ResultsListWithPage results={fetchState.payload.data} resultsItemTitleLink={detailedViewPagePrettyUrlFormatter} />
										{/* ::: Bottom Paging Section ::: */}
										{renderPagerSection('bottom')}
									</>
								);
							} else {
								return <NoResults />;
							}
						}
						if (!fetchState.loading && fetchState.error != null && fetchState.error.message === 'Trial count mismatch from the API') {
							return (
								<>
									<div
										className="No_Trials_Found"
										dangerouslySetInnerHTML={{
											__html: noTrialsHtml,
										}}></div>
								</>
							);
						} else {
							return <ErrorPage />;
						}
					})()}
				</div>
			</div>
		</div>
	);
};

export default Manual;
