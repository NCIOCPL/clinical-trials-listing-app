import nock from 'nock';
import { getTrialType, default as factory } from '../';

describe('Get trial type information', () => {
	beforeAll(() => {
		nock.disableNetConnect();
	});

	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	const client = factory('http://example.org');

	it('should return expected response with valid trial type', async () => {
		const expected = {
			prettyUrlName: 'treatment',
			idString: 'treatment',
			label: 'Treatment',
		};

		const scope = nock('http://example.org')
			.get('/trial-type/treatment')
			.reply(200, expected);

		const actual = await getTrialType(client, 'treatment');

		expect(actual).toEqual(expected);
		scope.isDone();
	});

	it('should return expected response with valid trial type when given idString', async () => {
		const expected = {
			prettyUrlName: 'health-services-research',
			idString: 'health_services_research',
			label: 'Health Services Research',
		};

		const scope = nock('http://example.org')
			.get('/trial-type/health_services_research')
			.reply(200, expected);

		const actual = await getTrialType(client, 'health_services_research');

		expect(actual).toEqual(expected);
		scope.isDone();
	});

	it('handles not found', async () => {
		const scope = nock('http://example.org').get('/trial-type/asdf').reply(404);

		const actual = await getTrialType(client, 'asdf');

		expect(actual).toBeNull();
		scope.isDone();
	});

	it('handles error', async () => {
		const scope = nock('http://example.org').get('/trial-type/asdf').reply(500);

		await expect(getTrialType(client, 'asdf')).rejects.toThrow(
			'Unexpected status 500 for fetching name'
		);

		scope.isDone();
	});

	it('handles unexpected status', async () => {
		const scope = nock('http://example.org').get('/trial-type/asdf').reply(201);

		await expect(getTrialType(client, 'asdf')).rejects.toThrow(
			'Unexpected status 201 for fetching name'
		);

		scope.isDone();
	});

	it('validates name', async () => {
		await expect(getTrialType(client, '!$')).rejects.toThrow(
			'Name does not match valid string, can only include a-z,0-9, dashes (-), and underscores (_)'
		);
	});
});
