import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { MockAnalyticsProvider } from '../../tracking';
import { useListingSupport } from '../../hooks';
import { useStateValue } from '../../store/store';

import CTLViewsHoC from '../CTLViewsHoC';

jest.mock('../../hooks/listingSupport/useListingSupport');
jest.mock('../../store/store');

const SINGLE_PARAM_MAP = [
	{
		paramName: 'codeOrPurl',
		textReplacementKey: 'disease',
		type: 'listing-information',
	},
];

const NO_OP_REDIRECT_PATH = () => {};

describe('CTLViewsHoc Normal Conditions', () => {
	const mockComponent = jest.fn(() => {
		return <>This would be the disease component.</>;
	});

	// This must be called before each, or else mockComponent.calls
	// will continue to accumulate across all tests.
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should have fetched info passed in as props with no others', async () => {
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

		useListingSupport.mockReturnValue({
			error: null,
			loading: false,
			payload: data,
		});

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
			},
		]);

		const WrappedComponent = CTLViewsHoC(mockComponent);

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/breast-cancer']}>
					<Routes>
						<Route path="/:codeOrPurl" element={<WrappedComponent redirectPath={NO_OP_REDIRECT_PATH} routeParamMap={SINGLE_PARAM_MAP} />} />
					</Routes>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockComponent.mock.calls[0][0]).toEqual({
			routeParamMap: SINGLE_PARAM_MAP,
			routePath: NO_OP_REDIRECT_PATH,
			data: data,
		});

		expect(useListingSupport.mock.calls[0][0]).toEqual([
			{
				type: 'name',
				payload: 'breast-cancer',
			},
		]);

		expect(screen.getByText('This would be the disease component.')).toBeInTheDocument();
	});

	it('Should have fetched info passed in as props with other props', async () => {
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

		useListingSupport.mockReturnValue({
			error: null,
			loading: false,
			payload: data,
		});

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
			},
		]);

		const WrappedComponent = CTLViewsHoC(mockComponent);

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/breast-cancer']}>
					<Routes>
						<Route path="/:codeOrPurl" element={<WrappedComponent color="blue" redirectPath={NO_OP_REDIRECT_PATH} routeParamMap={SINGLE_PARAM_MAP} />} />
					</Routes>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		// Expect the first argument of the first call to mockCOmponent
		// to match the expected props
		expect(mockComponent.mock.calls[0][0]).toEqual({
			routeParamMap: SINGLE_PARAM_MAP,
			routePath: NO_OP_REDIRECT_PATH,
			color: 'blue',
			data: data,
		});

		expect(useListingSupport.mock.calls[0][0]).toEqual([
			{
				type: 'name',
				payload: 'breast-cancer',
			},
		]);

		expect(screen.getByText('This would be the disease component.')).toBeInTheDocument();
	});

	it('Should handle multiple ids', async () => {
		const data = [
			{
				conceptId: ['C4872'],
				name: {
					label: 'Breast Cancer',
					normalized: 'breast cancer',
				},
				prettyUrlName: 'breast-cancer',
			},
			{
				conceptId: ['C4878'],
				name: {
					label: 'Lung Cancer',
					normalized: 'lung cancer',
				},
				prettyUrlName: 'lung-cancer',
			},
		];

		useListingSupport.mockReturnValue({
			error: null,
			loading: false,
			payload: data,
		});

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
			},
		]);

		const multiparam_map = [
			{
				paramName: 'codeOrPurl',
				textReplacementKey: 'disease',
				type: 'listing-information',
			},
			{
				paramName: 'otherCodeOrPurl',
				textReplacementKey: 'otherPurl',
				type: 'listing-information',
			},
		];
		const WrappedComponent = CTLViewsHoC(mockComponent);

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/breast-cancer/lung-cancer']}>
					<Routes>
						<Route path="/:codeOrPurl/:otherCodeOrPurl" element={<WrappedComponent redirectPath={NO_OP_REDIRECT_PATH} routeParamMap={multiparam_map} />} />
					</Routes>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockComponent.mock.calls[0][0]).toEqual({
			routeParamMap: multiparam_map,
			routePath: NO_OP_REDIRECT_PATH,
			data: data,
		});

		expect(useListingSupport.mock.calls[0][0]).toEqual([
			{
				type: 'name',
				payload: 'breast-cancer',
			},
			{
				type: 'name',
				payload: 'lung-cancer',
			},
		]);

		expect(screen.getByText('This would be the disease component.')).toBeInTheDocument();
	});
});

