import { useCache } from '../caching';
import { renderHook, act } from '@testing-library/react-hooks';

describe('listingSupport caching ability', () => {
	it('should store an item in the cache', async () => {
		const indexedPayload = {
			conceptId: ['C4872'],
			name: {
				label: 'hepatocellular cancer',
				normalized: 'hepatocellular cancer',
			},
			prettyUrlName: 'hepatocellular-cancer',
		};
		const payload = [indexedPayload];
		const { result } = renderHook(() => useCache());

		act(() => {
			result.current.cacheItem(payload, payload[0].conceptId[0]);
		});

		expect(result.current.getCacheItem('C4872')).toBe(payload);
	});

	it('should store multiple items in the cache', async () => {
		console.log('start secod test');
		const indexedPayload = {
			conceptId: ['C3099', 'C7955', 'C7956'],
			name: {
				label: 'hepatocellular cancer',
				normalized: 'hepatocellular cancer',
			},
			prettyUrlName: 'hepatocellular-cancer',
		};
		const payload = [indexedPayload];

		const { result } = renderHook(() => useCache());

		for (var i = 0; i < indexedPayload.conceptId.length; i++) {
			let item = payload[0].conceptId[i];

			act(() => {
				result.current.cacheItem(payload, item);
			});
		}
		expect(result.current.getCacheItem('C3099')).toBe(payload);
		expect(result.current.getCacheItem('C7955')).toBe(payload);
		expect(result.current.getCacheItem('C7956')).toBe(payload);
	});

	it('should be able to find an array of cached items', async () => {
		const indexedPayload = {
			conceptId: ['C3099', 'C7955', 'C7956'],
			name: {
				label: 'hepatocellular cancer',
				normalized: 'hepatocellular cancer',
			},
			prettyUrlName: 'hepatocellular-cancer',
		};
		const payload = [indexedPayload];
		const { result } = renderHook(() => useCache());
		for (var i = 0; i < indexedPayload.conceptId.length; i++) {
			let item = payload[0].conceptId[i];
			act(() => {
				result.current.cacheItem(payload, item);
			});
		}
		expect(result.current.getCacheItem(['C3099', 'C7955', 'C7956'])).toBe(
			payload
		);
	});

	it('should return 0 when looking for something that is not in the cache', async () => {
		const indexedPayload = {
			conceptId: ['C3099', 'C7955', 'C7956'],
			name: {
				label: 'hepatocellular cancer',
				normalized: 'hepatocellular cancer',
			},
			prettyUrlName: 'hepatocellular-cancer',
		};
		const payload = [indexedPayload];
		const { result } = renderHook(() => useCache());
		for (var i = 0; i < indexedPayload.conceptId.length; i++) {
			let item = payload[0].conceptId[i];
			act(() => {
				result.current.cacheItem(payload, item);
			});
		}

		expect(result.current.getCacheItem('C4422')).toBe(false);
	});
});
