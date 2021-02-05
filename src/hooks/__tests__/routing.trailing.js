import { useAppPaths } from '../routing';

import { useStateValue } from '../../store/store.js';
jest.mock('../../store/store.js');

describe('when base path has trailing slash', () => {
	useStateValue.mockReturnValue([
		{
			basePath: '/my/path/',
		},
	]);

	it('will produce paths without params', () => {
		const { HomePath } = useAppPaths();
		expect(HomePath()).toEqual('/my/path/');
	});

	it('will replace paths with params', () => {
		const { HomePath } = useAppPaths();
		expect(HomePath({ foo: 'bar' })).toEqual('/my/path/');
	});
});
