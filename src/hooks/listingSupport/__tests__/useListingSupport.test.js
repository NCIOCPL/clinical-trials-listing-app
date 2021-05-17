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

/* es-lint react/prop-types: "off" */
const GetUseListingSupportSample = () => ({ actions, testId }) => {
	const { loading, payload, error, aborted } = useListingSupport(actions);

	return (
		<div>
			{(() => {
				if (!loading && payload) {
					// Smush all the codes together into a string so we can test...
					// TODO: when we write the multiple item tests we need to account
					// for the calls being concept or trials type.
					if (Array.isArray(payload)) {
						return (
							<>
								<ul>
									{payload.map((res, idx) => {
										if (res === null) {
											// API Result is a 404
											return (
													<li key={idx}>
															Payload[{idx}]: null
													</li>
											);
										} else if (res.conceptId) {
											// This is for listing-information
											return (
													<li key={idx}>
															<span>Payload[{idx}]-pretty-url: {res.prettyUrlName}</span>
															<span>Payload[{idx}]-ids: {res.conceptId ? res.conceptId.join(',') : ''}</span>
													</li>
											);
										} else {
											return (
													<li key={idx}>Payload[{idx}]: Unknown Type</li>
											)
										}
									})}
								</ul>
								 <h2>TestId: {testId} </h2>
							</>
						);
					} else {
						//console.log(loading, payload.errorObject.message, error?.message);
						return <h1>Stuff broke</h1>;
					}
				} else if (!loading && error) {
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

describe('useListingSupport', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetModules();
	});

	it('should fetch the data with one ID', async () => {
		const UseListingSupportSample = GetUseListingSupportSample();

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
		const actions = [IdAction({ ids: ['C4872'] })];

		await act(async () => {
			render(<UseListingSupportSample actions={actions} />);
		});
		//expect getlisting info byid .mock.calls.length to be called. we want to make sure it was called
		// TODO: Make this actually check the payload
		expect(screen.getByText('Payload[0]-ids: C4872')).toBeInTheDocument();
	});

	it('should fetch the data with multiple api calls', async () => {
		const UseListingSupportSample = GetUseListingSupportSample();

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
			conceptId: ['C4872', 'C118809'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer'
		},
			prettyUrlName: 'breast-cancer',
		 }).mockReturnValueOnce({

			conceptId: ['C1647'],

			name: {
				label: 'Trastuzumab',
				normalized: 'trastuzumab'
			},
			prettyUrlName: 'trastuzumab',
			 });

		const actions = [IdAction({ ids: ['C4872'] }), IdAction({ ids: ['C1647']})];

		await act(async () => {
			render(<UseListingSupportSample actions={actions} />);
		});
		//expect getlisting info byid .mock.calls.length to be called. we want to make sure it was called
		// TODO: Make this actually check the payload
		expect(screen.getByText('Payload[0]-ids: C4872,C118809')).toBeInTheDocument();
		expect(screen.getByText('Payload[1]-ids: C1647')).toBeInTheDocument();
		expect(getListingInformationById.mock.calls).toHaveLength(2);
	});

	it('should fetch the data with multiple api calls, changing first action between calls, and correctly cache', async () => {
		const UseListingSupportSample = wGetUseListingSupportSample();

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
			conceptId: ['C4872', 'C118809'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer'
		},
			prettyUrlName: 'breast-cancer',
		 }).mockReturnValueOnce({

			conceptId: ['C1647'],

			name: {
				label: 'Trastuzumab',
				normalized: 'trastuzumab'
			},
			prettyUrlName: 'trastuzumab',
			 })
			 .mockReturnValueOnce({

				conceptId: ['C999999'],

				name: {
					label: 'Fake Breast Cancer Subtype',
					normalized: 'fake concept'
				},
				prettyUrlName: 'fake-bc-concept',
				 });

		let renderRtn;

		// Pretend original request was for breast cancer & traztuzamab
		// Nothing should be in the cache
		const actions = [IdAction({ ids: ['C4872'] }), IdAction({ ids: ['C1647']})];

		await act(async () => {
			renderRtn = render(<UseListingSupportSample actions={actions} testId={'cacheTest1'} />);
		});
		expect(screen.getByText('TestId: cacheTest1')).toBeInTheDocument();

		// Pretend second request is for subtype, but still using traztuzamab
		// Subtype should be a new fetch of the API, traztuzamab should be pulled from cache
		const actionsPt2 = [IdAction({ ids: ['C999999'] }), IdAction({ ids: ['C1647']})];

		await act(async () => {
			renderRtn.rerender(<UseListingSupportSample actions={actionsPt2} testId={'cacheTest2'} />);
		});

		//expect getlisting info byid .mock.calls.length to be called. we want to make sure it was called
		expect(screen.getByText('TestId: cacheTest2')).toBeInTheDocument();
		expect(screen.queryByText('TestId: cacheTest1')).toBeNull();
		expect(screen.getByText('Payload[0]-ids: C999999')).toBeInTheDocument();
		expect(screen.getByText('Payload[1]-ids: C1647')).toBeInTheDocument();
		expect(getListingInformationById.mock.calls).toHaveLength(3);
	});


	it('should fetch data with one ID, then store in the cache and re-render', async () => {
		const UseListingSupportSample = GetUseListingSupportSample();

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

		const actions = [IdAction({ ids: ['C4872'] })];
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

		expect(screen.getByText('Payload[0]-ids: C4872')).toBeInTheDocument();
		expect(screen.getByText('TestId: cacheTest2')).toBeInTheDocument();
		expect(screen.queryByText('TestId: cacheTest1')).toBeNull();
		expect(getListingInformationById.mock.calls.length).toBe(1);
		expect(getListingInformationByName.mock.calls.length).toBe(0);
	});

	// SECOND CACHING TEST
	it('should fetch data given 2 different IDs, then store them in the cache and re-render', async () => {
		const UseListingSupportSample = GetUseListingSupportSample();

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

		const actions = [IdAction({ ids: ['C5987', 'C1647'] })];
		await act(async () => {
			render(
				<UseListingSupportSample actions={actions} testId={'cacheTest1'} />
			);
		});

		expect(screen.getByText('TestId: cacheTest1')).toBeInTheDocument();
		expect(screen.getByText('Payload[0]-ids: C5987,C1647')).toBeInTheDocument();
		expect(getListingInformationById.mock.calls.length).toBe(1);
		expect(getListingInformationByName.mock.calls.length).toBe(0);
	});

	it('should fetch the data with one Name', async () => {
		const UseListingSupportSample = GetUseListingSupportSample();

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
		expect(screen.getByText('Payload[0]-ids: C4872')).toBeInTheDocument();
	});

	it('should handle a 404', async () => {
		const UseListingSupportSample = GetUseListingSupportSample();

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
		const actions = [IdAction({ ids: ['C4872'] })];

		await act(async () => {
			render(<UseListingSupportSample actions={actions} />);
		});

		// TODO: Make this actually check the payload
		expect(screen.getByText('Payload[0]: null')).toBeInTheDocument();
	});

	it('should handle a error with unknown type', async () => {
		const UseListingSupportSample = GetUseListingSupportSample();

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
		const UseListingSupportSample = GetUseListingSupportSample();

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
		const actions = [IdAction({ ids: ['C4872'] })];

		await act(async () => {
			render(<UseListingSupportSample actions={actions} />);
		});

		// TODO: Make this actually check the payload
		expect(screen.getByText('Error: Bad Mojo')).toBeInTheDocument();
	});
});
