import { render } from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, useLocation } from 'react-router';
import Disease from '../Disease';
import { useStateValue } from '../../../store/store';
import { MockAnalyticsProvider } from '../../../tracking';
import { useCtsApi } from '../../../hooks/ctsApiSupport/useCtsApi';
import { getClinicalTrials } from '../../../services/api/actions/getClinicalTrials';
import { CTLViewsTestWrapper } from '../../../test-utils/TestWrappers';

jest.mock('../../../store/store');
jest.mock('../../../hooks/ctsApiSupport/useCtsApi');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'), // use actual for all non-hook parts
	useParams: () => ({
		codeOrPurl: 'C3037',
		type: 'supportive-care',
	}),
}));

let location;

function ComponentWithLocation({ RenderComponent }) {
	location = useLocation();
	return <RenderComponent />;
}

ComponentWithLocation.propTypes = {
	RenderComponent: PropTypes.func,
};

describe('<Disease />', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	useCtsApi.mockReturnValue({
		error: false,
		loading: false,
		aborted: false,
		payload: {
			total: 0,
			trials: [],
		},
	});

	it('Should assert page is redirected to No Trials Found', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C3037'],
				name: {
					label: 'Chronic Fatigue Syndrome',
					normalized: 'chronic-fatigue-syndrome',
				},
				prettyUrlName: 'chronic-fatigue-syndrome',
			},
			{
				prettyUrlName: 'supportive-care',
				idString: 'supportive_care',
				label: 'Supportive Care',
			},
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';
		const dynamicListingPatterns = {
			Disease: {
				browserTitle: '{{disease_label}} Clinical Trials',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				metaDescription: 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for {{disease_normalized}}.',
				noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
				pageTitle: '{{disease_label}} Clinical Trials',
			},
			DiseaseTrialType: {
				browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}} {{trial_type_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				metaDescription: 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find {{trial_type_normalized}} clinical trials for {{disease_normalized}}.',
				noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
				pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
			},
			DiseaseTrialTypeIntervention: {
				browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods for {{disease_normalized}} that use {{intervention_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				metaDescription: 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials testing {{intervention_normalized}} in the {{trial_type_normalized}} of {{disease_normalized}}.',
				noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
				pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
			},
		};

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				detailedViewPagePrettyUrlFormatter,
				dynamicListingPatterns,
				title,
				trialListingPageType,
				apiClients: {
					clinicalTrialsSearchClient: true,
				},
			},
		]);

		const redirectPath = () => '/notrials';

		const routeParamMap = [
			{
				paramName: 'codeOrPurl',
				textReplacementKey: 'disease',
				type: 'listing-information',
			},
			{
				paramName: 'type',
				textReplacementKey: 'trial_type',
				type: 'trial-type',
			},
		];

		const DiseaseWithData = () => {
			return <Disease routeParamMap={routeParamMap} routePath={redirectPath} data={data} />;
		};

		render(
			<CTLViewsTestWrapper initialEntries={['/chronic-fatigue-syndrome/supportive-care']}>
				<ComponentWithLocation RenderComponent={DiseaseWithData} />
			</CTLViewsTestWrapper>
		);

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=chronic-fatigue-syndrome&p2=supportive-care',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		const requestFilters = {
			'diseases.nci_thesaurus_concept_id': ['C3037'],
			primary_purpose: 'supportive_care',
		};
		const requestQuery = getClinicalTrials({
			from: 0,
			requestFilters,
			size: 50,
		});

		// expect(useCtsApi.mock.calls[0][0]).toEqual(requestQuery);

		expect(location).toMatchObject(expectedLocationObject);
	});

	it('Should assert page is redirected to code when pretty URL is absent', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C3037'],
				name: {
					label: 'Chronic Fatigue Syndrome',
					normalized: 'chronic-fatigue-syndrome',
				},
				prettyUrlName: null,
			},
			{
				prettyUrlName: 'supportive-care',
				idString: 'supportive_care',
				label: 'Supportive Care',
			},
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';
		const dynamicListingPatterns = {
			Disease: {
				browserTitle: '{{disease_label}} Clinical Trials',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				metaDescription: 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for {{disease_normalized}}.',
				noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
				pageTitle: '{{disease_label}} Clinical Trials',
			},
			DiseaseTrialType: {
				browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}} {{trial_type_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				metaDescription: 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find {{trial_type_normalized}} clinical trials for {{disease_normalized}}.',
				noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
				pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
			},
			DiseaseTrialTypeIntervention: {
				browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods for {{disease_normalized}} that use {{intervention_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				metaDescription: 'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials testing {{intervention_normalized}} in the {{trial_type_normalized}} of {{disease_normalized}}.',
				noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
				pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
			},
		};

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				detailedViewPagePrettyUrlFormatter,
				dynamicListingPatterns,
				title,
				trialListingPageType,
				apiClients: {
					clinicalTrialsSearchClient: true,
				},
			},
		]);

		const redirectPath = () => '/notrials';

		const routeParamMap = [
			{
				paramName: 'codeOrPurl',
				textReplacementKey: 'disease',
				type: 'listing-information',
			},
			{
				paramName: 'type',
				textReplacementKey: 'trial_type',
				type: 'trial-type',
			},
		];

		const DiseaseWithData = () => {
			return <Disease routeParamMap={routeParamMap} routePath={redirectPath} data={data} />;
		};

		render(
			<CTLViewsTestWrapper initialEntries={['/C3037/supportive-care']}>
				<ComponentWithLocation RenderComponent={DiseaseWithData} />
			</CTLViewsTestWrapper>
		);

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=C3037&p2=supportive-care',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		const requestFilters = {
			'diseases.nci_thesaurus_concept_id': ['C3037'],
			primary_purpose: 'supportive_care',
		};
		const requestQuery = getClinicalTrials({
			from: 0,
			requestFilters,
			size: 50,
		});

		// expect(useCtsApi.mock.calls[0][0]).toEqual(requestQuery);
		expect(location).toMatchObject(expectedLocationObject);
	});
});
