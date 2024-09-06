import { render } from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, useLocation } from 'react-router';
import Disease from '../Disease';
import { useStateValue } from '../../../store/store';
import { MockAnalyticsProvider } from '../../../tracking';
import { useCtsApi } from '../../../hooks/ctsApiSupport/useCtsApi';
import { getClinicalTrials } from '../../../services/api/actions/getClinicalTrials';

jest.mock('../../../hooks/ctsApiSupport/useCtsApi');
jest.mock('../../../store/store');

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

	it('Should assert page is redirected to No Trials Found', async () => {
		const basePath = '/';
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
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';
		const dynamicListingPatterns = {
			Disease: {
				browserTitle: '{{disease_name}} Clinical Trials',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}.</p>',
				metaDescription: 'Find clinical trials for {{disease_normalized}}.',
				noTrialsHtml: '<p>There are currently no available trials for {{disease_normalized}}.</p>',
				pageTitle: '{{disease_label}} Clinical Trials',
			},
		};

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				detailedViewPagePrettyUrlFormatter,
				dynamicListingPatterns,
				title,
				trialListingPageType,
				apiClients: {
					clinicalTrialsSearchClient: true,
				},
			},
		]);

		const redirectPath = () => '/notrials';

		const routeParamMap = [
			{
				paramName: 'codeOrPurl',
				textReplacementKey: 'disease',
				type: 'listing-information',
			},
		];

		const DiseaseWithData = () => {
			return <Disease routeParamMap={routeParamMap} routePath={redirectPath} data={data} />;
		};

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/chronic-fatigue-syndrome']}>
					<ComponentWithLocation RenderComponent={DiseaseWithData} />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=chronic-fatigue-syndrome',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		const requestFilters = { 'diseases.nci_thesaurus_concept_id': ['C3037'] };
		const requestQuery = getClinicalTrials({
			from: 0,
			requestFilters,
			size: 50,
		});

		expect(useCtsApi.mock.calls[0][0]).toEqual(requestQuery);

		expect(location).toMatchObject(expectedLocationObject);
	});

	it('Should assert page is redirected to code when pretty URL is absent', async () => {
		const basePath = '/';
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
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';
		const dynamicListingPatterns = {
			Disease: {
				browserTitle: '{{disease_name}} Clinical Trials',
				introText: '<p>Clinical trials are research studies that involve people. The clinical trials on this list are for {{disease_normalized}}.</p>',
				metaDescription: 'Find clinical trials for {{disease_normalized}}.',
				noTrialsHtml: '<p>There are currently no available trials for {{disease_normalized}}.</p>',
				pageTitle: '{{disease_label}} Clinical Trials',
			},
		};

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				detailedViewPagePrettyUrlFormatter,
				dynamicListingPatterns,
				title,
				trialListingPageType,
				apiClients: {
					clinicalTrialsSearchClient: true,
				},
			},
		]);

		const redirectPath = () => '/notrials';

		const routeParamMap = [
			{
				paramName: 'codeOrPurl',
				textReplacementKey: 'disease',
				type: 'listing-information',
			},
		];

		const DiseaseWithData = () => {
			return <Disease routeParamMap={routeParamMap} routePath={redirectPath} data={data} />;
		};

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/C3037']}>
					<ComponentWithLocation RenderComponent={DiseaseWithData} />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=C3037',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		const requestFilters = { 'diseases.nci_thesaurus_concept_id': ['C3037'] };
		const requestQuery = getClinicalTrials({
			from: 0,
			requestFilters,
			size: 50,
		});

		expect(useCtsApi.mock.calls[0][0]).toEqual(requestQuery);

		expect(location).toMatchObject(expectedLocationObject);
	});
});