/*------------- ERROR Conditions --------------*/

describe('CTLViewsHoc Error Conditions', () => {
	const mockComponent = jest.fn(() => {
		return <>This would be the disease component.</>;
	});

	// This must be called before each, or else mockComponent.calls
	// will continue to accumulate across all tests.
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should handle 404 from API', async () => {
		const data = [null];

		useListingSupport.mockReturnValue({
			error: null,
			loading: false,
			payload: data,
		});

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
				canonicalHost: 'https://www.cancer.gov',
				language: 'en',
				trialListingPageType: 'Disease',
			},
		]);

		const WrappedComponent = CTLViewsHoC(mockComponent);

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/asdf']}>
					<Routes>
						<Route path="/:codeOrPurl" element={<WrappedComponent redirectPath={NO_OP_REDIRECT_PATH} routeParamMap={SINGLE_PARAM_MAP} />} />
					</Routes>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockComponent).not.toHaveBeenCalled();

		expect(useListingSupport.mock.calls[0][0]).toEqual([
			{
				type: 'name',
				payload: 'asdf',
			},
		]);

		const expectedPageTitle = 'Page Not Found';
		expect(screen.getByText(expectedPageTitle)).toBeInTheDocument();
	});

	it('Should handle error from API', async () => {
		useListingSupport.mockReturnValue({
			error: new Error('Some Error'),
			loading: false,
			payload: null,
		});

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
				canonicalHost: 'https://www.cancer.gov',
				language: 'en',
				trialListingPageType: 'Disease',
			},
		]);

		const WrappedComponent = CTLViewsHoC(mockComponent);

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/asdf']}>
					<Routes>
						<Route path="/:codeOrPurl" element={<WrappedComponent redirectPath={NO_OP_REDIRECT_PATH} routeParamMap={SINGLE_PARAM_MAP} />} />
					</Routes>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockComponent).not.toHaveBeenCalled();

		const expectedPageTitle = 'An error occurred. Please try again later.';
		expect(screen.getByText(expectedPageTitle)).toBeInTheDocument();
	});

	it('Should throw an error when missing routeParamMap', async () => {
		// Shut up the errors from the prop checkers and error boundary logs
		const originalError = console.error;
		console.error = jest.fn();

		useListingSupport.mockReturnValue({
			error: new Error('Some Error'),
			loading: false,
			payload: null,
		});

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
				canonicalHost: 'https://www.cancer.gov',
				language: 'en',
				trialListingPageType: 'Disease',
			},
		]);

		const WrappedComponent = CTLViewsHoC(mockComponent);

		expect(() => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/asdf']}>
						<Routes>
							<Route path="/:codeOrPurl" element={<WrappedComponent />} />
						</Routes>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		}).toThrow('You must supply a routeParamMap to your CTLViewsHoC wrapped component.');
		console.error = originalError;
	});

	it('Should throw an error when invalid param type', async () => {
		// Shut up the errors from the prop checkers and error boundary logs
		const originalError = console.error;
		console.error = jest.fn();

		useListingSupport.mockReturnValue({
			error: new Error('Some Error'),
			loading: false,
			payload: null,
		});

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
				canonicalHost: 'https://www.cancer.gov',
				language: 'en',
				trialListingPageType: 'Disease',
			},
		]);

		const error_param_map = [
			{
				paramName: 'codeOrPurl',
				textReplacementKey: 'disease',
				type: 'INVALID',
			},
		];

		const WrappedComponent = CTLViewsHoC(mockComponent);

		expect(() => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/asdf']}>
						<Routes>
							<Route path="/:codeOrPurl" element={<WrappedComponent routeParamMap={error_param_map} />} />
						</Routes>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		}).toThrow('INVALID route param type is unknown.');
		console.error = originalError;
	});
});
