import { render, screen } from '@testing-library/react';
import React from 'react';

import Intervention from '../Intervention';
import { useStateValue } from '../../../store/store';
import { useAppPaths } from '../../../hooks/routing';
import { useCtsApi } from '../../../hooks/ctsApiSupport/useCtsApi';
import { CTLViewsTestWrapper } from '../../../test-utils/TestWrappers';
jest.mock('../../../store/store');
jest.mock('../../../hooks/routing');
jest.mock('../../../hooks/ctsApiSupport/useCtsApi');

const fixturePath = `/v2/trials`;
const trastuzumabFile = `trastuzumab-response.json`;

describe('<Intervention />', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	useCtsApi.mockReturnValue({
		error: false,
		loading: false,
		aborted: false,
		payload: {
			total: 0,
			trials: [],
		},
	});

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
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying {{intervention_normalized}}.</p>',
				metaDescription: 'Find clinical trials using {{intervention_normalized}}.',
				noTrialsHtml: '<p>There are currently no available trials using {{intervention_normalized}}.</p>',
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
				apiClients: {
					clinicalTrialsSearchClient: true,
				},
			},
		]);

		useAppPaths.mockReturnValue({
			codeOrPurlPath: '/:codeOrPurl',
		});

		useCtsApi.mockReturnValue({
			error: false,
			loading: false,
			aborted: false,
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

		render(
			<CTLViewsTestWrapper initialEntries={['/']}>
				<Intervention routeParamMap={routeParamMap} routePath={redirectPath} data={data} />
			</CTLViewsTestWrapper>
		);

		//	expect(useCtsApi).toHaveBeenCalled();

		expect(screen.getByText('Clinical Trials Using Trastuzumab')).toBeInTheDocument();
		expect(screen.getByText('Clinical trials are research studies that involve people. The clinical trials on this list are studying trastuzumab.')).toBeInTheDocument();
	});
});
