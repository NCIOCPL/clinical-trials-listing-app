import {
	appendOrUpdateToQueryString,
	getKeyValueFromQueryString,
} from '../url';

describe('getKeyValueFromQueryString()', () => {
	it('should return value for key from query string if key exists in query string', () => {
		const queryString =
			'?dictionary=term&searchText=cancer&language=English&searchType=exact&offset=0&maxResults=0';
		expect(getKeyValueFromQueryString('searchText', queryString)).toBe(
			'cancer'
		);
	});

	it('should return null value if key does not exist in query string', () => {
		const queryString =
			'?dictionary=term&searchText=cancer&language=English&searchType=exact&offset=0&maxResults=0';
		expect(getKeyValueFromQueryString('chicken', queryString)).toBeNull();
	});
});

describe('appendOrUpdateToQueryString()', () => {
	it('should append new param to query string when param does not exist in query string', () => {
		const queryString = '?fruit=orange';
		const key = 'chicken';
		const value = 'wings';
		const expected = '?fruit=orange&chicken=wings';
		expect(appendOrUpdateToQueryString(queryString, key, value)).toEqual(
			expected
		);
	});

	it('should set query param and value when there is no value in the queryString parameter', () => {
		const queryString = '';
		const key = 'chicken';
		const value = 'wings';
		const expected = '?chicken=wings';
		expect(appendOrUpdateToQueryString(queryString, key, value)).toEqual(
			expected
		);
	});

	it('should update new param and value in query string', () => {
		const queryString = '?fruit=orange&chicken=wings';
		const key = 'chicken';
		const value = 'thighs';
		const expected = '?fruit=orange&chicken=thighs';
		expect(appendOrUpdateToQueryString(queryString, key, value)).toEqual(
			expected
		);
	});
});
