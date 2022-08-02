import reducer from '../reducer';
import {
	setSuccessfulFetch,
	setFailedFetch,
	setLoading,
	setAborted,
} from '../actions';
import { getListingInformationById as IdAction } from '../../../services/api/actions/getListingInformationById';

const CONCEPT_NO_PURL = {
	conceptId: ['C99999'],
	name: {
		label: 'No Purl Concept',
		normalized: 'no purl concept',
	},
	prettyUrlName: null,
};

describe('listingSupport reducer', () => {
	it('should handle successful fetch action', () => {
		const actual = reducer(
			{},
			setSuccessfulFetch([IdAction({ ids: ['C99999'] })], [CONCEPT_NO_PURL])
		);
		expect(actual).toEqual({
			loading: false,
			error: null,
			payload: [CONCEPT_NO_PURL],
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
});
