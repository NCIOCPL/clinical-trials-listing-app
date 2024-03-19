import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import PageNotFound from '../PageNotFound';
import { useStateValue } from '../../../store/store';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('../../../store/store');

describe('PageNotFound component', () => {
	it('Should show error page title ( Disease )', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const language = 'en';
		const trialListingPageType = 'Disease';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
				trialListingPageType,
			},
		]);

		render(
			<MockAnalyticsProvider>
				<PageNotFound />
			</MockAnalyticsProvider>
		);

		const expectedPageTitle = 'Page Not Found';
		expect(screen.getByText(expectedPageTitle)).toBeInTheDocument();
		const inputBox = screen.getByLabelText('Search');
		fireEvent.change(inputBox, { target: { value: 'chicken' } });
		fireEvent.click(screen.getByText('Search'));
	});

	it('Should show error page title ( Intervention )', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.cancer.gov';
		const language = 'es';
		const trialListingPageType = 'Intervention';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
				trialListingPageType,
			},
		]);

		render(
			<MockAnalyticsProvider>
				<PageNotFound />
			</MockAnalyticsProvider>
		);

		const expectedPageTitle = 'No se encontró la página';
		expect(screen.getByText(expectedPageTitle)).toBeInTheDocument();
		const inputBox = screen.getByLabelText('Buscar');
		fireEvent.change(inputBox, { target: { value: 'pollo' } });
		fireEvent.click(screen.getByText('Buscar'));
	});
});
