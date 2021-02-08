import {act, cleanup, render, screen} from '@testing-library/react';
import React from 'react';

import ErrorPage from '../ErrorPage';
import { setLanguage, setSearchEndpoint } from '../../../services/api/endpoints';
import { useStateValue } from '../../../store/store';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('../../../store/store');

describe('ErrorPage component', () => {
	beforeEach(cleanup);
	afterEach(cleanup);

	test('should show error page title ( English )', async () => {
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

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ErrorPage />
				</MockAnalyticsProvider>
			);
		});

		const expectedPageTitle = 'An error occurred. Please try again later.';
		expect(screen.getByText(expectedPageTitle)).toBeInTheDocument();
	});

	/*test('should show error page title ( Spanish )', async () => {
		const apiBaseEndpoint = 'http://localhost:3000/api';
		const basePath = '/';
		const canonicalHost = 'https://www.example.gov';
		const language = 'es';
		const services = {
			bestBets: '',
			dictionary: '',
			search: '/glossary/v1/',
		};
		setLanguage(language);
		setSearchEndpoint(services.search);

		useStateValue.mockReturnValue([
			{
				apiBaseEndpoint,
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
				services,
			},
		]);

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<ErrorPage />
				</MockAnalyticsProvider>
			);
		});
		screen.debug();
		const expectedPageTitle = 'Se produjo un error. Por favor, vuelva a intentar más tarde.';
		// expect(screen.getByText(expectedPageTitle).toBeInTheDocument());

	});*/
});
