import {
	hocReducer,
	setLoading,
	setSuccessfulFetch,
	setFailedFetch,
	setNotFound,
	setRedirecting,
	hocStates,
} from '../hocReducer';

describe('hocReducer', () => {
	it('sets successful from empty', () => {
		const actual = hocReducer(
			{},
			setSuccessfulFetch('actionshash', [{ a: 1 }])
		);
		expect(actual).toEqual({
			status: hocStates.LOADED_STATE,
			listingData: [{ a: 1 }],
			actionsHash: 'actionshash',
		});
	});

	it('sets successful new data', () => {
		const initialState = {
			status: hocStates.LOADED_STATE,
			listingData: [{ b: 2 }],
			actionsHash: 'actionshash2',
		};
		const actual = hocReducer(
			initialState,
			setSuccessfulFetch('actionshash', [{ a: 1 }])
		);
		expect(actual).toEqual({
			status: hocStates.LOADED_STATE,
			listingData: [{ a: 1 }],
			actionsHash: 'actionshash',
		});
	});

	it('does not return new state with same data', () => {
		const initialState = {
			status: hocStates.LOADED_STATE,
			listingData: [{ a: 1 }],
			actionsHash: 'actionshash',
		};
		const actual = hocReducer(
			initialState,
			setSuccessfulFetch('actionshash', [{ a: 1 }])
		);
		expect(actual).toBe(initialState);
	});

	it('sets loading', () => {
		const actual = hocReducer({}, setLoading());
		expect(actual).toEqual({
			status: hocStates.LOADING_STATE,
			listingData: null,
			actionsHash: '',
		});
	});

	it('returns same object when resetting loading', () => {
		const initialState = {
			status: hocStates.LOADING_STATE,
			listingData: null,
			actionsHash: '',
		};
		const actual = hocReducer(initialState, setLoading());
		expect(actual).toBe(initialState);
	});

	it('sets redirecting', () => {
		const actual = hocReducer({}, setRedirecting());
		expect(actual).toEqual({
			status: hocStates.REDIR_STATE,
			listingData: null,
			actionsHash: '',
		});
	});

	it('sets not found', () => {
		const actual = hocReducer({}, setNotFound());
		expect(actual).toEqual({
			status: hocStates.NOTFOUND_STATE,
			listingData: null,
			actionsHash: '',
		});
	});

	it('sets failed', () => {
		const actual = hocReducer({}, setFailedFetch());
		expect(actual).toEqual({
			status: hocStates.ERROR_STATE,
			listingData: null,
			actionsHash: '',
		});
	});

	it('should return the same state if unknown action', () => {
		const initialState = { a: 1 };
		expect(hocReducer(initialState, { type: 'chicken' })).toBe(initialState);
	});

	it('handles an initial state', () => {
		const actual = hocReducer(undefined, setLoading());
		expect(actual).toEqual({
			status: hocStates.LOADING_STATE,
			listingData: null,
			actionsHash: '',
		});
	});
});
