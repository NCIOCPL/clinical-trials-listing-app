import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import Disease from '../Disease';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';
import { useAppPaths, useCustomQuery } from '../../../hooks';

jest.mock('../../../store/store.js');
jest.mock('../../../hooks');

const fixturePath = `/v1/clinical-trials`;
const trastuzumabFile = `trastuzumab-response.json`;

describe('<Disease />', () => {
	it('should render <ResultsList /> component', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C4872', 'C118809'],
				name: { label: 'Breast Cancer', normalized: 'breast cancer' },
				prettyUrlName: 'breast-cancer',
			},
			{ prettyUrlName: 'treatment', idString: 'treatment', label: 'Treatment' },
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';
		const dynamicListingPatterns = {
			Disease: {
				browserTitle: '{{disease_label}} Clinical Trials',
				introText:
					'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				metaDescription:
					'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for {{disease_normalized}}.',
				noTrialsHtml:
					'<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
				pageTitle: '{{disease_label}} Clinical Trials',
			},
			DiseaseTrialType: {
				browserTitle:
					'{{trial_type_label}} Clinical Trials for {{disease_label}}',
				introText:
					'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}} {{trial_type_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				metaDescription:
					'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find {{trial_type_normalized}} clinical trials for {{disease_normalized}}.',
				noTrialsHtml:
					'<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
				pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
			},
			DiseaseTrialTypeIntervention: {
				browserTitle:
					'{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
				introText:
					'<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods for {{disease_normalized}} that use {{intervention_normalized}}. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.</p><p>NCI’s <a href="/about-cancer/treatment/clinical-trials/what-are-trials">basic information about clinical trials</a> explains the types and phases of trials and how they are carried out. Clinical trials look at new ways to prevent, detect, or treat disease. You may want to think about taking part in a clinical trial. Talk to your doctor for help in deciding if one is right for you.</p>',
				metaDescription:
					'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials testing {{intervention_normalized}} in the {{trial_type_normalized}} of {{disease_normalized}}.',
				noTrialsHtml:
					'<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
				pageTitle:
					'{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
			},
		};

		const response = getFixture(`${fixturePath}/${trastuzumabFile}`);

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
			},
		]);

		useAppPaths.mockReturnValue({
			CodeOrPurlWithTypePath: () => '/:codeOrPurl/:type',
		});

		useCustomQuery.mockReturnValue({
			error: false,
			loading: false,
			status: 200,
			payload: response,
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
					<MemoryRouter initialEntries={['/C4872/treatment']}>
						<Disease
							routeParamMap={routeParamMap}
							routePath={redirectPath}
							data={data}
						/>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		expect(useCustomQuery).toHaveBeenCalled();

		expect(
			screen.getByText('Treatment Clinical Trials for Breast Cancer')
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'Clinical trials are research studies that involve people. The clinical trials on this list are for breast cancer treatment. All trials on the list are NCI-supported clinical trials, which are sponsored or otherwise financially supported by NCI.'
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
