import { act, render } from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, useLocation } from 'react-router';
import Intervention from '../Intervention';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';
import { ClientContextProvider } from 'react-fetching-library';

jest.mock('../../../store/store.js');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'), // use actual for all non-hook parts
	useParams: () => ({
		codeOrPurl: 'C1234',
	}),
}));

let location;

function ComponentWithLocation({ RenderComponent }) {
	location = useLocation();
	return <RenderComponent />;
}

ComponentWithLocation.propTypes = {
	RenderComponent: PropTypes.func,
};

describe('<Intervention />', () => {
	it('Should assert page is redirected to No Trials Found', async () => {
		const basePath = '/';
		const browserTitle = 'Clinical Trials Using {{intervention_label}}';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C1234'],
				name: {
					label: 'Spiroplatin',
					normalized: 'spiroplatin',
				},
				prettyUrlName: 'spiroplatin',
			},
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const introText =
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying {{intervention_normalized}}.</p>';
		const metaDescription =
			'Find clinical trials for {{intervention_normalized}}.';
		const noTrialsHtml =
			'<p>There are currently no available trials for {{intervention_normalized}}.</p>';
		const pageTitle = '{{intervention_label}} Clinical Trials';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Intervention';

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

		const InterventionWithData = () => {
			return <Intervention data={data} />;
		};

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<MemoryRouter initialEntries={['/spiroplatin']}>
							<ComponentWithLocation RenderComponent={InterventionWithData} />
						</MemoryRouter>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=spiroplatin',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		expect(location).toMatchObject(expectedLocationObject);
	});

	it('Should assert page is redirected to code when pretty URL is absent', async () => {
		const basePath = '/';
		const browserTitle = 'Clinical Trials Using {{intervention_name}}';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C1234'],
				name: {
					label: 'Spiroplatin',
					normalized: 'spiroplatin',
				},
				prettyUrlName: null,
			},
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const introText =
			'<p>Clinical trials are research studies that involve people. The clinical trials on this list are studying {{intervention_normalized}}.</p>';
		const metaDescription =
			'Find clinical trials for {{intervention_normalized}}.';
		const noTrialsHtml =
			'<p>There are currently no available trials for {{intervention_normalized}}.</p>';
		const pageTitle = '{{intervention_label}} Clinical Trials';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Intervention';

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

		const InterventionWithData = () => {
			return <Intervention data={data} />;
		};

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<MemoryRouter initialEntries={['/C1234']}>
							<ComponentWithLocation RenderComponent={InterventionWithData} />
						</MemoryRouter>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=C1234',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		expect(location).toMatchObject(expectedLocationObject);
	});
});
