import reducer from '../reducer';
import {
	setSuccessfulFetch,
	setFailedFetch,
	setLoading,
	setAborted,
} from '../actions';

describe('listingSupport reducer', () => {
	it('should handle successful fetch action', () => {
		const actual = reducer({}, setSuccessfulFetch({ a: 1 }));
		expect(actual).toEqual({
			loading: false,
			error: null,
			payload: { a: 1 },
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
});
