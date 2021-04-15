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
		state: null,
	}),
}));

const dynamicListingPatterns = {
	mockConstructor: {
		browserTitle: '{{disease_label}} Clinical Trials',
		introText:
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}.</p>',
		metaDescription:
			'NCI supports clinical trials studying new and more effective ways to detect and treat cancer. Find clinical trials for {{disease_normalized}}.',
		noTrialsHtml:
			'<p>There are no NCI-supported clinical trials for {{disease_normalized}} at this time.</p>',
		pageTitle: '{{disease_label}} Clinical Trials',
	},
};

const mockComponent = jest.fn(() => {
	return <>Hello World</>;
});

// This must be called before each, or else mockComponent.calls
// will continue to acumulate across all tests.
beforeEach(() => {
	mockComponent.mockClear();
});

describe('CTLViewsHoc ', () => {
	test('Should display No Trials Found', async () => {
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
		const introText =
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}.</p>';
		const language = 'en';
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
					<MemoryRouter initialEntries={['/']}>
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
				'There are no NCI-supported clinical trials for chronic fatigue syndrome at this time.'
			)
		).toBeInTheDocument();
	});
});
