import { render, waitFor } from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';
import Disease from '../Disease';
import { useStateValue } from '../../../store/store';
import { useCtsApi } from '../../../hooks/ctsApiSupport/useCtsApi';
import { useFilters } from '../../../features/filters/context/FilterContext/FilterContext';
import { useTrialSearch } from '../../../features/filters/hooks/useTrialSearch';
// import { getClinicalTrials } from '../../../services/api/actions/getClinicalTrials';
import { CTLViewsTestWrapper } from '../../../test-utils/TestWrappers';

jest.mock('../../../store/store');
jest.mock('../../../hooks/ctsApiSupport/useCtsApi');
jest.mock('../../../features/filters/context/FilterContext/FilterContext');
jest.mock('../../../features/filters/hooks/useTrialSearch');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'), // use actual for all non-hook parts
	useParams: () => ({
		codeOrPurl: 'C3037',
		type: 'supportive-care',
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
	beforeEach(() => {
		// Mock the required hooks
		useFilters.mockReturnValue({
			state: {
				appliedFilters: [],
				shouldSearch: true,
				isInitialLoad: false,
			},
			getCurrentFilters: jest.fn().mockReturnValue({}),
			isApplyingFilters: false,
			appliedZipCoords: null,
		});

		useTrialSearch.mockReturnValue({
			trials: {
				data: [],
				total: 0,
			},
			isLoading: false,
			error: null,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
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
			{
				prettyUrlName: 'supportive-care',
				idString: 'supportive_care',
				label: 'Supportive Care',
			},
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';
		const dynamicListingPatterns = {
			Disease: {
				browserTitle: '{{disease_name}} Clinical Trials',
				introText: '<p>Test intro text for {{disease_normalized}}</p>',
				metaDescription: 'Test meta description',
				noTrialsHtml: '<p>No trials available</p>',
				pageTitle: '{{disease_label}} Clinical Trials',
			},
			DiseaseTrialType: {
				browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
				introText: '<p>Test intro for {{disease_normalized}} {{trial_type_normalized}}</p>',
				metaDescription: 'Test meta description',
				noTrialsHtml: '<p>No trials available</p>',
				pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
			},
			DiseaseTrialTypeIntervention: {
				browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
				introText: '<p>Test intro</p>',
				metaDescription: 'Test meta description',
				noTrialsHtml: '<p>No trials available</p>',
				pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
			},
		};

		useCtsApi.mockReturnValue({
			error: false,
			loading: false,
			aborted: false,
			payload: {
				total: 0,
				trials: [],
			},
		});

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
			{
				paramName: 'type',
				textReplacementKey: 'trial_type',
				type: 'trial-type',
			},
		];

		const DiseaseWithData = () => {
			return <Disease routeParamMap={routeParamMap} routePath={redirectPath} data={data} />;
		};

		render(
			<CTLViewsTestWrapper initialEntries={['/chronic-fatigue-syndrome/supportive-care']}>
				<ComponentWithLocation RenderComponent={DiseaseWithData} />
			</CTLViewsTestWrapper>
		);

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=chronic-fatigue-syndrome&p2=supportive-care',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		await waitFor(
			() => {
				expect(location).toBeDefined();
			},
			{ timeout: 3000 }
		);

		await waitFor(
			() => {
				expect(location).toMatchObject(expectedLocationObject);
			},
			{ timeout: 3000 }
		);
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
			{
				prettyUrlName: 'supportive-care',
				idString: 'supportive_care',
				label: 'Supportive Care',
			},
		];
		const detailedViewPagePrettyUrlFormatter = '/clinicaltrials/{{nci_id}}';
		const title = 'NCI Clinical Trials';
		const trialListingPageType = 'Disease';
		const dynamicListingPatterns = {
			Disease: {
				browserTitle: '{{disease_name}} Clinical Trials',
				introText: '<p>Test intro text for {{disease_normalized}}</p>',
				metaDescription: 'Test meta description',
				noTrialsHtml: '<p>No trials available</p>',
				pageTitle: '{{disease_label}} Clinical Trials',
			},
			DiseaseTrialType: {
				browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
				introText: '<p>Test intro for {{disease_normalized}} {{trial_type_normalized}}</p>',
				metaDescription: 'Test meta description',
				noTrialsHtml: '<p>No trials available</p>',
				pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}}',
			},
			DiseaseTrialTypeIntervention: {
				browserTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
				introText: '<p>Test intro</p>',
				metaDescription: 'Test meta description',
				noTrialsHtml: '<p>No trials available</p>',
				pageTitle: '{{trial_type_label}} Clinical Trials for {{disease_label}} Using {{intervention_label}}',
			},
		};

		useCtsApi.mockReturnValue({
			error: false,
			loading: false,
			aborted: false,
			payload: {
				total: 0,
				trials: [],
			},
		});

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
			{
				paramName: 'type',
				textReplacementKey: 'trial_type',
				type: 'trial-type',
			},
		];

		const DiseaseWithData = () => {
			return <Disease routeParamMap={routeParamMap} routePath={redirectPath} data={data} />;
		};

		render(
			<CTLViewsTestWrapper initialEntries={['/C3037/supportive-care']}>
				<ComponentWithLocation RenderComponent={DiseaseWithData} />
			</CTLViewsTestWrapper>
		);

		const expectedLocationObject = {
			pathname: '/notrials',
			search: '?p1=C3037&p2=supportive-care',
			hash: '',
			state: {
				redirectStatus: '302',
				prerenderLocation: null,
			},
			key: expect.any(String),
		};

		await waitFor(
			() => {
				expect(location).toBeDefined();
			},
			{ timeout: 3000 }
		);

		await waitFor(
			() => {
				expect(location).toMatchObject(expectedLocationObject);
			},
			{ timeout: 3000 }
		);
	});
});
