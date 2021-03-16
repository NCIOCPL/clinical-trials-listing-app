import { matchQueryParam } from '../matchQueryParam';
import { queryParamType } from '../../constants';

describe('matchQueryParam', () => {
	test('it matches a single code param to code type and array of single code', () => {
		const matchedParam = {
			paramType: queryParamType.code,
			queryParam: ['C4872'],
		};

		expect(matchQueryParam('C4872')).toStrictEqual(matchedParam);
	});

	test('it matches a list of code params to code type and array of codes', () => {
		const matchedParam = {
			paramType: queryParamType.code,
			queryParam: ['C4872', 'C118809'],
		};

		expect(matchQueryParam('C4872,C118809')).toStrictEqual(matchedParam);
	});

	test('it matches a pretty URL name param to purl type and string', () => {
		const matchedParam = {
			paramType: queryParamType.purl,
			queryParam: 'breast-cancer',
		};

		expect(matchQueryParam('breast-cancer')).toStrictEqual(matchedParam);
	});

	test('it matches a code,pretty URL name param to purl type and string', () => {
		const matchedParam = {
			paramType: queryParamType.purl,
			queryParam: 'C4872,breast-cancer',
		};

		expect(matchQueryParam('C4872,breast-cancer')).toStrictEqual(matchedParam);
	});
});
