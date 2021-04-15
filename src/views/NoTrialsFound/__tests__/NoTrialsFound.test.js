import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import NoTrialsFound from '../NoTrialsFound';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('../../../store/store.js');

const dynamicListingPatterns = {
	Disease: {
		browserTitle: '{{disease_label}} Clinical Trials',
		introText:
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}.</p>',
		metaDescription:
			'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for {{disease_normalized}}.',
		noTrialsHtml:
			'<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time.</p>',
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

describe('<NoTrialsHtml />', () => {
	it('Should assert NoTrialsHtml is displayed with replaced text', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const data = {
			conceptId: ['C3037'],
			name: {
				label: 'Chronic Fatigue Syndrome',
				normalized: 'chronic fatigue syndrome',
			},
			prettyUrlName: 'chronic-fatigue-syndrome',
		};
		const language = 'en';
		const listingPattern = 'Disease';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				dynamicListingPatterns,
				language,
				title,
				trialListingPageType,
			},
		]);

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<NoTrialsFound listingPattern={listingPattern} data={data} />
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		expect(
			screen.getByText('Chronic Fatigue Syndrome Clinical Trials')
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'There are no NCI-supported clinical trials for chronic fatigue syndrome at this time.'
			)
		).toBeInTheDocument();
	});
});
