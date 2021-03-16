import { act, cleanup, render } from '@testing-library/react';
import axios from 'axios';
import nock from 'nock';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { MemoryRouter, useLocation } from 'react-router';

import { useAppPaths } from '../hooks';
import { getAxiosClient } from '../services/api/common';
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

	test('BasePath route exists and matches expected route', async () => {
		const basePath = '/';
		const language = 'en';
		const listingApiEndpoint = 'http://localhost:3000/listing-api';
		const requestFilters = '';
		const siteName = 'National Cancer Institute';
		const trialsApiEndpoint = 'http://localhost:3000/trials-api';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				language,
				listingApiEndpoint,
				requestFilters,
				siteName,
				trialsApiEndpoint,
			},
		]);

		const { BasePath } = useAppPaths();

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={[BasePath()]}>
						<ClientContextProvider client={getAxiosClient([])}>
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
