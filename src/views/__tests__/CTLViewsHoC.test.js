import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { MockAnalyticsProvider } from '../../tracking';
import { useListingSupport } from '../../hooks';
import { useStateValue } from '../../store/store.js';

import CTLViewsHoC from '../CTLViewsHoC';

jest.mock('../../hooks/listingSupport/useListingSupport');
jest.mock('../../store/store.js');

describe('CTLViewsHoc Normal Conditions', () => {
	const mockComponent = jest.fn(() => {
		return <>This would be the disease component.</>;
	});

	// This must be called before each, or else mockComponent.calls
	// will continue to accumulate across all tests.
	beforeEach(() => {
		mockComponent.mockClear();
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
					<Route path="/:codeOrPurl" element={<WrappedComponent />} />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockComponent.mock.calls[0][0]).toEqual({
			data: data,
		});

		expect(
			screen.getByText('This would be the disease component.')
		).toBeInTheDocument();
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
					<Route
						path="/:codeOrPurl"
						element={<WrappedComponent color="blue" />}
					/>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		// Expect the first argument of the first call to mockCOmponent
		// to match the expected props
		expect(mockComponent.mock.calls[0][0]).toEqual({
			color: 'blue',
			data: data,
		});

		expect(
			screen.getByText('This would be the disease component.')
		).toBeInTheDocument();
	});

	// TODO: It should handle multiple IDs
});

/*------------- ERROR Conditions --------------*/

describe('CTLViewsHoc Error Conditions', () => {
	const mockComponent = jest.fn(() => {
		return <>This would be the disease component.</>;
	});

	// This must be called before each, or else mockComponent.calls
	// will continue to accumulate across all tests.
	beforeEach(() => {
		mockComponent.mockClear();
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
					<Route path="/:codeOrPurl" element={<WrappedComponent />} />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockComponent).not.toHaveBeenCalled();

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
					<Route path="/:codeOrPurl" element={<WrappedComponent />} />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);

		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockComponent).not.toHaveBeenCalled();

		const expectedPageTitle = 'An error occurred. Please try again later.';
		expect(screen.getByText(expectedPageTitle)).toBeInTheDocument();
	});
});
