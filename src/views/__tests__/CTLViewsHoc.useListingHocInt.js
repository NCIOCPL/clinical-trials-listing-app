/* This is not exactly an unit test, it is more of an integration test.
 * However, this is really testing of CTLViewHoc + useListingSupport, but
 * with fake components. These two items really go hand in hand with each
 * other. We found that when multiple calls are made the previous logic
 * was messing up between 2 calls as the tests were only checking initial
 * calls.
 *
 * So for all these test we do not want to mock useListingSupport, but
 * we want to mock the API calls it makes. We then want to ensure that
 * the mockComponent is correctly called.
 */
import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router';
import {
	ListingSupportCache,
	ListingSupportContext,
} from '../../hooks/listingSupport';
import { MockAnalyticsProvider } from '../../tracking';

import { useStateValue } from '../../store/store';
import { getListingInformationById } from '../../services/api/trial-listing-support-api/getListingInformationById';
import { getListingInformationByName } from '../../services/api/trial-listing-support-api/getListingInformationByName';
import { getTrialType } from '../../services/api/trial-listing-support-api/getTrialType';

import CTLViewsHoC from '../CTLViewsHoC';

jest.mock('../../store/store');
jest.mock(
	'../../services/api/trial-listing-support-api/getListingInformationById'
);
jest.mock(
	'../../services/api/trial-listing-support-api/getListingInformationByName'
);

jest.mock('../../services/api/trial-listing-support-api/getTrialType');

