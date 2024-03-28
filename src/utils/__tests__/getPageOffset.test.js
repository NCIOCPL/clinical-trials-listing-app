import { getPageOffset } from '../getPageOffset';

describe('getPageOffset()', () => {
	it('should return expected value for page offset', () => {
		const page = 1;
		const itemsPerPage = 10;
		const expectedOffset = 0;
		expect(getPageOffset(page, itemsPerPage)).toEqual(expectedOffset);
	});
	it('should return expected value for page offset, when parameters provided are numbered strings', () => {
		const page = '8';
		const itemsPerPage = '10';
		const expectedOffset = 70;
		expect(getPageOffset(page, itemsPerPage)).toEqual(expectedOffset);
	});
	it('should return NaN value for page offset, when parameters provided are strings', () => {
		const page = 'a';
		const itemsPerPage = 'b';
		expect(getPageOffset(page, itemsPerPage)).toBeNaN();
	});
});
