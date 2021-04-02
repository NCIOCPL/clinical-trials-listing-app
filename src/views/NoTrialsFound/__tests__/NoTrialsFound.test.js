import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import NoTrialsFound from '../NoTrialsFound';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('../../../store/store.js');

describe('<NoTrialsHtml />', () => {
	it('Should assert NoTrialsHtml is displayed with replaced text', async () => {
		const basePath = '/';
		const browserTitle = '{{disease_name}} Clinical Trials';
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
		const metaDescription = 'Find clinical trials for {{disease_normalized}}.';
		const noTrialsHtml =
			'<p>There are currently no available trials for {{disease_normalized}}.</p>';
		const pageTitle = '{{disease_label}} Clinical Trials';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				browserTitle,
				canonicalHost,
				language,
				metaDescription,
				noTrialsHtml,
				pageTitle,
				title,
				trialListingPageType,
			},
		]);

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<NoTrialsFound data={data} />
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		expect(
			screen.getByText('Chronic Fatigue Syndrome Clinical Trials')
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'There are currently no available trials for chronic fatigue syndrome.'
			)
		).toBeInTheDocument();
	});
});
