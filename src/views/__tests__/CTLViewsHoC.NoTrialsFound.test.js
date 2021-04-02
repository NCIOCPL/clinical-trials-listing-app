import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import CTLViewsHoC from '../CTLViewsHoC';
import { MockAnalyticsProvider } from '../../tracking';
import { useCustomQuery } from '../../hooks';
import { useStateValue } from '../../store/store';

jest.mock('../../store/store.js');
jest.mock('../../hooks/customFetch');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		codeOrPurl: 'notrials',
	}),
	useLocation: () => ({
		pathname: '/notrials',
		search: '?p1=chronic-fatigue-syndrome',
		hash: '',
		state: {
			listingInfo: {
				conceptId: ['C3037'],
				name: {
					label: 'Chronic Fatigue Syndrome',
					normalized: 'chronic fatigue syndrome',
				},
				prettyUrlName: 'chronic-fatigue-syndrome',
			},
			wasRedirected: true,
		},
	}),
}));

const mockComponent = jest.fn(() => {
	return <>Hello World</>;
});

// This must be called before each, or else mockComponent.calls
// will continue to acumulate across all tests.
beforeEach(() => {
	mockComponent.mockClear();
});

describe('CTLViewsHoc ', () => {
	test('Should display No Trials Found if accessed with /notrials route and state listing info', async () => {
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
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const introText =
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}.</p>';
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
				detailedViewPagePrettyUrlFormatter,
				introText,
				language,
				metaDescription,
				noTrialsHtml,
				pageTitle,
				title,
				trialListingPageType,
			},
		]);

		useCustomQuery.mockReturnValue({
			error: false,
			loading: false,
			status: 200,
			payload: data,
		});

		const WrappedComponent = CTLViewsHoC(mockComponent);

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter
						initialEntries={['/notrials?p1=chronic-fatigue-syndrome']}>
						<WrappedComponent />
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