describe('CTLViewsHoc & useListingSupport integration', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// This will work for now because we don't care it is
	// an axios instance. When we add in aborting, we will
	// very much care.
	useStateValue.mockReturnValue([
		{
			appId: 'mockAppId',
			apiClients: { trialListingSupportClient: true },
			basePath: '/',
		},
	]);

	// Currently, while there are no tests for it,
	// a full param map will be filtered down to
	// only those parameters that exist in memory.
	// So we should be able to handle this for all of
	// our tests.
	const diseaseRouteParamMap = [
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
		{
			paramName: 'interCodeOrPurl',
			textReplacementKey: 'intervention',
			type: 'listing-information',
		},
	];

	// Let's set up some API responses that we are going to reuse all over
	// the place, which is end up being hard to read.
	const CONCEPT_BREAST_CANCER = {
		conceptId: ['C4872'],
		name: {
			label: 'Breast Cancer',
			normalized: 'breast cancer',
		},
		prettyUrlName: 'breast-cancer',
	};

	const CONCEPT_MULTI_ID = {
		conceptId: ['C1111', 'C2222'],
		name: {
			label: 'Multi-id Concept',
			normalized: 'multi-id concept',
		},
		prettyUrlName: 'multi-id-concept',
	};

	const CONCEPT_NO_PURL = {
		conceptId: ['C99999'],
		name: {
			label: 'No Purl Concept',
			normalized: 'no purl concept',
		},
		prettyUrlName: null,
	};

	const TRIAL_TYPE_TREATMENT = {
		prettyUrlName: 'treatment',
		idString: 'treatment',
		label: 'Treatment',
	};

	/**
	 * Let's handle our default goto for redirecting from the ugly URL
	 * to the pretty URL based on name for a single param.
	 */
	it('handles navigation from ID to Name', async () => {
		getListingInformationById.mockReturnValue(CONCEPT_BREAST_CANCER);

		// We use RedirectPath to figure out the correct route for
		// a redirect. This assumes /:codeOrPurl which matches our
		// route below.
		const mockRedirectPath = jest.fn().mockReturnValue('/breast-cancer');

		const mockComponent = jest.fn(() => {
			return <>This would be the disease component.</>;
		});

		const WrappedComponent = CTLViewsHoC(mockComponent);

		// Hopefully this renders, and navigates and loads the
		// new component.
		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ListingSupportContext.Provider
						value={{ cache: new ListingSupportCache() }}>
						<MemoryRouter initialEntries={['/C4872']}>
							<Routes>
								<Route
									path="/:codeOrPurl"
									element={
										<WrappedComponent
											redirectPath={mockRedirectPath}
											routeParamMap={diseaseRouteParamMap}
										/>
									}
								/>
							</Routes>
						</MemoryRouter>
					</ListingSupportContext.Provider>
				</MockAnalyticsProvider>
			);
		});

		// Initial Call
		expect(getListingInformationById.mock.calls).toHaveLength(1);
		expect(getListingInformationById.mock.calls[0][1]).toEqual(['C4872']);

		// Redirect call
		expect(getListingInformationByName.mock.calls).toHaveLength(0);

		// There should only be 1 call to our component as the HoC would have:
		// Fetched the ID, then redirected, then fetched the second, then it
		// would render our wrapped component.
		expect(mockComponent.mock.calls).toHaveLength(1);
		const { data: call1data } = mockComponent.mock.calls[0][0];

		expect(call1data).toEqual([CONCEPT_BREAST_CANCER]);
	});

	it('should handle going to no trials', async () => {
		getListingInformationById.mockImplementation((client, ids) => {
			if (ids.includes('C99999')) {
				return CONCEPT_NO_PURL;
			}
		});

		// This should not get called.
		const mockRedirectPath = jest.fn().mockImplementationOnce(() => {
			throw new Error(
				'I should not be getting called here, but this is required.'
			);
		});

		const mockComponentConcept = jest.fn(() => {
			const navigate = useNavigate();
			useEffect(() => {
				navigate('/notrials?p1=C99999', {
					replace: true,
				});
			}, []);
			return <></>;
		});

		const mockNoTrials = jest.fn(() => {
			return <>This would be the disease + type component.</>;
		});

		const WrappedComponentConcept = CTLViewsHoC(mockComponentConcept);
		const WrappedComponentConceptNoTrials = CTLViewsHoC(mockNoTrials);

		// Hopefully this renders, and navigates and loads the
		// new component.
		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ListingSupportContext.Provider
						value={{ cache: new ListingSupportCache() }}>
						<MemoryRouter initialEntries={['/C99999']}>
							<Routes>
								<Route
									path="/:codeOrPurl"
									element={
										<WrappedComponentConcept
											redirectPath={mockRedirectPath}
											routeParamMap={diseaseRouteParamMap}
										/>
									}
								/>
								<Route
									path="/notrials"
									element={
										<WrappedComponentConceptNoTrials
											redirectPath={mockRedirectPath}
											routeParamMap={diseaseRouteParamMap}
										/>
									}
								/>
							</Routes>
						</MemoryRouter>
					</ListingSupportContext.Provider>
				</MockAnalyticsProvider>
			);
		});

		// Total API calls for first render, and redirect
		expect(getListingInformationById.mock.calls).toHaveLength(1);
		expect(getListingInformationById.mock.calls[0][1]).toEqual(['C99999']);

		// The mock component should only be called once as that would
		// only be when the redirects have stopped. So 2 calls with a
		// null is wrong.
		expect(mockComponentConcept.mock.calls).toHaveLength(1);
		const { data: conceptData } = mockComponentConcept.mock.calls[0][0];
		expect(mockNoTrials.mock.calls).toHaveLength(1);
		const { data: conceptTypeData } = mockNoTrials.mock.calls[0][0];

		expect(conceptData).toEqual([CONCEPT_NO_PURL]);

		expect(conceptTypeData).toEqual([CONCEPT_NO_PURL]);
	});

	/**
	 * Let's handle our redirect when we only have 1 URL to handle
	 */
	it('handles navigation from ID to Name with only 1 pretty url', async () => {
		getListingInformationById.mockImplementation((client, ids) => {
			if (ids.includes('C1111') || ids.includes('C2222')) {
				return CONCEPT_MULTI_ID;
			} else if (ids.includes('C99999')) {
				return CONCEPT_NO_PURL;
			}
		});

		getListingInformationByName.mockImplementation((client, name) => {
			if (name === 'multi-id-concept') {
				return CONCEPT_MULTI_ID;
			}
		});

		getTrialType.mockImplementation((client, trialType) => {
			if (trialType === 'treatment') {
				return TRIAL_TYPE_TREATMENT;
			}
		});

		// We use RedirectPath to figure out the correct route for
		// a redirect. This assumes /:codeOrPurl which matches our
		// route below.
		const mockRedirectPath = jest
			.fn()
			.mockReturnValue('/C99999/treatment/multi-id-concept');

		const mockComponent = jest.fn(() => {
			return <>This would be the disease component.</>;
		});

		const WrappedComponent = CTLViewsHoC(mockComponent);

		// Hopefully this renders, and navigates and loads the
		// new component.
		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ListingSupportContext.Provider
						value={{ cache: new ListingSupportCache() }}>
						<MemoryRouter initialEntries={['/C99999/treatment/C2222']}>
							<Routes>
								<Route
									path="/:codeOrPurl/:type/:interCodeOrPurl"
									element={
										<WrappedComponent
											redirectPath={mockRedirectPath}
											routeParamMap={diseaseRouteParamMap}
										/>
									}
								/>
							</Routes>
						</MemoryRouter>
					</ListingSupportContext.Provider>
				</MockAnalyticsProvider>
			);
		});

		// Total API calls for first render, and redirect
		expect(getListingInformationById.mock.calls).toHaveLength(2);
		expect(getTrialType.mock.calls).toHaveLength(1);
		expect(getListingInformationByName.mock.calls).toHaveLength(0);

		// First render API Calls
		expect(getListingInformationById.mock.calls[0][1]).toEqual(['C99999']);
		expect(getListingInformationById.mock.calls[1][1]).toEqual(['C2222']);
		expect(getTrialType.mock.calls[0][1]).toEqual('treatment');

		// There should only be 1 call to our component as the HoC would have:
		// Fetched the ID, then redirected, then fetched the second, then it
		// would render our wrapped component.
		expect(mockComponent.mock.calls).toHaveLength(1);
		const { data: call1data } = mockComponent.mock.calls[0][0];

		expect(call1data).toEqual([
			CONCEPT_NO_PURL,
			TRIAL_TYPE_TREATMENT,
			CONCEPT_MULTI_ID,
		]);
	});

	// For both of these tests, your wrapped component would have to explicitly
	// call a navigate function. In these examples it is expected that the
	// wrapped component would actually, and correctly, be called twice.
	// These tests should not trigger a redirect based on ID.

	// TODO: Add a test for one ID to another.
	it('should handle the request for a concept, and then handle a navigate to another concept', async () => {
		getListingInformationByName.mockReturnValueOnce(CONCEPT_BREAST_CANCER);

		getListingInformationById.mockReturnValueOnce(CONCEPT_NO_PURL);

		// We use RedirectPath to figure out the correct route for
		// a redirect. This assumes /:codeOrPurl which matches our
		// route below.
		const mockRedirectPath = jest.fn().mockImplementationOnce(() => {
			throw new Error(
				'I should not be getting called here, but this is required.'
			);
		});

		// This component will force a navigation
		const mockComponent = jest.fn(({ data }) => {
			const navigate = useNavigate();
			useEffect(() => {
				// Only navigate if the concept is our first one.
				if (data.some((concept) => concept.conceptId.includes('C4872'))) {
					navigate('/C99999', {
						replace: true,
					});
				}
			}, []);
			return <></>;
		});

		const WrappedComponent = CTLViewsHoC(mockComponent);

		// Hopefully this renders, and navigates and loads the
		// new component.
		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ListingSupportContext.Provider
						value={{ cache: new ListingSupportCache() }}>
						<MemoryRouter initialEntries={['/breast-cancer']}>
							<Routes>
								<Route
									path="/:codeOrPurl"
									element={
										<WrappedComponent
											redirectPath={mockRedirectPath}
											routeParamMap={diseaseRouteParamMap}
										/>
									}
								/>
							</Routes>
						</MemoryRouter>
					</ListingSupportContext.Provider>
				</MockAnalyticsProvider>
			);
		});

		// First request
		expect(getListingInformationByName.mock.calls).toHaveLength(1);
		expect(getListingInformationByName.mock.calls[0][1]).toEqual(
			'breast-cancer'
		);

		// Call after redirect
		expect(getListingInformationById.mock.calls).toHaveLength(1);
		expect(getListingInformationById.mock.calls[0][1]).toEqual(['C99999']);

		// This should have only 2 calls. One for the Purl, and one
		// for the C-code without the purl.
		expect(mockComponent.mock.calls).toHaveLength(2);
		const { data: call1data } = mockComponent.mock.calls[0][0];
		const { data: call2data } = mockComponent.mock.calls[1][0];

		expect(call1data).toEqual([CONCEPT_BREAST_CANCER]);

		expect(call2data).toEqual([CONCEPT_NO_PURL]);
	});

	// TODO: Add a test for route with 1 param to a route with 2 params
	it('should handle the request for a concept, and then handle a navigate to concept plus type', async () => {
		getListingInformationById.mockImplementation((client, ids) => {
			if (ids.includes('C99999')) {
				return CONCEPT_NO_PURL;
			}
		});

		getTrialType.mockImplementation((client, trialType) => {
			if (trialType === 'treatment') {
				return TRIAL_TYPE_TREATMENT;
			}
		});

		// This should not get called.
		const mockRedirectPath = jest.fn().mockImplementationOnce(() => {
			throw new Error(
				'I should not be getting called here, but this is required.'
			);
		});

		const mockComponentConcept = jest.fn(() => {
			const navigate = useNavigate();
			useEffect(() => {
				navigate('/C99999/treatment', {
					replace: true,
				});
			}, []);
			return <></>;
		});

		const mockComponentConceptPlusType = jest.fn(() => {
			return <>This would be the disease + type component.</>;
		});

		const WrappedComponentConcept = CTLViewsHoC(mockComponentConcept);
		const WrappedComponentConceptPlusType = CTLViewsHoC(
			mockComponentConceptPlusType
		);

		// Hopefully this renders, and navigates and loads the
		// new component.
		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ListingSupportContext.Provider
						value={{ cache: new ListingSupportCache() }}>
						<MemoryRouter initialEntries={['/C99999']}>
							<Routes>
								<Route
									path="/:codeOrPurl"
									element={
										<WrappedComponentConcept
											redirectPath={mockRedirectPath}
											routeParamMap={diseaseRouteParamMap}
										/>
									}
								/>
								<Route
									path="/:codeOrPurl/:type"
									element={
										<WrappedComponentConceptPlusType
											redirectPath={mockRedirectPath}
											routeParamMap={diseaseRouteParamMap}
										/>
									}
								/>
							</Routes>
						</MemoryRouter>
					</ListingSupportContext.Provider>
				</MockAnalyticsProvider>
			);
		});

		// Total API calls for first render, and redirect
		expect(getListingInformationById.mock.calls).toHaveLength(1);
		expect(getTrialType.mock.calls).toHaveLength(1);

		// First render API Calls
		expect(getListingInformationById.mock.calls[0][1]).toEqual(['C99999']);

		// After redirect API Calls
		expect(getTrialType.mock.calls[0][1]).toEqual('treatment');

		// The mock component should only be called once as that would
		// only be when the redirects have stopped. So 2 calls with a
		// null is wrong.
		expect(mockComponentConcept.mock.calls).toHaveLength(1);
		const { data: conceptData } = mockComponentConcept.mock.calls[0][0];
		expect(mockComponentConceptPlusType.mock.calls).toHaveLength(1);
		const { data: conceptTypeData } =
			mockComponentConceptPlusType.mock.calls[0][0];

		expect(conceptData).toEqual([CONCEPT_NO_PURL]);

		expect(conceptTypeData).toEqual([CONCEPT_NO_PURL, TRIAL_TYPE_TREATMENT]);
	});
});
