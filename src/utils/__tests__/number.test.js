import { formatNumberToThousands } from '../index';

describe('formatNumberToThousands', () => {
	let testData = [0, 20, 200, 1000, 12890, 123456, 1278083];

	test('Match the number formatting', () => {
		const expected = [
			'0',
			'20',
			'200',
			'1,000',
			'12,890',
			'123,456',
			'1,278,083',
		];
		for (let i = 0; i < testData.length; i++) {
			expect(formatNumberToThousands(testData[i])).toEqual(expected[i]);
		}
	});
});
