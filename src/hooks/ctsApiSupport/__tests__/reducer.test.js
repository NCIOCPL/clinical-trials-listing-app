import reducer from '../reducer';
import {
	setSuccessfulFetch,
	setFailedFetch,
	setLoading,
	setAborted,
} from '../actions';

import { getClinicalTrials } from '../../../services/api/actions/getClinicalTrials';

describe('useCtsApi reducer', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const requestFilters = {
		'arms.interventions.intervention_code': ['C1234'],
	};
	const requestQuery = getClinicalTrials({
		from: 0,
		requestFilters,
		size: 50,
	});

	it('should handle successful fetch action', () => {
		const actual = reducer({}, setSuccessfulFetch(requestQuery));
		expect(actual).toEqual({
			loading: false,
			error: null,
			payload: requestQuery,
			aborted: false,
		});
	});

	it('should handle failed fetch action', () => {
		const err = new Error(`Error`);
		const actual = reducer({}, setFailedFetch(err));
		expect(actual).toEqual({
			loading: false,
			error: err,
			payload: null,
			aborted: false,
		});
	});

	it('should handle set loading action', () => {
		const actual = reducer({}, setLoading());
		expect(actual).toEqual({
			loading: true,
			error: null,
			payload: null,
			aborted: false,
		});
	});

	it('should handle set aborted action', () => {
		const actual = reducer({}, setAborted());
		expect(actual).toEqual({
			loading: false,
			error: null,
			payload: null,
			aborted: true,
		});
	});

	it('handles an initial state', () => {
		const actual = reducer(undefined, setAborted());
		expect(actual).toEqual({
			loading: false,
			error: null,
			payload: null,
			aborted: true,
		});
	});

	it('handles an already loading state', () => {
		const loadingState = {
			loading: true,
			payload: null,
			error: null,
			aborted: false,
		};

		const actual = reducer(loadingState, setLoading());
		expect(actual).toBe(loadingState);
	});

	it('handles an outlier case', () => {
		const loadingState = {
			loading: true,
			payload: null,
			error: null,
			aborted: false,
		};

		const action = {
			type: 'OUTLIER',
		};
		const actual = reducer(loadingState, action);
		expect(actual).toBe(loadingState);
	});
});
