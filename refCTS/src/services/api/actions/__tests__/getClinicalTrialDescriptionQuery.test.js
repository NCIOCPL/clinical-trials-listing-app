import { getClinicalTrialDescriptionAction } from '../getClinicalTrialDescriptionAction';

describe('getClinicalTrialDescriptionAction action', () => {
	it('should match getClinicalTrialDescriptionAction action', () => {
		const expectedAction = {
			type: 'trialDescription',
			payload: 'testId',
		};

		expect(getClinicalTrialDescriptionAction('testId')).toEqual(expectedAction);
	});

	it('handles exception with null, undefined, or no parameter specified when invoked', () => {
		expect(() => {
			getClinicalTrialDescriptionAction(null);
		}).toThrow(
			'You must specify a trialId in order to fetch a trial description.'
		);
		expect(() => {
			getClinicalTrialDescriptionAction(undefined);
		}).toThrow(
			'You must specify a trialId in order to fetch a trial description.'
		);
		expect(() => {
			getClinicalTrialDescriptionAction();
		}).toThrow(
			'You must specify a trialId in order to fetch a trial description.'
		);
	});
});
