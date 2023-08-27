import { useAppPaths } from '../routing';

import { useStateValue } from '../../store/store';
jest.mock('../../store/store');

describe('when base path is slash', () => {
	useStateValue.mockReturnValue([
		{
			basePath: '/',
		},
	]);

	it('will replace paths with params', () => {
		const { BasePath } = useAppPaths();
		expect(BasePath()).toEqual('/');
	});
});
