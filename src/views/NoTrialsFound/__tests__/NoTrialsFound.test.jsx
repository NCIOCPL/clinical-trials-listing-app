import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import NoTrialsFound from '../NoTrialsFound';
import { useStateValue } from '../../../store/store';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('../../../store/store');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: () => ({
		pathname: '/notrials',
		search: '?p1=chronic-fatigue-syndrome',
	}),
}));

describe('<NoTrialsHtml />', () => {
	it('Should assert NoTrialsHtml is displayed with replaced text', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C3037'],
				name: {
					label: 'Chronic Fatigue Syndrome',
					normalized: 'chronic fatigue syndrome',
				},
				prettyUrlName: 'chronic-fatigue-syndrome',
			},
		];
		const routeParamMap = [
			{
				paramName: 'codeOrPurl',
				textReplacementKey: 'disease',
				type: 'listing-information',
			},
		];
		const language = 'en';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';
		const dynamicListingPatterns = {
			Disease: {
				browserTitle: '{{disease_name}} Clinical Trials',
				metaDescription: 'Find clinical trials for {{disease_normalized}}.',
				noTrialsHtml: '<p>There are currently no available trials for {{disease_normalized}}.</p>',
				pageTitle: '{{disease_label}} Clinical Trials',
			},
		};

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

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/notrials?p1=chronic-fatigue-syndrome']}>
					<NoTrialsFound routeParamMap={routeParamMap} data={data} />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		expect(screen.getByText('Chronic Fatigue Syndrome Clinical Trials')).toBeInTheDocument();
		expect(screen.getByText('There are currently no available trials for chronic fatigue syndrome.')).toBeInTheDocument();
	});
});
