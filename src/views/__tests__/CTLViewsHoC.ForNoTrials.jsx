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

describe('CTLViewsHoc For No Trials', () => {
	const mockComponent = jest.fn(() => {
		return <>This would be the NoTrials component.</>;
	});

	// This must be called before each, or else mockComponent.calls
	// will continue to accumulate across all tests.
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should handle single code', async () => {
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
				<MemoryRouter
					initialEntries={[
						{
							pathname: '/notrials',
							search: '?p1=breast-cancer',
						},
					]}>
					<Routes>
						<Route
							path="/notrials"
							element={
								<WrappedComponent
									redirectPath={NO_OP_REDIRECT_PATH}
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
		expect(mockComponent.mock.calls[0][0]).toEqual({
			data: data,
			routeParamMap: SINGLE_PARAM_MAP,
		});

		expect(useListingSupport.mock.calls[0][0]).toEqual([
			{
				type: 'name',
				payload: 'breast-cancer',
			},
		]);

		expect(
			screen.getByText('This would be the NoTrials component.')
		).toBeInTheDocument();
	});

	it('Should handle multiple codes', async () => {
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
				<MemoryRouter
					initialEntries={[
						{
							pathname: '/notrials',
							search: '?p1=breast-cancer&p2=lung-cancer',
						},
					]}>
					<Routes>
						<Route
							path="/notrials"
							element={
								<WrappedComponent
									redirectPath={NO_OP_REDIRECT_PATH}
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
		expect(mockComponent.mock.calls[0][0]).toEqual({
			data: data,
			routeParamMap: multiparam_map,
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

		expect(
			screen.getByText('This would be the NoTrials component.')
		).toBeInTheDocument();
	});
});
