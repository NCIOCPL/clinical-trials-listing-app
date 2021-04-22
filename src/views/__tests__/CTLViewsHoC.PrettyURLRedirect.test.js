import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

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
}));

const SINGLE_PARAM_MAP = [
	{
		paramName: 'codeOrPurl',
		textReplacementKey: 'disease',
		type: 'listing-information',
	},
];

describe('CTLViewsHoc redirect', () => {
	const mockComponent = jest.fn(() => {
		return <>This would be the disease component.</>;
	});

	// This must be called before each, or else mockComponent.calls
	// will continue to accumulate across all tests.
	afterEach(() => {
		jest.clearAllMocks();
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

		const mockRedirectPath = jest.fn().mockReturnValue('/breast-cancer');

		const WrappedComponent = CTLViewsHoC(mockComponent);

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/C4872']}>
					<Routes>
						<Route
							path="/:codeOrPurl"
							element={
								<WrappedComponent
									redirectPath={mockRedirectPath}
									routeParamMap={SINGLE_PARAM_MAP}
								/>
							}
						/>
					</Routes>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);
		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockNavigate.mock.calls[0][0]).toEqual(
			'/breast-cancer?redirect=true'
		);
		expect(mockNavigate.mock.calls[0][1]).toBeTruthy();

		expect(useListingSupport.mock.calls[0][0]).toEqual([
			{
				type: 'id',
				payload: ['C4872'],
			},
		]);

		expect(mockRedirectPath.mock.calls[0][0]).toEqual({
			codeOrPurl: 'breast-cancer',
		});
	});

	it('Should handle a redirect when only one param must be a redirect', async () => {
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
				conceptId: ['C99999', 'C1111111'],
				name: {
					label: 'Made Up',
					normalized: 'made up',
				},
				prettyUrlName: null,
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

		const mockRedirectPath = jest
			.fn()
			.mockReturnValue('/breast-cancer/C99999,C1111111');

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
				<MemoryRouter initialEntries={['/C4872/C99999,C1111111']}>
					<Routes>
						<Route
							path="/:codeOrPurl/:otherCodeOrPurl"
							element={
								<WrappedComponent
									redirectPath={mockRedirectPath}
									routeParamMap={multiparam_map}
								/>
							}
						/>
					</Routes>
				</MemoryRouter>
			</MockAnalyticsProvider>
		);
		// Expect the first argument of the first call to mockComponent
		// to match the expected props
		expect(mockNavigate.mock.calls[0][0]).toEqual(
			'/breast-cancer/C99999,C1111111?redirect=true'
		);
		expect(mockNavigate.mock.calls[0][1]).toBeTruthy();

		expect(useListingSupport.mock.calls[0][0]).toEqual([
			{
				type: 'id',
				payload: ['C4872'],
			},
			{
				type: 'id',
				payload: ['C99999', 'C1111111'],
			},
		]);

		expect(mockRedirectPath.mock.calls[0][0]).toEqual({
			codeOrPurl: 'breast-cancer',
			otherCodeOrPurl: 'C99999,C1111111',
		});
	});
});