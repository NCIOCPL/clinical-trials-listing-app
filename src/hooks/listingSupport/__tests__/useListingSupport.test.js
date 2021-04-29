import React from 'react';
import PropTypes from 'prop-types';
import { act, render, screen } from '@testing-library/react';
import { useListingSupport } from '../useListingSupport';
import { getListingInformationById as IdAction } from '../../../services/api/actions/getListingInformationById';
import { getListingInformationByName as NameAction } from '../../../services/api/actions/getListingInformationByName';
import { getListingInformationById } from '../../../services/api/trial-listing-support-api/getListingInformationById';
import { getListingInformationByName } from '../../../services/api/trial-listing-support-api/getListingInformationByName';
import { useStateValue } from '../../../store/store';

jest.mock('../../../store/store');
jest.mock(
	'../../../services/api/trial-listing-support-api/getListingInformationById'
);
jest.mock(
	'../../../services/api/trial-listing-support-api/getListingInformationByName'
);

const UseListingSupportSample = ({ actions, testId }) => {
	const { loading, payload, error, aborted } = useListingSupport(actions);

	return (
		<div>
			{(() => {
				if (!loading && !!payload) {
					// Smush all the codes together into a string so we can test...
					// TODO: when we write the multiple item tests we need to account
					// for the calls being concept or trials type.
					if (Array.isArray(payload)) {
						const ids = payload.reduce((ac, curr) => {
							return (
								(ac === '' ? ac : ac + '|') +
								(curr !== null ? curr.conceptId.join(',') : 'null')
							);
						}, '');
						return (
							<>
								<h1>Payload: {ids}</h1> <h2>TestId: {testId} </h2>
							</>
						);
					} else {
						//console.log(loading, payload.errorObject.message, error?.message);
						return <h1>Stuff broke</h1>;
					}
				} else if (!loading && !!error) {
					return <h1>Error: {error.message}</h1>;
				} else if (!loading && aborted) {
					return <h1>Aborted: This should not happen</h1>;
				} else {
					return <h1>Loading</h1>;
				}
			})()}
		</div>
	);
};
// Shutup the linter...
UseListingSupportSample.propTypes = {
	actions: PropTypes.array,
	testId: PropTypes.string,
};

describe('useListingSupport', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should fetch the data with one ID', async () => {
		// This will work for now because we don't care it is
		// an axios instance. When we add in aborting, we will
		// very much care.
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		getListingInformationById.mockReturnValue({
			conceptId: ['C4872'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer',
			},
			prettyUrlName: 'breast-cancer',
		});
		const actions = [IdAction({ id: ['C4872'] })];

		await act(async () => {
			render(<UseListingSupportSample actions={actions} />);
		});
		//expect getlisting info byid .mock.calls.length to be called. we want to make sure it was called
		// TODO: Make this actually check the payload
		expect(screen.getByText('Payload: C4872')).toBeInTheDocument();
	});

	it('should fetch data with one ID, then store in the cache and re-render', async () => {
		// This will work for now because we don't care it is
		// an axios instance. When we add in aborting, we will
		// very much care.
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		getListingInformationById.mockReturnValueOnce({
			conceptId: ['C4872'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer',
			},
			prettyUrlName: 'breast-cancer',
		});

		const actions = [IdAction({ id: ['C4872'] })];
		let renderRtn;

		await act(async () => {
			renderRtn = render(
				<UseListingSupportSample actions={actions} testId={'cacheTest1'} />
			);
		});

		expect(screen.getByText('TestId: cacheTest1')).toBeInTheDocument();

		getListingInformationByName.mockReturnValue({});
		const actionsPt2 = [NameAction({ name: 'breast-cancer' })];

		await act(async () => {
			renderRtn.rerender(
				<UseListingSupportSample actions={actionsPt2} testId={'cacheTest2'} />
			);
		});

		expect(screen.getByText('Payload: C4872')).toBeInTheDocument();
		expect(screen.getByText('TestId: cacheTest2')).toBeInTheDocument();
		expect(screen.queryByText('TestId: cacheTest1')).toBeNull();
		expect(getListingInformationById.mock.calls.length).toBe(1);
		expect(getListingInformationByName.mock.calls.length).toBe(0);
	});

	// SECOND CACHING TEST
	it('should fetch data given 2 different IDs, then store them in the cache and re-render', async () => {
		// This will work for now because we don't care it is
		// an axios instance. When we add in aborting, we will
		// very much care.
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		getListingInformationById.mockReturnValueOnce({
			conceptId: ['C5987', 'C1647'],
			name: {
				label: 'Trastuzumab',
				normalized: 'trastuzumab',
			},
			prettyUrlName: 'trastuzumab',
		});

		const actions = [IdAction({ id: ['C5987', 'C1647'] })];
		await act(async () => {
			render(
				<UseListingSupportSample actions={actions} testId={'cacheTest1'} />
			);
		});

		expect(screen.getByText('TestId: cacheTest1')).toBeInTheDocument();
		expect(screen.getByText('Payload: C5987,C1647')).toBeInTheDocument();
		expect(getListingInformationById.mock.calls.length).toBe(1);
		expect(getListingInformationByName.mock.calls.length).toBe(0);
	});

	it('should fetch the data with one Name', async () => {
		// This will work for now because we don't care it is
		// an axios instance. When we add in aborting, we will
		// very much care.
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		getListingInformationByName.mockReturnValue({
			conceptId: ['C4872'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer',
			},
			prettyUrlName: 'breast-cancer',
		});
		const actions = [NameAction({ name: 'breast-cancer' })];

		await act(async () => {
			render(<UseListingSupportSample actions={actions} />);
		});

		// TODO: Make this actually check the payload.
		expect(screen.getByText('Payload: C4872')).toBeInTheDocument();
	});

	it('should handle a 404', async () => {
		// This will work for now because we don't care it is
		// an axios instance. When we add in aborting, we will
		// very much care.
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		getListingInformationById.mockImplementation(() => {
			return null;
		});
		const actions = [IdAction({ id: ['C4872'] })];

		await act(async () => {
			render(<UseListingSupportSample actions={actions} />);
		});

		// TODO: Make this actually check the payload
		expect(screen.getByText('Payload: null')).toBeInTheDocument();
	});

	it('should handle a error with unknown type', async () => {
		// This will work for now because we don't care it is
		// an axios instance. When we add in aborting, we will
		// very much care.
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		getListingInformationById.mockImplementation(() => {
			throw new Error('Bad Mojo');
		});
		const actions = [
			{
				type: 'dummy',
				payload: { a: 1 },
			},
		];

		await act(async () => {
			render(<UseListingSupportSample actions={actions} />);
		});
		//screen.debug();
		// TODO: Make this actually check the payload
		//console.log('trial listiing support request test end');
		expect(
			screen.getByText('Error: Unknown trial listing support request')
		).toBeInTheDocument();
	});

	it('should handle a generic error from a fetch', async () => {
		// This will work for now because we don't care it is
		// an axios instance. When we add in aborting, we will
		// very much care.
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		getListingInformationById.mockImplementation(() => {
			throw new Error('Bad Mojo');
		});
		const actions = [IdAction({ id: ['C4872'] })];

		await act(async () => {
			render(<UseListingSupportSample actions={actions} />);
		});

		// TODO: Make this actually check the payload
		expect(screen.getByText('Error: Bad Mojo')).toBeInTheDocument();
	});
});
