import { getTrialType } from '../getTrialType';

describe('getTrialType action', () => {
	it('should match getTrialType action', () => {
		const trialType = 'treatment';

		const expectedAction = {
			type: 'trialType',
			payload: 'treatment',
		};

		expect(getTrialType({ trialType })).toEqual(expectedAction);
	});

	it('handles exception when passed incorrect data because we do not use typescript and do not have type safety', () => {
		expect(() => {
			getTrialType({ foo: [20] });
		}).toThrow('You must specify a trialType in order to fetch it.');
		expect(() => {
			getTrialType({ trialType: null });
		}).toThrow('You must specify a trialType in order to fetch it.');
	});
});
