import { setAPIEndpoint } from '../../endpoints';
import { getSampleCallResults } from '../index';

describe('getSampleCallResults action', () => {
	setAPIEndpoint('/api/sampleapi/v1/');

	test(`should match getSampleCallResults action for id "6789"`, () => {
		const id = '6789';
		const retAction = {
			method: 'GET',
			endpoint: `/api/sampleapi/v1/sampleendpoint/${id}`,
		};
		expect(getSampleCallResults({ id })).toEqual(retAction);
	});

});
