import { createTermDataFromArrayObj } from '../createTermDataFromArrayObj';

describe('createTermDataFromArrayObj', () => {
	it('should check returned array matches expected shape', () => {
		const data1 = [
			{ key: 'Test Key 1' },
			{ key: 'Test Key 2' },
			{ key: 'Test Key 3' },
		];

		const expectedData1 = [
			{ term: 'Test Key 1', termKey: 'Test Key 1' },
			{ term: 'Test Key 2', termKey: 'Test Key 2' },
			{ term: 'Test Key 3', termKey: 'Test Key 3' },
		];
		expect(createTermDataFromArrayObj(data1, 'key')).toEqual(expectedData1);

		const data2 = [
			{ testName: 'Test Name 1' },
			{ testName: 'Test Name 2' },
			{ testName: 'Test Name 3' },
		];

		const expectedData2 = [
			{ term: 'Test Name 1', termKey: 'Test Name 1' },
			{ term: 'Test Name 2', termKey: 'Test Name 2' },
			{ term: 'Test Name 3', termKey: 'Test Name 3' },
		];
		expect(createTermDataFromArrayObj(data2, 'testName')).toEqual(
			expectedData2
		);
	});

	it('should throw an error when keyName parameter is not provided', () => {
		const data = [
			{ key: 'Test Key 1' },
			{ key: 'Test Key 2' },
			{ key: 'Test Key 3' },
		];

		expect(() => {
			createTermDataFromArrayObj(data);
		}).toThrow('You have to provide a keyName parameter');
	});

	it('should throw an error when keyName parameter is not of type string', () => {
		const data = [
			{ key: 'Test Key 1' },
			{ key: 'Test Key 2' },
			{ key: 'Test Key 3' },
		];

		expect(() => {
			createTermDataFromArrayObj(data, {});
		}).toThrow('keyName parameter should be a string');
	});

	it('should return an empty array when keyName property provided is not present in array of objects', () => {
		const data = [
			{ item: 'Test Key 1' },
			{ item: 'Test Key 2' },
			{ item: 'Test Key 3' },
		];

		expect(createTermDataFromArrayObj(data, 'name')).toEqual([]);
	});

	it('should return an empty array if array parameter provided is empty', () => {
		expect(createTermDataFromArrayObj([], 'name')).toEqual([]);
	});
});
