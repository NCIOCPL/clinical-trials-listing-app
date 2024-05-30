import { useLocation } from 'react-router-dom';
import { useURLQuery } from '../useURLQuery';

jest.mock('react-router');

describe('useURLQuery', () => {
	it('should retrieve and set query string value in location', () => {
		useLocation.mockReturnValue({
			pathname: '/',
			search: '?swKeyword=achoo',
			hash: '',
			state: null,
			key: 'default',
		});

		const urlQuery = useURLQuery();
		expect(urlQuery.get('swKeyword')).toBe('achoo');
		const expectedQueryStr = 'swKeyword=gesundheit';
		urlQuery.set('swKeyword', 'gesundheit');
		expect(urlQuery.toString()).toEqual(expectedQueryStr);
	});
});
