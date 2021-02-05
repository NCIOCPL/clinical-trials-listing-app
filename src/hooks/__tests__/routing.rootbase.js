import { useAppPaths } from '../routing';

import { useStateValue } from '../../store/store.js';
jest.mock('../../store/store.js');

describe('when base path is slash', () => {
	useStateValue.mockReturnValue([
		{
			basePath: '/',
		},
	]);

	it('will produce paths without params', () => {
		const { HomePath } = useAppPaths();
		expect(HomePath()).toEqual('/');
	});

	it('will replace paths with params', () => {
		const { HomePath } = useAppPaths();
		expect(HomePath({ foo: 'bar' })).toEqual('/');
	});
});
