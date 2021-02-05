import { getKeyValueFromObject } from '../objects';

const testObject = {
	termId: 467848,
	termName: 'methodology',
};

describe('getKeyValueFromObject', () => {
	test(`should retrieve termId value ${testObject.termId} from test object`, () => {
		expect(getKeyValueFromObject('termId', testObject)).toEqual(467848);
	});
	test('should return "undefined" for key that does not exist in test object', () => {
		expect(getKeyValueFromObject('termKey', testObject)).toEqual(undefined);
	});
});
