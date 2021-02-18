import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { MemoryRouter } from 'react-router-dom';

import Manual from '../Manual';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('../../../store/store.js');

describe('<Manual />', () => {
	test('should render <NoResults /> component', async () => {
		const basePath = '/';
		const noTrialsHtml = 'There are currently no available trials.';
		const pageTitle = 'Manual Listing Page';
		const requestFilters =
			'{"diseases.nci_thesaurus_concept_id": ["chicken", "foo", "oknn"], "primary_purpose.primary_purpose_code": "treatment"}';
		const title = 'NCI Clinical Trials';
		const canonicalHost = 'https://www.cancer.gov';
		const trialListingPageType = 'Manual';
		const introText = 'Intro text';
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				introText,
				noTrialsHtml,
				pageTitle,
				requestFilters,
				title,
				canonicalHost,
				trialListingPageType,
			},
		]);

		const client = {
			query: async () => ({
				error: false,
				status: 200,
				payload: {
					total: 0,
					trials: [],
				},
			}),
		};

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<ClientContextProvider client={client}>
							<Manual />
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		expect(screen.getByText('Manual Listing Page')).toBeInTheDocument();
		expect(
			screen.getByText('There are currently no available trials.')
		).toBeInTheDocument();
	});
});
