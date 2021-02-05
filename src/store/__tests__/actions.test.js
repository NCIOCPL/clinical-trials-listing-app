import { LOAD_GLOBAL, updateGlobalValue } from '../actions';

describe('reducers actions', () => {
	test('updateGlobalValue', () => {
		const payload = {
			field: 'dictionaryName',
			value: 'Genetics',
		};
		const expectedAction = {
			payload,
			type: LOAD_GLOBAL,
		};
		expect(updateGlobalValue(payload)).toEqual(expectedAction);
	});
});
