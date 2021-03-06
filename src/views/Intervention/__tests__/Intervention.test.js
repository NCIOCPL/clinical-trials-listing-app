import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import Intervention from '../Intervention';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';
import { useAppPaths, useCustomQuery } from '../../../hooks';

jest.mock('../../../store/store.js');
jest.mock('../../../hooks');

const fixturePath = `/v1/clinical-trials`;
const trastuzumabFile = `trastuzumab-response.json`;

describe('<Intervention />', () => {
	it('should render <ResultsList /> component', async () => {
		const basePath = '/';
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
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Intervention';
		const dynamicListingPatterns = {
			Intervention: {
				browserTitle: 'Clinical Trials Using {{intervention_label}}',
				introText:
					'<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying {{intervention_normalized}}.</p>',
				metaDescription:
					'Find clinical trials using {{intervention_normalized}}.',
				noTrialsHtml:
					'<p>There are currently no available trials using {{intervention_normalized}}.</p>',
				pageTitle: 'Clinical Trials Using {{intervention_label}}',
			},
		};

		const trialResults = getFixture(`${fixturePath}/${trastuzumabFile}`);

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
			codeOrPurlPath: '/:codeOrPurl',
		});

		useCustomQuery.mockReturnValue({
			error: false,
			loading: false,
			status: 200,
			payload: trialResults,
		});

		const redirectPath = () => '/notrials';
		const routeParamMap = [
			{
				paramName: 'codeOrPurl',
				textReplacementKey: 'disease',
				type: 'listing-information',
			},
		];

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<Intervention
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
			screen.getByText('Clinical Trials Using Trastuzumab')
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'Clinical trials are research studies that involve people. The clinical trials on this list are studying trastuzumab.'
			)
		).toBeInTheDocument();
	});
});
