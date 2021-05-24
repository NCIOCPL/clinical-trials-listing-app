import { ListingSupportCache } from '../index';

describe('ListingSupportCache', () => {
	it('adds items', () => {
		const cache = new ListingSupportCache();
		expect(cache.keys()).toHaveLength(0);

		cache.add('item1', { a: 'b' });
		expect(cache.get('item1')).toEqual({ a: 'b' });
	});

	it('allows us to get multiple keys', () => {
		const cache = new ListingSupportCache();
		expect(cache.keys()).toHaveLength(0);

		cache.add('item1', { a: 'b' });
		cache.add('item2', { a: 'c' });
		cache.add('item3', { a: 'd' });

		expect(cache.keys()).toEqual(['item1', 'item2', 'item3']);
	});
});
