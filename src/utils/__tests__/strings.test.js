import { emboldenSubstring } from '../strings';

describe('emboldenSubstring', () => {
	it("should return original string with substring match wrapped in '<strong>' tags (case insensitive)", () => {
		const str = 'MET/VEGFR-2 inhibitor GSK1363089';
		const subStr = 'met';
		const expectedStr = '<strong>MET</strong>/VEGFR-2 inhibitor GSK1363089';
		expect(emboldenSubstring(str, subStr)).toEqual(expectedStr);
	});
	it("should return original string with same case substring match wrapped in '<strong>' tags", () => {
		const str = 'MET/VEGFR-2 inhibitor GSK1363089';
		const subStr = 'MET';
		const expectedStr = '<strong>MET</strong>/VEGFR-2 inhibitor GSK1363089';
		expect(emboldenSubstring(str, subStr)).toEqual(expectedStr);
	});
	it('should return original string with no changes if substring match is not found', () => {
		const str = 'MET/VEGFR-2 inhibitor GSK1363089';
		const subStr = 'meta';
		const expectedStr = str;
		expect(emboldenSubstring(str, subStr)).toEqual(expectedStr);
	});
});
