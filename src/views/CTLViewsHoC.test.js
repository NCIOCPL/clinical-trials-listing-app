import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import CTLViewsHoC from './CTLViewsHoC';
import { MockAnalyticsProvider } from '../tracking';
import { useCustomQuery } from '../hooks';
import { getListingInformationById, getListingInformationByName } from '../services/api/actions';

jest.mock('../store/store.js');
jest.mock('../hooks/customFetch');

const mockComponent = jest.fn(() => { return (<>Hello World</>)});

// This must be called before each, or else mockComponent.calls
// will continue to acumulate across all tests.
beforeEach(() => {
	mockComponent.mockClear();
});

describe('CTLViewsHoc', () => {
	test('Should have fetched info passed in as props with no others', async () => {
		const data = {
			conceptId: ['C4872'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer',
			},
			prettyUrlName: 'breast-cancer',
		};

		useCustomQuery.mockReturnValue({
			error: false,
			loading: false,
			status: 200,
			payload: data,
		});

		const WrappedComponent = CTLViewsHoC(mockComponent);

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<WrappedComponent />
					</MemoryRouter>
				</MockAnalyticsProvider>
			)
		});

		// Expect the first argument of the first call to mockCOmponent
		// to match the expected props
		expect(mockComponent.mock.calls[0][0]).toEqual({
			data: data,
		});
	});

	test('Should have fetched info passed in as props with other props', async () => {
		const data = {
			conceptId: ['C4872'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer',
			},
			prettyUrlName: 'breast-cancer',
		};

		useCustomQuery.mockReturnValue({
			error: false,
			loading: false,
			status: 200,
			payload: data,
		});

		const WrappedComponent = CTLViewsHoC(mockComponent);

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<WrappedComponent color="blue" />
					</MemoryRouter>
				</MockAnalyticsProvider>
			)
		});

		// Expect the first argument of the first call to mockCOmponent
		// to match the expected props
		expect(mockComponent.mock.calls[0][0]).toEqual({
			color: 'blue',
			data: data,
		});
	});
})
