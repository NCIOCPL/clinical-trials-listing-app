import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { ChatOpener, Delighter } from '../../components/atomic/index.js';
import { useTracking } from 'react-tracking';
import { TRY_NEW_SEARCH_LINK } from '../../constants/index.js';
// Context API store
import { updateCTXGlobalValue } from '../../store/ctx-actions.js';
import { useAppSettings } from '../../store/store.js';
import { useAppPaths } from '../../hooks/routing.js';

import './InvalidCriteriaPage.scss';
import * as queryString from 'query-string';
import { useLocation } from 'react-router-dom';

const InvalidCriteriaPage = ({ initErrorsList }) => {
	const tracking = useTracking();
	const [{ dispatch, analyticsName, canonicalHost, siteName, whichTrialsUrl }] =
		useAppSettings();
	const { AdvancedSearchPagePath, BasicSearchPagePath } = useAppPaths();

	// Determine the original formType
	const location = useLocation();
	const qs = queryString.extract(location.search);
	const query = queryString.parse(qs, {
		parseBooleans: true,
		parseNumbers: false,
		arrayFormat: 'none',
	});

	let originalFormType = 'basic';
	if (query['rl'] && query['rl'] === '2') {
		originalFormType = 'advanced';
	}

	useEffect(() => {
		const pageTitle = 'Errors Occurred';

		// Fire off page load event
		tracking.trackEvent({
			// These properties are required.
			type: 'PageLoad',
			event: `ClinicalTrialsSearchApp:Load:Error`,
			analyticsName,
			// Todo: Name, title, metaTitle confirmation
			metaTitle: pageTitle,
			name:
				canonicalHost.replace(/https:\/\/|http:\/\//, '') +
				window.location.pathname,
			title: pageTitle,
			// Any additional properties fall into the "page.additionalDetails" bucket
			// for the event.
		});
	}, []);

	const handleStartOver = () => {
		tracking.trackEvent({
			type: 'Other',
			event: 'ClinicalTrialsSearchApp:Other:NewSearchLinkClick',
			analyticsName,
			linkName: 'CTStartOverClick',
			formType: '',
			source: TRY_NEW_SEARCH_LINK,
		});

		dispatch(
			updateCTXGlobalValue({
				field: 'initErrorsList',
				value: [],
			})
		);
	};

	const getFieldNameDisplay = (fieldName) => {
		const fieldNameMap = {
			cancerType: 'Cancer Type/Condition',
			age: 'Age',
			subtypes: 'Subtypes',
			stages: 'Stages',
			findings: 'Findings',
			keywordPhrases: 'Keywords and Phrases',
			hospital: 'Hospitals/Institutions',
			location: 'Location Type',
			zip: 'ZIP Code',
			zipCoords: 'ZIP Code',
			country: 'Country',
			vaOnly: 'Limit results to Veterans Affairs facilities',
			healthyVolunteers: 'Healthy Volunteers',
			trialTypes: 'Trial Type',
			states: 'States',
			city: 'City',
			drugs: 'Drug/Drug Family',
			treatments: 'Other Treatments',
			trialId: 'Trial ID',
			trialPhases: 'Trial Phase',
			investigator: 'Trial Investigators',
			leadOrg: 'Lead Organization',
			formType: 'Form Version',
		};
		return fieldNameMap[fieldName] || fieldName;
	};

	const renderDelighters = () => (
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
					Use the checklist in our guide to gather the information you’ll need.
				</p>
			</Delighter>
		</div>
	);

	return (
		<>
			<Helmet>
				<title>Clinical Trials Search - {siteName}</title>
				<meta property="og:title" content="Clinical Trials Search" />

				<meta
					name="description"
					content="Find an NCI-supported clinical trial - Search"
				/>
				<meta
					property="og:description"
					content="Find an NCI-supported clinical trial - Search"
				/>
			</Helmet>
			<article className="error-page">
				<h1>Clinical Trials Search</h1>

				<div className="error-page__content">
					<div className="error-page__control --top">
						<div className="error-page__list">
							<div className="error-list">
								<p>
									Sorry, you seem to have entered invalid criteria. Please check
									the following, and try your search again:
								</p>
								<ul>
									{initErrorsList.map((item) => (
										<li key={item}>{getFieldNameDisplay(item.fieldName)}</li>
									))}
								</ul>
								<p>
									For assistance, please contact the Cancer Information Service.
									You can <ChatOpener /> or call 1-800-4-CANCER
									(1-800-422-6237).
								</p>
								<p>
									<a
										href={`${
											originalFormType === 'advanced'
												? AdvancedSearchPagePath()
												: BasicSearchPagePath()
										}`}
										onClick={handleStartOver}>
										Try a new search
									</a>
								</p>
							</div>
							<aside className="error-page__aside --side">
								{renderDelighters()}
							</aside>
						</div>
					</div>
				</div>
				<aside className="error-page__aside --bottom">
					{renderDelighters()}
				</aside>
			</article>
		</>
	);
};
InvalidCriteriaPage.propTypes = {
	initErrorsList: PropTypes.array,
};
export default InvalidCriteriaPage;
