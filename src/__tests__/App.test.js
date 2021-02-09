import { act, cleanup, render } from '@testing-library/react';
import axios from 'axios';
import nock from 'nock';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { MemoryRouter, useLocation } from 'react-router';

import { useAppPaths } from '../hooks';
import { getAxiosClient } from '../services/api/axios-client';
import { useStateValue } from '../store/store.js';
import { MockAnalyticsProvider } from '../tracking';
import Manual from '../views/Manual';

jest.mock('../store/store.js');

axios.defaults.adapter = require('axios/lib/adapters/http');

describe('App component', () => {
	let location;

	function ComponentWithLocation() {
		location = useLocation();
		return <div />;
	}

	beforeAll(() => {
		nock.disableNetConnect();
	});

	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	afterEach(cleanup);

	test('PurlPath route exists and matches expected route', async () => {
		const apiEndpoint = 'http://localhost:3000/api';
		const basePath = '/';
		const language = 'en';
		const requestFilters = '';
		const siteName = 'National Cancer Institute';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				language,
				requestFilters,
				siteName,
			},
		]);

		const { BasePath } = useAppPaths();
		const initialState = {
			apiEndpoint,
			language,
			requestFilters,
			siteName,
		};

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={[BasePath()]}>
						<ClientContextProvider client={getAxiosClient(initialState)}>
							<ComponentWithLocation RenderComponent={Manual} />
						</ClientContextProvider>
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		const expectedLocationObject = {
			pathname: '/',
			search: '',
			hash: '',
			state: null,
			key: expect.any(String),
		};

		expect(location).toMatchObject(expectedLocationObject);
	});
});
