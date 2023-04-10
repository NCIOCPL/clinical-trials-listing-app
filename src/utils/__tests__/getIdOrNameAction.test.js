import { getIdOrNameAction } from '../getIdOrNameAction';

describe('getIdOrNameAction', () => {
	it('Gets an ID action when normal', () => {
		const actual = getIdOrNameAction(false, 'C1234', 1, '?');
		expect(actual).toEqual({
			type: 'id',
			payload: ['C1234'],
		});
	});
	it('Gets an ID action when multiple ids', () => {
		const actual = getIdOrNameAction(false, 'C1234,C6454', 1, '?');
		expect(actual).toEqual({
			type: 'id',
			payload: ['C1234', 'C6454'],
		});
	});
	it('Gets an ID action when noTrials using id', () => {
		const actual = getIdOrNameAction(true, 'notrials', 1, '?p1=C1234');
		expect(actual).toEqual({
			type: 'id',
			payload: ['C1234'],
		});
	});
	it('Gets an ID action when multiple ids, 2nd param', () => {
		const actual = getIdOrNameAction(true, null, 2, '?p2=C1234,C6454');
		expect(actual).toEqual({
			type: 'id',
			payload: ['C1234', 'C6454'],
		});
	});
	it('Gets an name action when normal', () => {
		const actual = getIdOrNameAction(false, 'lung-cancer', 1, '?');
		expect(actual).toEqual({
			type: 'name',
			payload: 'lung-cancer',
		});
	});
	it('Gets an ID action when noTrials using name', () => {
		const actual = getIdOrNameAction(true, 'no-trials', 1, '?p1=lung-cancer');
		expect(actual).toEqual({
			type: 'name',
			payload: 'lung-cancer',
		});
	});
	it('Gets an name action when 2nd position', () => {
		const actual = getIdOrNameAction(true, null, 2, '?p2=lung-cancer');
		expect(actual).toEqual({
			type: 'name',
			payload: 'lung-cancer',
		});
	});
});
