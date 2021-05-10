import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';

import { useCustomQuery } from '../customFetch';
import { useStateValue } from '../../store/store';
import MockAnalyticsProvider from '../../tracking/mock-analytics-provider';
import { ErrorBoundary } from '../../views/ErrorBoundary';

jest.mock('../../store/store');
let wrapper;

const getSampleCallResults = ({ id }) => {
	return {
		method: 'GET',
		endpoint: `/sampleendpoint/${id}`,
	};
};

const UseCustomQuerySample = (id) => {
	const { loading, payload } = useCustomQuery(getSampleCallResults(id));
	return <>{!loading && payload && <h1>{payload.contentMessage}</h1>}</>;
};

describe('', () => {
	beforeEach(() => {
		jest.spyOn(console, 'error');
		console.error.mockImplementation(() => {});
	});

	afterEach(() => {
		console.error.mockRestore();
	});

	test('should throw an error using a non existent endpoint - English message', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.example.gov';
		const language = 'en';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
			},
		]);

		const client = {
			query: async () => ({
				error: true,
				status: 404,
				payload: {},
			}),
		};

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<ErrorBoundary>
							<UseCustomQuerySample />
						</ErrorBoundary>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});
		expect(
			screen.getByText('An error occurred. Please try again later.')
		).toBeInTheDocument();
	});

	test('should throw an error using a non existent endpoint - Spanish message', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.example.gov';
		const language = 'es';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
			},
		]);

		const client = {
			query: async () => ({
				error: true,
				status: 404,
				payload: {},
			}),
		};

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<ErrorBoundary>
							<UseCustomQuerySample />
						</ErrorBoundary>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});
		expect(
			screen.getByText(
				'Se produjo un error. Por favor, vuelva a intentar más tarde.'
			)
		).toBeInTheDocument();
	});

	test('useCustomQuery example should display content and not throw error', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.example.gov';
		const apiBaseEndpoint = 'http://localhost:3000/api';
		const contentMessage = 'Successful API call with content';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				apiBaseEndpoint,
			},
		]);

		const client = {
			query: async () => ({
				error: false,
				status: 200,
				payload: { contentMessage },
			}),
		};
		await act(async () => {
			wrapper = render(
				<MockAnalyticsProvider>
					<ClientContextProvider client={client}>
						<ErrorBoundary>
							<UseCustomQuerySample />
						</ErrorBoundary>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});
		const { getByText } = wrapper;
		expect(getByText(contentMessage)).toBeInTheDocument();
	});
});
