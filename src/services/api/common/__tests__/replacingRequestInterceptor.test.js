import { replacingRequestInterceptor } from '../replacingRequestInterceptor';

describe('replacingRequestInterceptor', () => {
	test('transforms', async () => {
		const interceptor = replacingRequestInterceptor('sampleApi', {
			API_ENDPOINT: 'https://api.example.org',
		});

		const testAction = {
			interceptorName: 'sampleApi',
			method: 'GET',
			endpoint: `{{API_ENDPOINT}}/sampleendpoint/6789`,
		};

		const expected = {
			interceptorName: 'sampleApi',
			method: 'GET',
			endpoint: `https://api.example.org/sampleendpoint/6789`,
			signal: null,
		};

		const actual = await interceptor()(testAction);
		expect(actual).toEqual(expected);
	});

	test('passed through', async () => {
		const interceptor = replacingRequestInterceptor('sampleApi', {
			API_ENDPOINT: 'https://api.example.org',
		});

		const testAction = {
			interceptorName: 'should_not_match',
			method: 'GET',
			endpoint: `{{API_ENDPOINT}}/sampleendpoint/6789`,
		};

		const expected = {
			interceptorName: 'should_not_match',
			method: 'GET',
			endpoint: `{{API_ENDPOINT}}/sampleendpoint/6789`,
		};

		const actual = await interceptor()(testAction);
		expect(actual).toEqual(expected);
	});
});
