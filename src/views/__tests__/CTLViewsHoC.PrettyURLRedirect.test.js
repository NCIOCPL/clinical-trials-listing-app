import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, useNavigate } from 'react-router';

import { MockAnalyticsProvider } from '../../tracking';
import { useListingSupport } from '../../hooks';
import { useStateValue } from '../../store/store.js';

import CTLViewsHoC from '../CTLViewsHoC';

jest.mock('../../hooks/listingSupport/useListingSupport');
jest.mock('../../store/store.js');
// Create our mock for checking if navigate was called correctly.
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'), // use actual for all non-hook parts
	useNavigate: () => mockNavigate,
	useParams: () => ({
		codeOrPurl: 'C4872',
	}),
	useLocation: () => ({
		pathname: '/C4872',
		search: '',
		hash: '',
		state: null,
	}),
}));

describe('CTLViewsHoc redirect', () => {
	const mockComponent = jest.fn(() => {
		return <>This would be the disease component.</>;
	});

	// This must be called before each, or else mockComponent.calls
	// will continue to accumulate across all tests.
	beforeEach(() => {
		mockNavigate.mockClear();
		mockComponent.mockClear();
	});

	it('Should handle a redirect', async () => {
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
				<MemoryRouter initialEntries={['/C4872']}>
					<Route path="/:codeOrPurl" element={<WrappedComponent />} />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);
		console.log(mockNavigate.mock);
		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockNavigate.mock.calls[0][0]).toEqual(
			'/breast-cancer?redirect=true'
		);
		expect(mockNavigate.mock.calls[0][1]).toBeTruthy();

		// TODO: Expect useListingSupport to be called correctly
	});
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
