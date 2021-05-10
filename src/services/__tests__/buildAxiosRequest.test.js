import axios from 'axios';
import nock from 'nock';

import { buildAxiosRequest } from '../api/buildAxiosRequest';

describe('buildAxiosRequest', () => {
	const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
	const host = 'localhost';
	const port = '3000';
	const baseURL = `${protocol}://${host}:${port}/api`;
	let options = {
		headers: { 'content-type': 'application/json; charset=utf-8' },
		signal: {
			onabort: jest.fn(),
		},
	};
	axios.defaults.adapter = require('axios/lib/adapters/http');
	const axiosInstance = axios.create({
		timeout: 10000,
	});

	beforeAll(() => {
		nock.disableNetConnect();
	});

	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	/*test('200 response for a valid axios request', async () => {
		const endpoint = `/Terms/expand/Cancer.gov/Patient/en/A`;
		const query = '?size=10000';
		const init = `${baseURL}${endpoint}${query}`;
		const scope = nock(baseURL)
			.get(`${endpoint}${query}`)
			.reply(200, getFixture(`${endpoint}.json`));
		return buildAxiosRequest(axiosInstance)(init, options).then((actual) => {
			const { status } = actual;
			expect(status).toEqual(200);
			scope.done();
		});
	});*/

	/*test('200 response for a valid axios request with no headers', async () => {
		const endpoint = `/Terms/expand/Cancer.gov/Patient/en/A`;
		const query = '?size=10000';
		const init = `${baseURL}${endpoint}${query}`;
		delete options.headers;
		const scope = nock(baseURL)
			.get(`${endpoint}${query}`)
			.reply(200, getFixture(`${endpoint}.json`));
		return buildAxiosRequest(axiosInstance)(init, options).then((actual) => {
			const { status } = actual;
			expect(status).toEqual(200);
			scope.done();
		});
	});*/

	/*test('200 response on an expand axios request for a character with no results', async () => {
		const endpoint = `/Terms/expand/Cancer.gov/Patient/en/undefined`;
		const query = '?size=10000';
		const init = `${baseURL}${endpoint}${query}`;
		const expectedResponseBody = {
			meta: {
				totalResults: 0,
				from: 0,
			},
			results: [],
			links: null,
		};
		const scope = nock(baseURL)
			.get(`${endpoint}${query}`)
			.reply(200, expectedResponseBody);
		return buildAxiosRequest(axiosInstance)(init, options).then((actual) => {
			const { _bodyText, status } = actual;
			expect(status).toEqual(200);
			expect(JSON.parse(_bodyText)).toMatchObject(expectedResponseBody);
			scope.done();
		});
	});*/

	test('404 response for an invalid axios request', async () => {
		const endpoint = `/chicken/`;
		const init = `${baseURL}${endpoint}`;
		const scope = nock(baseURL).get(endpoint).reply(404);
		return buildAxiosRequest(axiosInstance)(init, options).then((actual) => {
			const { status } = actual;
			expect(status).toEqual(404);
			scope.done();
		});
	});
});
