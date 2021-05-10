import { LOAD_GLOBAL, LOAD_GLOBALS } from '../actions';
import reducer from '../reducer';
import { useStateValue } from '../store.js';

jest.mock('../store.js');

const dispatch = jest.fn();

useStateValue.mockReturnValue([
	{
		appId: 'mockAppId',
		basePath: '/',
	},
	dispatch,
]);

describe('reducers', () => {
	test(`${LOAD_GLOBAL}`, () => {
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
			type: LOAD_GLOBAL,
			payload,
		};
		expect(reducer(initialState, action)).toEqual({
			...initialState,
			dictionaryName: 'Genetics',
		});
	});

	test(`${LOAD_GLOBALS}`, () => {
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
			type: LOAD_GLOBALS,
			payload,
		};
		expect(reducer(initialState, action)).toEqual({
			...initialState,
			...payload,
		});
	});

	test('undefined action type', () => {
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
		expect(reducer(initialState, action)).toEqual(initialState);
	});
});
