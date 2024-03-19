import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import Intervention from '../Intervention';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import { useStateValue } from '../../../store/store';
import { MockAnalyticsProvider } from '../../../tracking';
import { useAppPaths } from '../../../hooks/routing';
import { useCtsApi } from '../../../hooks/ctsApiSupport/useCtsApi';

jest.mock('../../../store/store');
jest.mock('../../../hooks/routing');
jest.mock('../../../hooks/ctsApiSupport/useCtsApi');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		foo: 'bar',
	}),
}));

describe('<Intervention />', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should throw on unknown param', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C4872'],
				name: {
					label: 'Breast Cancer',
					normalized: 'breast cancer',
				},
				prettyUrlName: 'breast-cancer',
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
				apiClients: {
					clinicalTrialsSearchClient: true,
				},
				language: 'en',
			},
		]);

		useAppPaths.mockReturnValue({
			codeOrPurlPath: '/:codeOrPurl',
		});

		useCtsApi.mockReturnValue({
			error: new Error('Bad Mojo'),
			loading: false,
			aborted: false,
			payload: null,
		});

		const redirectPath = () => '/notrials';

		const routeParamMap = [
			{
				paramName: 'chicken',
				textReplacementKey: 'Intervention',
				type: 'listing-information',
			},
		];

		render(
			<MockAnalyticsProvider>
				<ErrorBoundary>
					<MemoryRouter initialEntries={['/C4872']}>
						<Intervention
							routeParamMap={routeParamMap}
							routePath={redirectPath}
							data={data}
						/>
					</MemoryRouter>
				</ErrorBoundary>
			</MockAnalyticsProvider>
		);

		expect(useCtsApi).not.toHaveBeenCalled();

		expect(
			screen.getByText('An error occurred. Please try again later.')
		).toBeInTheDocument();
	});
});
