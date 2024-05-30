import { matchItemToTerm } from '../matchItemToTerm';

const item = { termId: 467848, termName: 'methodology' };

describe('matchItemToTerm', () => {
	it('should match term name in item', () => {
		const value = 'met';
		expect(matchItemToTerm(item, value)).toBe(true);
	});
	it('should not be able match term name in item', () => {
		const value = 'meta';
		expect(matchItemToTerm(item, value)).toBe(false);
	});
});
