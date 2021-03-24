import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import Disease from '../Disease';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';
import { useAppPaths, useCustomQuery } from '../../../hooks';

jest.mock('../../../store/store.js');
jest.mock('../../../hooks');

const fixturePath = `/clinical-trials`;
const breastCancerFile = `breast-cancer-response.json`;

describe('<Disease />', () => {
	test('should render <NoResults /> component', async () => {
		const basePath = '/';
		const browserTitle = '{{disease_name}} Clinical Trials';
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
		const introText =
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}.</p>';
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
				metaDescription,
				noTrialsHtml,
				pageTitle,
				title,
				trialListingPageType,
			},
		]);

		useAppPaths.mockReturnValue('/C4872');

		useCustomQuery.mockReturnValue({
			error: false,
			loading: false,
			status: 200,
			payload: {
				total: 0,
				trials: [],
			},
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

		expect(
			screen.getByText('Breast Cancer Clinical Trials')
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'There are currently no available trials for {{disease_normalized}}.'
			)
		).toBeInTheDocument();
	});

	test('should render <ResultsList /> component', async () => {
		const basePath = '/';
		const browserTitle = '{{disease_name}} Clinical Trials';
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
		const introText =
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}.</p>';
		const metaDescription = 'Find clinical trials for {{disease_normalized}}.';
		const noTrialsHtml =
			'<p>There are currently no available trials for {{disease_normalized}}.</p>';
		const pageTitle = '{{disease_label}} Clinical Trials';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';

		const trialResults = getFixture(`${fixturePath}/${breastCancerFile}`);

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				browserTitle,
				canonicalHost,
				detailedViewPagePrettyUrlFormatter,
				introText,
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
