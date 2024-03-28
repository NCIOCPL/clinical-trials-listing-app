import { getProductTestBase } from '../index';

describe('getProductTestBase', () => {
	const { location } = window;

	beforeAll(() => {
		delete window.location;
	});

	afterAll(() => {
		window.location = location;
	});

	it('given a bad pathname, will throw an error', () => {
		window.location = { pathname: 'badpathname' };
		expect(getProductTestBase).toThrow(Error);
	});

	it('returns the dictionary url to use as base path', () => {
		// mock location of url 'https://www.cancer.gov/publications/dictionaries/cancer-terms'
		window.location = {
			href: 'https://www.cancer.gov/publications/dictionaries/cancer-terms',
			pathname: '/publications/dictionaries/cancer-terms',
		};
		expect(getProductTestBase()).toBe('/publications/dictionaries');
	});
});
