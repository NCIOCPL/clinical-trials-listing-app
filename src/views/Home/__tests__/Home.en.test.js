import { act, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ClientContextProvider } from 'react-fetching-library';


import Home from '../Home';
import { useStateValue } from '../../../store/store.js';
import { MockAnalyticsProvider } from '../../../tracking';


jest.mock('../../../store/store.js');

const analyticsHandler = jest.fn(() => { });
let wrapper;

describe('Home component(English)', () => {
	test('should links on home page', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.example.gov';
		const language = 'en';
		const title = 'NCI Clinical Trials';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
				title,
			},
		]);

		const { container } = render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/']}>
					<Home />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);
		expect(screen.getByText(title)).toBeInTheDocument();
		expect(container.querySelectorAll('a').length).toEqual(4);
	});

	test('should fire click event on link', async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.example.gov';
		const language = 'es';
		const title = 'NCI Clinical Trials';
		const altLanguageBasePath = '/espanol/publicaciones/diccionario';
		const siteName = "National Cancer Insitute";

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
				title,
				altLanguageBasePath,
				siteName,
			},
		]);

		await act(async () => {
			wrapper = render(
				<MockAnalyticsProvider analyticsHandler={analyticsHandler} >
					<MemoryRouter initialEntries={["/"]}>
						<Home />
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		const { container } = wrapper;
		const link = container.querySelector('a');
		fireEvent.click(link);
		expect(analyticsHandler).toHaveBeenCalled();
	});
});
