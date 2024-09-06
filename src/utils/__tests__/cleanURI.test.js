import { cleanURI } from '../cleanURI';

describe('cleanURI', () => {
	it('cleans trailing slash', () => {
		expect(cleanURI('https://www.example.org/api/')).toBe('https://www.example.org/api');
		expect(cleanURI('https://www.example.org/api')).toBe('https://www.example.org/api');
	});
});
