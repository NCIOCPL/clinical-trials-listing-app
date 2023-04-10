import { act, render } from '@testing-library/react';
import axios from 'axios';
import nock from 'nock';
import React from 'react';
import { MemoryRouter, useLocation } from 'react-router';

import { useAppPaths } from '../hooks';
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

	it('BasePath route exists and matches expected route', async () => {
		const basePath = '/';
		const ctsApiHostname = 'clinicaltrialsapi.cancer.gov';
		const ctsPort = null;
		const ctsProtocol = 'https';
		const language = 'en';
		const listingApiEndpoint = 'http://localhost:3000/listing-api';
		const requestFilters = '';
		const siteName = 'National Cancer Institute';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				ctsApiHostname,
				ctsPort,
				ctsProtocol,
				language,
				listingApiEndpoint,
				requestFilters,
				siteName,
			},
		]);

		const { BasePath } = useAppPaths();

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={[BasePath()]}>
						<ComponentWithLocation RenderComponent={Manual} />
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
