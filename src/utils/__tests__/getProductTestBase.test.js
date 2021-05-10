import { getProductTestBase } from '../index';

describe('getProductTestBase', () => {
	const { location } = window;

	beforeAll(() => {
		delete window.location;
	});

	afterAll(() => {
		window.location = location;
	});

	test('given a bad pathname, will throw an error', () => {
		window.location = { pathname: 'badpathname' };
		expect(getProductTestBase).toThrow(Error);
	});

	test('returns the dictionary url to use as base path', () => {
		// mock location of url 'https://www.cancer.gov/publications/dictionaries/cancer-terms'
		window.location = {
			href: 'https://www.cancer.gov/publications/dictionaries/cancer-terms',
			pathname: '/publications/dictionaries/cancer-terms',
		};
		expect(getProductTestBase()).toEqual('/publications/dictionaries');
	});
});
