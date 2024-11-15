import { CTX_LOAD_GLOBAL, updateCTXGlobalValue } from '../ctx-actions';

describe('reducers actions', () => {
	it('updateCTXGlobalValue', () => {
		const payload = {
			field: 'dictionaryName',
			value: 'Genetics',
		};
		const expectedAction = {
			payload,
			type: CTX_LOAD_GLOBAL,
		};
		expect(updateCTXGlobalValue(payload)).toEqual(expectedAction);
	});
});
