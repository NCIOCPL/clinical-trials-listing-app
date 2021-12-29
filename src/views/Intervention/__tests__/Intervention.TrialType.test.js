import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import Intervention from '../Intervention';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';
import { useAppPaths } from '../../../hooks/routing';
import { useCtsApi } from '../../../hooks/ctsApiSupport/useCtsApi';

jest.mock('../../../store/store.js');
jest.mock('../../../hooks/routing');
jest.mock('../../../hooks/ctsApiSupport/useCtsApi');

const fixturePath = `/v2/trials`;
const trastuzumabFile = `trastuzumab-response.json`;

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

	it('should render <ResultsList /> component for intervention and trial type display', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C1647'],
				name: { label: 'Trastuzumab', normalized: 'trastuzumab' },
				prettyUrlName: 'trastuzumab',
			},
			{ prettyUrlName: 'treatment', idString: 'treatment', label: 'Treatment' },
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Intervention';
		const dynamicListingPatterns = {
			Intervention: {
				browserTitle: 'Clinical Trials Using {{intervention_label}}',
				introText:
					'<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying {{intervention_normalized}}.</p>',
				metaDescription:
					'Find clinical trials using {{intervention_normalized}}.',
				noTrialsHtml:
					'<p>There are currently no available trials using {{intervention_normalized}}.</p>',
				pageTitle: 'Clinical Trials Using {{intervention_label}}',
			},
			InterventionTrialType: {
				pageTitle:
					'{{trial_type_label}} Clinical Trials Using {{intervention_label}}',
				browserTitle:
					'{{trial_type_label}} Clinical Trials Using {{intervention_label}}',
				metaDescription:
					'NCI supports clinical trials studying new and more effective ways to treat cancer. Find clinical trials testing {{trial_type_normalized}} methods that use {{intervention_normalized}}.',
				introText:
					'<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods that use {{intervention_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				noTrialsHtml:
					'<p>There are no NCI-supported clinical trials for {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
			},
		};

		const trialResults = getFixture(`${fixturePath}/${trastuzumabFile}`);

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				detailedViewPagePrettyUrlFormatter,
				dynamicListingPatterns,
				itemsPerPage: 25,
				title,
				trialListingPageType,
				apiClients: {
					clinicalTrialsSearchClient: true,
				},
			},
		]);

		useAppPaths.mockReturnValue({
			codeOrPurlPath: '/:codeOrPurl/:type',
		});

		useCtsApi.mockReturnValue({
			error: false,
			loading: false,
			aborted: false,
			payload: trialResults,
		});

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

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<Intervention
							routeParamMap={routeParamMap}
							routePath={redirectPath}
							data={data}
						/>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		expect(useCtsApi).toHaveBeenCalled();

		expect(
			screen.getByText('Treatment Clinical Trials Using Trastuzumab')
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'Clinical trials are research studies that involve people. The clinical trials on this list are testing treatment methods that use trastuzumab. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.'
			)
		).toBeInTheDocument();

		// Navigate to page 2 with next pager item. Confirm currently active page on top and bottom is 2
		await act(async () => {
			await fireEvent.click(
				screen.getAllByRole('button', { name: 'next page' })[0]
			);
		});

		expect(
			screen.getAllByRole('button', { name: 'page 2' })[0]
		).toHaveAttribute('class', 'pager__button active');
		expect(
			screen.getAllByRole('button', { name: 'page 2' })[1]
		).toHaveAttribute('class', 'pager__button active');
	});
});
