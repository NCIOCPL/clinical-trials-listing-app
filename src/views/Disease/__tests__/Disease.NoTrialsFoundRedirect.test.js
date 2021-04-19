import { act, render } from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, useLocation } from 'react-router';
import Disease from '../Disease';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';
import { ClientContextProvider } from 'react-fetching-library';

jest.mock('../../../store/store.js');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'), // use actual for all non-hook parts
	useParams: () => ({
		codeOrPurl: 'C3037',
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

describe('<Disease />', () => {
	it('Should assert page is redirected to No Trials Found', async () => {
		const basePath = '/';
		const browserTitle = '{{disease_name}} Clinical Trials';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C3037'],
				name: {
					label: 'Chronic Fatigue Syndrome',
					normalized: 'chronic-fatigue-syndrome',
				},
				prettyUrlName: 'chronic-fatigue-syndrome',
			},
		];
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

		const DiseaseWithData = () => {
			return <Disease data={data} />;
		};

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<MemoryRouter initialEntries={['/chronic-fatigue-syndrome']}>
							<ComponentWithLocation RenderComponent={DiseaseWithData} />
						</MemoryRouter>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=chronic-fatigue-syndrome',
			hash: '',
			state: {
				listingInfo: {
					conceptId: ['C3037'],
					name: {
						label: 'Chronic Fatigue Syndrome',
						normalized: 'chronic-fatigue-syndrome',
					},
					prettyUrlName: 'chronic-fatigue-syndrome',
				},
				isNoTrialsRedirect: true,
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		expect(location).toMatchObject(expectedLocationObject);
	});

	it('Should assert page is redirected to code when pretty URL is absent', async () => {
		const basePath = '/';
		const browserTitle = '{{disease_name}} Clinical Trials';
		const canonicalHost = 'https://www.cancer.gov';
		const data = [
			{
				conceptId: ['C3037'],
				name: {
					label: 'Chronic Fatigue Syndrome',
					normalized: 'chronic-fatigue-syndrome',
				},
				prettyUrlName: null,
			},
		];
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

		const DiseaseWithData = () => {
			return <Disease data={data} />;
		};

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<MemoryRouter initialEntries={['/C3037']}>
							<ComponentWithLocation RenderComponent={DiseaseWithData} />
						</MemoryRouter>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=C3037',
			hash: '',
			state: {
				listingInfo: {
					conceptId: ['C3037'],
					name: {
						label: 'Chronic Fatigue Syndrome',
						normalized: 'chronic-fatigue-syndrome',
					},
					prettyUrlName: null,
				},
				isNoTrialsRedirect: true,
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		expect(location).toMatchObject(expectedLocationObject);
	});
});
