import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import Intervention from '../Intervention';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';
import { useAppPaths, useCustomQuery } from '../../../hooks';

jest.mock('../../../store/store.js');
jest.mock('../../../hooks');

const fixturePath = `/clinical-trials`;
const trastuzumabFile = `trastuzumab-response.json`;

describe('<Intervention />', () => {
	it('should render <ResultsList /> component', async () => {
		const basePath = '/';
		const browserTitle = 'Clinical Trials Using {{intervention_label}}';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C1647'],
				name: {
					label: 'Trastuzumab',
					normalized: 'trastuzumab',
				},
				prettyUrlName: 'trastuzumab',
			},
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const introText =
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying {{intervention_normalized}}.</p>';
		const metaDescription =
			'Find clinical trials using {{intervention_normalized}}.';
		const noTrialsHtml =
			'<p>There are currently no available trials using {{intervention_normalized}}.</p>';
		const pageTitle = 'Clinical Trials Using {{intervention_label}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Intervention';

		const trialResults = getFixture(`${fixturePath}/${trastuzumabFile}`);

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
						<Intervention data={data} />
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		expect(useCustomQuery).toHaveBeenCalled();

		expect(
			screen.getByText('Clinical Trials Using Trastuzumab')
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'Clinical trials are research studies that involve people. The clinical trials on this list are studying trastuzumab.'
			)
		).toBeInTheDocument();
	});
});
