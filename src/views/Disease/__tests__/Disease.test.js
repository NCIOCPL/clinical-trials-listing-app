import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import Disease from '../Disease';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';
import { useAppPaths, useCustomQuery } from '../../../hooks';

jest.mock('../../../store/store.js');
jest.mock('../../../hooks');

const fixturePath = `/clinical-trials`;
const breastCancerFile = `breast-cancer-response.json`;

const dynamicListingPatterns = {
	Disease: {
		browserTitle: '{{disease_label}} Clinical Trials',
		introText:
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}.</p>',
		metaDescription:
			'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for {{disease_normalized}}.',
		noTrialsHtml:
			'<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
		pageTitle: '{{disease_label}} Clinical Trials',
	},
	DiseaseTrialType: {
		browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
		introText:
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}} {{trial_type_normalized}}.</p>',
		metaDescription:
			'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find {{trial_type_normalized}} clinical trials for {{disease_normalized}}.',
		noTrialsHtml:
			'<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
		pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
	},
	DiseaseTrialTypeIntervention: {
		browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
		introText:
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are testing {{trial_type_normalized}} methods for {{disease_normalized}} that use {{intervention_normalized}}.</p>',
		metaDescription:
			'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials testing {{intervention_normalized}} in the {{trial_type_normalized}} of {{disease_normalized}}.',
		noTrialsHtml:
			'<p>There are no NCI-supported clinical trials for {{disease_normalized}} {{trial_type_normalized}} using {{intervention_normalized}} at this time. You can try a <a href=\"/about-cancer/treatment/clinical-trials/search\">new search</a> or <a href=\"/contact\">contact our Cancer Information Service</a> to talk about options for clinical trials.</p>',
		pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
	},
};

describe('<Disease />', () => {
	it('should render <ResultsList /> component', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const data = {
			conceptId: ['C4872'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer',
			},
			prettyUrlName: 'breast-cancer',
		};
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';

		const trialResults = getFixture(`${fixturePath}/${breastCancerFile}`);

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				detailedViewPagePrettyUrlFormatter,
				dynamicListingPatterns,
				title,
				trialListingPageType,
			},
		]);

		useAppPaths.mockReturnValue({
			codeOrPurlPath: '/:codeOrPurl',
		});

		useCustomQuery.mockReturnValue({
			error: false,
			loading: false,
			status: 200,
			payload: trialResults,
		});

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<Disease data={data} />
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		expect(useCustomQuery).toHaveBeenCalled();

		expect(
			screen.getByText('Breast Cancer Clinical Trials')
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'Clinical trials are research studies that involve people. The clinical trials on this list are for breast cancer.'
			)
		).toBeInTheDocument();
	});
});
