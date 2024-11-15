import { hasSCOBeenUpdated } from '../hasSCOBeenUpdated';
import { defaultSCOState } from '../../constants';

describe('<Compare default state with given search criteria object />', () => {
	it('returns true if SCO has not been updated', () => {
		const searchObject = {
			...defaultSCOState,
			formType: 'basic',
			resultsPage: 5,
		};

		expect(hasSCOBeenUpdated(searchObject)).toBeTruthy();
	});

	it('returns false when SCO is different from default state', () => {
		const searchObject = {
			...defaultSCOState,
			formType: 'basic',
			resultsPage: 5,
			age: '89',
			zip: '22182',
		};

		expect(hasSCOBeenUpdated(searchObject)).not.toBeTruthy();
	});
});
