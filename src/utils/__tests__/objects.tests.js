import { getKeyValueFromObject } from '../objects';

const testObject = {
	termId: 467848,
	termName: 'methodology',
};

describe('getKeyValueFromObject', () => {
	it(`should retrieve termId value ${testObject.termId} from test object`, () => {
		expect(getKeyValueFromObject('termId', testObject)).toBe(467848);
	});
	it('should return "undefined" for key that does not exist in test object', () => {
		expect(getKeyValueFromObject('termKey', testObject)).toBeUndefined();
	});
});
