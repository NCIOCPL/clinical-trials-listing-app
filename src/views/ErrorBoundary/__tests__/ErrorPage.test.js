import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import ErrorPage from '../ErrorPage';
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
});
