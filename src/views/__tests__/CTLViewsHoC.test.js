import { act, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import CTLViewsHoC from '../CTLViewsHoC';
import { MockAnalyticsProvider } from '../../tracking';
import { useCustomQuery } from '../../hooks';
import { useStateValue } from '../../store/store';

jest.mock('../../hooks/customFetch');
jest.mock('../../store/store.js');

const mockComponent = jest.fn(() => {
	return <>Hello World</>;
});

// This must be called before each, or else mockComponent.calls
// will continue to accumulate across all tests.
beforeEach(() => {
	mockComponent.mockClear();
});

describe('CTLViewsHoc', () => {
	it('Should have fetched info passed in as props with no others', async () => {
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

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
			},
		]);

		const WrappedComponent = CTLViewsHoC(mockComponent);

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<WrappedComponent />
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		// Expect the first argument of the first call to mockCOmponent
		// to match the expected props
		expect(mockComponent.mock.calls[0][0]).toEqual({
			data: data,
		});
	});

	it('Should have fetched info passed in as props with other props', async () => {
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

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
			},
		]);

		const WrappedComponent = CTLViewsHoC(mockComponent);

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<WrappedComponent color="blue" />
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		// Expect the first argument of the first call to mockCOmponent
		// to match the expected props
		expect(mockComponent.mock.calls[0][0]).toEqual({
			color: 'blue',
			data: data,
		});
	});
});
