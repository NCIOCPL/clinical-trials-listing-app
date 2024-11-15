import { CTX_LOAD_GLOBAL, CTX_LOAD_GLOBALS } from '../ctx-actions';
import ctx_reducer from '../ctx-reducer';
import { useAppSettings } from '../store.js';

jest.mock('../store.js');

const dispatch = jest.fn();

useAppSettings.mockReturnValue([
	{
		appId: 'mockAppId',
		basePath: '/',
	},
	dispatch,
]);

describe('reducers', () => {
	it(`${CTX_LOAD_GLOBAL}`, () => {
		const initialState = {
			appId: 'mockAppId',
			basePath: '/',
			dictionaryName: 'Cancer.gov',
		};
		const payload = {
			field: 'dictionaryName',
			value: 'Genetics',
		};
		const action = {
			type: CTX_LOAD_GLOBAL,
			payload,
		};
		expect(ctx_reducer(initialState, action)).toEqual({
			...initialState,
			dictionaryName: 'Genetics',
		});
	});

	it(`${CTX_LOAD_GLOBALS}`, () => {
		const initialState = {
			appId: 'mockAppId',
			basePath: '/',
			dictionaryName: 'Cancer.gov',
		};
		const payload = {
			dictionaryName: 'Genetics',
			language: 'en',
		};
		const action = {
			type: CTX_LOAD_GLOBALS,
			payload,
		};
		expect(ctx_reducer(initialState, action)).toEqual({
			...initialState,
			...payload,
		});
	});

	it('undefined action type', () => {
		const initialState = {
			appId: 'mockAppId',
			basePath: '/',
			dictionaryName: 'Cancer.gov',
		};
		const payload = {
			dictionaryName: 'Genetics',
			language: 'en',
		};
		const action = {
			type: undefined,
			payload,
		};
		expect(ctx_reducer(initialState, action)).toEqual(initialState);
	});
});
