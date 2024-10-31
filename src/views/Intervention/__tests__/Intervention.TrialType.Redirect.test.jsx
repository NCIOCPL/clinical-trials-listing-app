import { render } from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, useLocation } from 'react-router';
import Intervention from '../Intervention';
import { useStateValue } from '../../../store/store';
import { MockAnalyticsProvider } from '../../../tracking';
import { useCtsApi } from '../../../hooks/ctsApiSupport/useCtsApi';
import { getClinicalTrials } from '../../../services/api/actions/getClinicalTrials';
import { CTLViewsTestWrapper } from '../../../test-utils/TestWrappers';

jest.mock('../../../store/store');
jest.mock('../../../hooks/ctsApiSupport/useCtsApi');

let location;

function ComponentWithLocation({ RenderComponent }) {
	location = useLocation();
	return <RenderComponent />;
}

ComponentWithLocation.propTypes = {
	RenderComponent: PropTypes.func,
};

describe('<Intervention Trial Type display />', () => {
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
				conceptId: ['C1234'],
				name: {
					label: 'Spiroplatin',
					normalized: 'spiroplatin',
				},
				prettyUrlName: 'spiroplatin',
			},
			{ prettyUrlName: 'treatment', idString: 'treatment', label: 'Treatment' },
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Intervention';
		const dynamicListingPatterns = {
			Intervention: {
				browserTitle: 'Clinical Trials Using {{intervention_label}}',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying {{intervention_normalized}}.</p>',
				metaDescription: 'Find clinical trials using {{intervention_normalized}}.',
				noTrialsHtml: '<p>There are currently no available trials using {{intervention_normalized}}.</p>',
				pageTitle: 'Clinical Trials Using {{intervention_label}}',
			},
			InterventionTrialType: {
				pageTitle: '{{trial_type_label}} Clinical Trials Using {{intervention_label}}',
				browserTitle: '{{trial_type_label}} Clinical Trials Using {{intervention_label}}',
				metaDescription: 'NCI supports clinical trials studying new and more effective ways to treat cancer. Find clinical trials testing {{trial_type_normalized}} methods that use {{intervention_normalized}}.',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods that use {{intervention_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
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

		const InterventionWithData = () => {
			return <Intervention routeParamMap={routeParamMap} routePath={redirectPath} data={data} />;
		};

		render(
			<CTLViewsTestWrapper initialEntries={['/spiroplatin']}>
				<ComponentWithLocation RenderComponent={InterventionWithData} />
			</CTLViewsTestWrapper>
		);

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=spiroplatin&p2=treatment',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		const requestFilters = {
			'arms.interventions.nci_thesaurus_concept_id': ['C1234'],
			primary_purpose: 'treatment',
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
				conceptId: ['C1234'],
				name: {
					label: 'Spiroplatin',
					normalized: 'spiroplatin',
				},
				prettyUrlName: null,
			},
			{ prettyUrlName: 'treatment', idString: 'treatment', label: 'Treatment' },
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Intervention';
		const dynamicListingPatterns = {
			Intervention: {
				browserTitle: 'Clinical Trials Using {{intervention_label}}',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying {{intervention_normalized}}.</p>',
				metaDescription: 'Find clinical trials using {{intervention_normalized}}.',
				noTrialsHtml: '<p>There are currently no available trials using {{intervention_normalized}}.</p>',
				pageTitle: 'Clinical Trials Using {{intervention_label}}',
			},
			InterventionTrialType: {
				pageTitle: '{{trial_type_label}} Clinical Trials Using {{intervention_label}}',
				browserTitle: '{{trial_type_label}} Clinical Trials Using {{intervention_label}}',
				metaDescription: 'NCI supports clinical trials studying new and more effective ways to treat cancer. Find clinical trials testing {{trial_type_normalized}} methods that use {{intervention_normalized}}.',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods that use {{intervention_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				noTrialsHtml: '<p>There are no NCI-supported clinical trials for {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
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

		const InterventionWithData = () => {
			return <Intervention routeParamMap={routeParamMap} routePath={redirectPath} data={data} />;
		};

		render(
			<CTLViewsTestWrapper initialEntries={['/C1234']}>
				<ComponentWithLocation RenderComponent={InterventionWithData} />
			</CTLViewsTestWrapper>
		);

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=C1234&p2=treatment',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		const requestFilters = {
			'arms.interventions.nci_thesaurus_concept_id': ['C1234'],
			primary_purpose: 'treatment',
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
