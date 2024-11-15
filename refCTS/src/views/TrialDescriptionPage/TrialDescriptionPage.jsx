import queryString from 'query-string';
import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTracking } from 'react-tracking';
import { START_OVER_LINK } from '../../constants';

import {
	Accordion,
	AccordionItem,
	Delighter,
	TrialStatusIndicator,
	SearchCriteriaTableUpdated,
} from '../../components/atomic';
import { useCtsApi } from '../../hooks/ctsApiSupport';
import { getClinicalTrialDescriptionAction } from '../../services/api/actions';
import SitesList from './SitesList';

import './TrialDescriptionPage.scss';
import { useAppSettings } from '../../store/store.js';
import { useAppPaths } from '../../hooks/routing';
import {
	filterSitesByActiveRecruitment,
	hasSCOBeenUpdated,
	queryStringToSearchCriteria,
	runQueryFetchers,
} from '../../utilities';
import { useErrorBoundary } from 'react-error-boundary';
import InvalidCriteriaPage from '../InvalidCriteriaPage';
import { NotFoundError, ApiServerError } from '../ErrorBoundary/NCIError';

const TrialDescriptionPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const qs = queryString.extract(location.search);
	const parsed = queryString.parse(qs);
	const currId = parsed.id;

	// Note: Location state only exists if navigating.
	// If the trial description is directly navigated to this will be empty
	// on first render
	const trialTitle = location.state ? location.state.result.brief_title : '';
	const tracking = useTracking();
	const initialState = {
		localErrors: false,
		fetchActions: [],
		isTrialLoading: true,
		searchCriteriaObject: null,
		trialDescription: null,
	};

	const [localState, ls_dispatch] = useReducer(stateReducer, initialState);

	const {
		fetchActions,
		isTrialLoading,
		searchCriteriaObject,
		trialDescription,
		localErrors,
	} = localState;

	const { showBoundary } = useErrorBoundary();
	const { error: apiError, loading, payload } = useCtsApi(fetchActions);

	const { BasicSearchPagePath, AdvancedSearchPagePath } = useAppPaths();

	const [
		{
			analyticsName,
			canonicalHost,
			siteName,
			whichTrialsUrl,
			zipConversionEndpoint,
			apiClients: { clinicalTrialsSearchClientV2 },
		},
	] = useAppSettings();
	// enum for empty location checks
	const noLocInfo = ['not yet active', 'in review', 'approved'];

	const setFetchActions = (fetchAction) => {
		ls_dispatch({
			type: 'SET_FETCH_ACTIONS',
			payload: [...localState.fetchActions, fetchAction],
		});
	};

	const setIsTrialLoading = (isLoading) => {
		ls_dispatch({
			type: 'SET_LOADING_STATE',
			payload: isLoading,
		});
	};

	const setTrialDescription = (results) => {
		// Assign first element of results array to trialDescription
		ls_dispatch({
			type: 'SET_TRIAL_DESCRIPTION',
			payload: results[0],
		});
	};

	const setSearchCriteriaObject = (searchCriteria) => {
		ls_dispatch({
			type: 'UPDATE_SEARCH_CRITERIA',
			payload: searchCriteria,
		});
	};

	const setErrors = (localErrors) => {
		ls_dispatch({
			type: 'SET_ERRORS',
			payload: localErrors,
		});
	};

	function stateReducer(state, action) {
		switch (action.type) {
			case 'SET_ERRORS':
				return { ...state, localErrors: action.payload };
			case 'SET_FETCH_ACTIONS':
				return { ...state, fetchActions: action.payload };
			case 'SET_LOADING_STATE':
				return { ...state, isTrialLoading: action.payload };
			case 'SET_TRIAL_DESCRIPTION':
				return { ...state, trialDescription: action.payload };
			case 'UPDATE_SEARCH_CRITERIA':
				return { ...state, searchCriteriaObject: action.payload };
			default:
				throw new Error();
		}
	}

	const handleApiError = (error) => {
		const status = error.response?.status;
		if (status === 404) {
			showBoundary(new NotFoundError(error.message, status));
		} else {
			showBoundary(new ApiServerError(error.message, status));
		}
	};

	const fetchSearchCriteria = async () => {
		try {
			const { diseaseFetcher, interventionFetcher, zipFetcher } =
				await runQueryFetchers(
					clinicalTrialsSearchClientV2,
					zipConversionEndpoint
				);
			const res = await queryStringToSearchCriteria(
				qs,
				diseaseFetcher,
				interventionFetcher,
				zipFetcher
			);

			setSearchCriteriaObject(res.searchCriteria);

			if (res.errors.length) {
				setErrors(res.errors);
			} else {
				setFetchActions(getClinicalTrialDescriptionAction(currId));
			}
		} catch (error) {
			setErrors([error]);
		}
	};

	// scroll to top on mount
	useEffect(() => {
		window.scrollTo(0, 0);

		if (apiError) {
			handleApiError(apiError);
		} else if (!loading && payload === null) {
			showBoundary(new NotFoundError('Trial not found', 404));
		} else if (isAllFetchingComplete()) {
			initTrialData();
		} else if (!searchCriteriaObject) {
			fetchSearchCriteria();
		}
	}, [loading, payload, searchCriteriaObject, apiError]);

	useEffect(() => {
		if (!apiError && !localErrors && !isTrialLoading) {
			tracking.trackEvent({
				// These properties are required.
				type: 'PageLoad',
				event: `ClinicalTrialsSearchApp:Load:TrialDescription`,
				analyticsName,
				name:
					canonicalHost.replace(/https:\/\/|http:\/\//, '') +
					window.location.pathname,
				title: `${trialDescription.brief_title}`,
				metaTitle: `${trialDescription.brief_title}`,
				// Any additional properties fall into the "page.additionalDetails" bucket
				// for the event.
				formType: searchCriteriaObject.formType,
				nctId: trialDescription.nct_id,
			});
		}
	}, [apiError, localErrors, isTrialLoading]);

	const initTrialData = () => {
		setTrialDescription(payload);
		setIsTrialLoading(false);
	};

	const isAllFetchingComplete = () => {
		return !loading && payload.length && searchCriteriaObject;
	};

	const trackShare = (shareType) => ({
		type: 'Other',
		event: `ClinicalTrialsSearchApp:Other:ShareButton`,
		analyticsName,
		linkName: 'UnknownLinkName',
		formType: searchCriteriaObject.formType,
		shareType: shareType.toLowerCase(),
	});

	const handlePrintTrial = () => {
		tracking.trackEvent(trackShare('Print'));
		window.print();
	};

	const handleEmailTrial = () => {
		tracking.trackEvent(trackShare('Email'));
		window.location.href = `mailto:?subject=Information%20from%20the%20National%20Cancer%20Institute%20Web%20Site&body=I%20found%20this%20information%20on%20www.cancer.gov%20and%20I'd%20like%20to%20share%20it%20with%20you:%20https%3A%2F%2Fwww.cancer.gov%2Fabout-cancer%2Ftreatment%2Fclinical-trials%2Fsearch%2Fv%3Fid%3D${currId}%0A%0A%20NCI's%20Web%20site,%20www.cancer.gov,%20provides%20accurate,%20up-to-date,%20comprehensive%20cancer%20information%20from%20the%20U.S.%20government's%20principal%20agency%20for%20cancer%20research.%20If%20you%20have%20questions%20or%20need%20additional%20information,%20we%20invite%20you%20to%20contact%20NCI%E2%80%99s%20LiveHelp%20instant%20messaging%20service%20at%20https://livehelp.cancer.gov,%20or%20call%20the%20NCI's%20Contact%20Center%201-800-4-CANCER%20(1-800-422-6237)%20(toll-free%20from%20the%20United%20States).`;
	};

	const trackStartOver = (linkType) => ({
		type: 'Other',
		event: 'ClinicalTrialsSearchApp:Other:NewSearchLinkClick',
		analyticsName,
		linkName: 'CTStartOverClick',
		formType: searchCriteriaObject.formType,
		source: linkType,
	});

	const handleStartOver = (linkType) => {
		tracking.trackEvent(trackStartOver(linkType));
	};

	const renderDelighters = () => {
		return (
			<>
				<div className="delighter cts-share">
					<div className="share-text">
						Share this clinical trial with your doctor:
					</div>
					<div className="share-btn-container">
						<button
							className="share-btn cts-share-print"
							type="button"
							onClick={handlePrintTrial}>
							<span className="icon icon-print" aria-hidden="true"></span>
							Print
							<span className="show-for-sr"> this trial</span>
						</button>
						<button
							className="share-btn cts-share-email"
							type="button"
							onClick={handleEmailTrial}>
							<span className="icon icon-email" aria-hidden="true"></span>
							Email <span className="show-for-sr">this trial</span>
						</button>
					</div>
				</div>
				<div className="cts-delighter-container">
					<Delighter
						classes="cts-livehelp"
						url="/contact"
						titleText={
							<>
								Have a question?
								<br />
								We&apos;re here to help
							</>
						}>
						<p>
							<strong>Chat with us:</strong> LiveHelp
							<br />
							<strong>Call us:</strong> 1-800-4-CANCER
							<br />
							(1-800-422-6237)
						</p>
					</Delighter>

					<Delighter
						classes="cts-which"
						url={whichTrialsUrl}
						titleText={<>Which trials are right for you?</>}>
						<p>
							Use the checklist in our guide to gather the information you’ll
							need.
						</p>
					</Delighter>
				</div>
			</>
		);
	};

	const renderStartOver = (searchCriteriaObject) => {
		return (
			<>
				<Link
					to={`${
						searchCriteriaObject?.formType === 'basic'
							? BasicSearchPagePath()
							: AdvancedSearchPagePath()
					}`}
					state={{ criteria: {}, refineSearch: false }}
					onClick={() => handleStartOver(START_OVER_LINK)}>
					<strong>Start Over</strong>
				</Link>
				{!hasSCOBeenUpdated(searchCriteriaObject) && (
					<>
						<span aria-hidden="true" className="separator">
							|
						</span>
						<button
							type="button"
							className="btnAsLink"
							onClick={handleRefineSearch}>
							Modify Search Criteria
						</button>
					</>
				)}
			</>
		);
	};

	const renderTrialDescriptionHeader = (searchCriteriaObject) => {
		if (
			searchCriteriaObject.formType === 'basic' ||
			searchCriteriaObject.formType === 'advanced'
		) {
			return (
				<div className="trial-description-page__header">
					{searchCriteriaObject &&
						searchCriteriaObject.formType != '' &&
						location.state && (
							<div className="back-to-search btnAsLink">
								<span
									onClick={() => navigate(-1)}
									onKeyDown={() => navigate(-1)}
									tabIndex="0"
									role="button">
									&lt; Back to search results
								</span>
							</div>
						)}
					{searchCriteriaObject && !hasSCOBeenUpdated(searchCriteriaObject) ? (
						<>
							<strong>This clinical trial matches:</strong>
							<SearchCriteriaTableUpdated
								searchCriteriaObject={searchCriteriaObject}
							/>
						</>
					) : (
						<>
							<strong>
								This clinical trial matches: &quot;all trials&quot;
							</strong>{' '}
							|{' '}
						</>
					)}
					{renderStartOver(searchCriteriaObject)}
				</div>
			);
		}
	};

	const renderEligibilityCriteria = () => {
		const eligibilityArr = trialDescription.eligibility.unstructured;
		const inclusionArr = eligibilityArr.filter(
			(item) => item.inclusion_indicator
		);
		const exclusionArr = eligibilityArr.filter(
			(item) => !item.inclusion_indicator
		);
		return (
			<div className="eligibility-criteria">
				<h3>Inclusion Criteria</h3>
				<ul>
					{inclusionArr.map((item, idx) => (
						<li key={'inclusion-' + idx}>{item.description}</li>
					))}
				</ul>
				{exclusionArr.length > 0 && (
					<>
						<h3>Exclusion Criteria</h3>
						<ul>
							{exclusionArr.map((item, idx) => (
								<li key={'exclusion-' + idx}>{item.description}</li>
							))}
						</ul>
					</>
				)}
			</div>
		);
	};

	const renderSecondaryIDs = () => {
		let secArr = [];
		const secIDFields = ['nci_id', 'ccr_id', 'ctep_id', 'dcp_id', 'other_ids'];
		// push secondaries onto array
		secIDFields.forEach((idField) => {
			if (idField === 'other_ids') {
				if (
					trialDescription.other_ids &&
					trialDescription.other_ids.length > 0
				) {
					trialDescription.other_ids.forEach((item) => {
						secArr.push(item.value);
					});
				}
			} else {
				let id = trialDescription[idField];
				if (id && id !== '') {
					secArr.push(id);
				}
			}
		});
		//de-dupe
		secArr = [...new Set(secArr)];
		// filter out nct and protocol id
		secArr = secArr.filter(
			(item) =>
				item !== trialDescription.nct_id &&
				item !== trialDescription.protocol_id
		);

		return secArr.length > 0 ? (
			<li>
				<strong className="field-label">Secondary IDs</strong>
				{secArr.join(', ')}
			</li>
		) : (
			<></>
		);
	};

	const formatPrimaryPurpose = () => {
		let formatted_purpose = '';
		if (
			trialDescription.primary_purpose &&
			trialDescription.primary_purpose !== ''
		) {
			formatted_purpose = trialDescription.primary_purpose
				.toLowerCase()
				.replace(/_/g, ' ');

			// Trial type for trials that return primary_purpose: "OTHER" need
			// to say "Not provided by ClinicalTrials.gov"
			if (formatted_purpose === 'other') {
				formatted_purpose = (
					<span className="non-formatted-tt">
						Not provided by clinicaltrials.gov
					</span>
				);
			}
		}
		return formatted_purpose;
	};

	const prettifyDescription = () => {
		let formattedStr =
			'<p>' +
			trialDescription.detail_description.replace(/(\r\n)/gm, '</p><p>') +
			'</p>';
		return { __html: formattedStr };
	};

	const handleExpandAllSections = () => {
		let headings = document.querySelectorAll(
			'.trial-description-page__content h2.cts-accordion__heading'
		);
		let buttons = document.querySelectorAll(
			'.trial-description-page__content .cts-accordion__button'
		);
		let contents = document.querySelectorAll(
			'.trial-description-page__content .cts-accordion__content'
		);
		headings.forEach((item) => {
			item.setAttribute('aria-expanded', true);
		});
		buttons.forEach((item) => {
			item.setAttribute('aria-expanded', true);
		});
		contents.forEach((item) => {
			item.setAttribute('aria-hidden', false);
		});
	};

	const handleHideAllSections = () => {
		let headings = document.querySelectorAll(
			'.trial-description-page__content h2.cts-accordion__heading'
		);
		let buttons = document.querySelectorAll(
			'.trial-description-page__content .cts-accordion__button'
		);
		let contents = document.querySelectorAll(
			'.trial-description-page__content .cts-accordion__content'
		);
		headings.forEach((item) => {
			item.setAttribute('aria-expanded', false);
		});
		buttons.forEach((item) => {
			item.setAttribute('aria-expanded', false);
		});
		contents.forEach((item) => {
			item.setAttribute('aria-hidden', true);
		});
	};

	const handleRefineSearch = () => {
		tracking.trackEvent({
			// These properties are required.
			type: 'Other',
			event: 'ClinicalTrialsSearchApp:Other:ModifySearchCriteriaLinkClick',
			analyticsName,
			linkName: 'CTSModifyClick',
			// Any additional properties fall into the "page.additionalDetails" bucket
			// for the event.
			formType: searchCriteriaObject.formType,
			source: 'modify_search_criteria_link',
		});
		navigate(AdvancedSearchPagePath(), {
			state: {
				criteria: searchCriteriaObject,
				refineSearch: true,
			},
		});
	};

	const activeRecruitmentSites = !isTrialLoading
		? filterSitesByActiveRecruitment(trialDescription.sites)
		: [];

	// Handle user input errors in the component
	if (localErrors) {
		return <InvalidCriteriaPage initErrorsList={localErrors} />;
	}

	return (
		<>
			{!isTrialLoading && payload != null && payload.length > 0 && (
				<>
					{!isTrialLoading && (
						<Helmet>
							<title>
								{trialDescription.brief_title} - {siteName}
							</title>{' '}
							<meta
								property="og:title"
								content={trialDescription.brief_title}
							/>
							<link
								rel="canonical"
								href={`https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=${currId}`}
							/>
							<meta
								property="og:url"
								content={`https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=${currId}`}
							/>
							<meta name="description" content={trialDescription.brief_title} />
							<meta
								property="og:description"
								content={`${trialDescription.brief_title} - ${trialDescription.nct_id}`}
							/>
						</Helmet>
					)}
					<article className="trial-description-page">
						{isTrialLoading ? (
							trialTitle ? (
								<h1>{trialTitle}</h1>
							) : (
								<div className="loader__trial-title">
									<div className="skeleton"></div>
									<div className="skeleton"></div>
								</div>
							)
						) : (
							<>
								<h1>{trialDescription.brief_title}</h1>
								{renderTrialDescriptionHeader(searchCriteriaObject)}
							</>
						)}

						<div className="trial-description-page__description">
							<div className="trial-description-page__content">
								{isTrialLoading ? (
									<>
										<div className="loader__mock-accordion">
											<div></div>
											<div className="loader__mock-description">
												<div></div>
												<div></div>
												<div></div>
												<div></div>
												<div></div>
											</div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
										</div>
									</>
								) : (
									<>
										<div className="trial-content-header">
											<TrialStatusIndicator
												status={trialDescription?.current_trial_status?.toLowerCase()}
											/>
											<div className="accordion-control__wrapper">
												<button
													type="button"
													className="accordion-control__button open"
													onClick={handleExpandAllSections}>
													<span className="icon expand"></span> Open all{' '}
													<span className="show-for-sr">sections</span>
												</button>
												<button
													type="button"
													className="accordion-control__button close"
													onClick={handleHideAllSections}>
													<span className="icon contract"></span> Close all{' '}
													<span className="show-for-sr">sections</span>
												</button>
											</div>
										</div>

										<Accordion>
											<AccordionItem titleCollapsed="Description" expanded>
												<p>{trialDescription.brief_summary}</p>
											</AccordionItem>
											<AccordionItem titleCollapsed="Eligibility Criteria">
												{renderEligibilityCriteria()}
											</AccordionItem>
											<AccordionItem titleCollapsed="Locations &amp; Contacts">
												{activeRecruitmentSites &&
												activeRecruitmentSites.length > 0 ? (
													<SitesList
														searchCriteria={searchCriteriaObject}
														sites={activeRecruitmentSites}
													/>
												) : noLocInfo.includes(
														trialDescription.current_trial_status.toLowerCase()
												  ) ? (
													<p>Location information is not yet available.</p>
												) : (
													<p>
														See trial information on{' '}
														<a
															href={`https://www.clinicaltrials.gov/study/${trialDescription.nct_id}`}
															target="_blank"
															rel="noopener noreferrer">
															ClinicalTrials.gov
														</a>{' '}
														for a list of participating sites.
													</p>
												)}
											</AccordionItem>
											<AccordionItem titleCollapsed="Trial Objectives and Outline">
												{trialDescription.detail_description && (
													<div
														className="trial-objectives-outline"
														dangerouslySetInnerHTML={prettifyDescription()}
													/>
												)}
											</AccordionItem>
											<AccordionItem titleCollapsed="Trial Phase &amp; Type">
												<>
													<p className="trial-phase">
														<strong className="field-label">Trial Phase</strong>
														{`${
															trialDescription.phase &&
															trialDescription.phase !== 'NA'
																? 'Phase ' +
																  trialDescription.phase.replace('_', '/')
																: 'No phase specified'
														}`}
													</p>
													{trialDescription.primary_purpose &&
														trialDescription.primary_purpose !== '' && (
															<p className="trial-type">
																<strong className="field-label">
																	Trial Type
																</strong>
																<span className="trial-type-name">
																	{formatPrimaryPurpose()}
																</span>
															</p>
														)}
												</>
											</AccordionItem>
											{(trialDescription.lead_org ||
												trialDescription.principal_investigator) && (
												<AccordionItem titleCollapsed="Lead Organization">
													<>
														{trialDescription.lead_org &&
															trialDescription.lead_org !== '' && (
																<p className="leadOrg">
																	<strong className="field-label">
																		Lead Organization
																	</strong>
																	{trialDescription.lead_org}
																</p>
															)}
														{trialDescription.principal_investigator &&
															trialDescription.principal_investigator !==
																'' && (
																<p className="investigator">
																	<strong className="field-label">
																		Principal Investigator
																	</strong>
																	{trialDescription.principal_investigator}
																</p>
															)}
													</>
												</AccordionItem>
											)}
											<AccordionItem titleCollapsed="Trial IDs">
												<ul className="trial-ids">
													<li>
														<strong className="field-label">Primary ID</strong>
														{trialDescription.protocol_id}
													</li>
													{renderSecondaryIDs()}
													<li>
														<strong className="field-label">
															ClinicalTrials.gov ID
														</strong>
														<a
															href={`http://clinicaltrials.gov/study/${trialDescription.nct_id}`}
															target="_blank"
															rel="noopener noreferrer">
															{trialDescription.nct_id}
														</a>
													</li>
												</ul>
											</AccordionItem>
										</Accordion>
									</>
								)}
							</div>

							<div className="trial-description-page__aside">
								{renderDelighters()}
							</div>
						</div>
					</article>
				</>
			)}
		</>
	);
};

export default TrialDescriptionPage;
