import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';

import UseCustomQuerySample from '../samples/UseCustomQuery';
import { useStateValue } from '../../store/store';
import MockAnalyticsProvider from '../../tracking/mock-analytics-provider';
import { ErrorBoundary } from '../../views/ErrorBoundary';
import { setLanguage, setAPIEndpoint } from '../../services/api/endpoints';

jest.mock('../../store/store');
let wrapper;

describe('', () => {
	beforeEach(() => {
		jest.spyOn(console, 'error');
		console.error.mockImplementation(() => { });
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
			screen.getByText('Se produjo un error. Por favor, vuelva a intentar más tarde.')
		).toBeInTheDocument();
	});

	// test('useCustomQuery example should throw error - Spanish message', async () => {
	// 	const dictionaryName = 'Cancer.gov';
	// 	const dictionaryTitle = 'Diccionario de cáncer';
	// 	const language = 'es';
	// 	setDictionaryName(dictionaryName);
	// 	setAudience('Patient');
	// 	setLanguage(language);
	// 	useStateValue.mockReturnValue([
	// 		{
	// 			altLanguageDictionaryBasePath: '/cancer-terms',
	// 			languageToggleSelector: '#LangList1 a',
	// 			appId: 'mockAppId',
	// 			canonicalHost: 'https://example.org',
	// 			basePath: '/',
	// 			dictionaryEndpoint: '/',
	// 			dictionaryName,
	// 			dictionaryTitle,
	// 			language,
	// 		},
	// 	]);
	// 	client = {
	// 		query: async () => ({
	// 			error: true,
	// 			status: 500,
	// 			payload: {},
	// 		}),
	// 	};
	// 	await act(async () => {
	// 		wrapper = render(
	// 			<MockAnalyticsProvider>
	// 				<ClientContextProvider client={client}>
	// 					<ErrorBoundary>
	// 						<UseCustomQuerySample />
	// 					</ErrorBoundary>
	// 				</ClientContextProvider>
	// 			</MockAnalyticsProvider>
	// 		);
	// 	});
	// 	const { getByText } = wrapper;
	// 	expect(getByText(i18n.errorPageText[language])).toBeInTheDocument();
	// });

	test('useCustomQuery example should display content and not throw error', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.example.gov';
		const apiBaseEndpoint = 'http://localhost:3000/api';
		const language = 'en';
		const contentMessage = 'Successful API call with content';
		const id= '6789';
		setLanguage(language);
		setAPIEndpoint(apiBaseEndpoint);

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
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
							<UseCustomQuerySample id={id} />
						</ErrorBoundary>
					</ClientContextProvider>
				</MockAnalyticsProvider>
			);
		});
		const { getByText } = wrapper;
		expect(getByText(contentMessage)).toBeInTheDocument();
	});
});
