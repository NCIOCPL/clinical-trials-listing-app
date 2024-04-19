import React from 'react';
import { act, render, screen } from '@testing-library/react';
import {
	ListingSupportCache,
	ListingSupportContext,
	useListingSupport,
} from '../index';
import { getListingInformationById as IdAction } from '../../../services/api/actions/getListingInformationById';
import { getListingInformationByName as NameAction } from '../../../services/api/actions/getListingInformationByName';
import { getTrialType as TrialTypeAction } from '../../../services/api/actions/getTrialType';
import { getListingInformationById } from '../../../services/api/trial-listing-support-api/getListingInformationById';
import { getListingInformationByName } from '../../../services/api/trial-listing-support-api/getListingInformationByName';
import { getTrialType } from '../../../services/api/trial-listing-support-api/getTrialType';
import { useStateValue } from '../../../store/store';

jest.mock('../../../store/store');
jest.mock(
	'../../../services/api/trial-listing-support-api/getListingInformationById'
);
jest.mock(
	'../../../services/api/trial-listing-support-api/getListingInformationByName'
);

jest.mock('../../../services/api/trial-listing-support-api/getTrialType');

/* eslint-disable react/prop-types */
const InternalListingSupportSample = ({ actions, testId }) => {
	const { loading, payload, error, aborted } = useListingSupport(actions);

	return (
		<div>
			{(() => {
				if (!loading && payload) {
					return (
						<>
							<h1>Payloads</h1>
							<ul>
								{payload.map((res, idx) => {
									if (res === null) {
										return <li key={idx}>Payload[{idx}]: null </li>;
									} else if (res.conceptId) {
										return (
											<li key={idx}>
												Payload[{idx}]-ids: {res.conceptId.join(',')}
											</li>
										);
									} else if (res.idString) {
										return (
											<li key={idx}>
												Payload[{idx}]-ids: {res.idString}
											</li>
										);
									} else {
										return <li key={idx}>Payload[{idx}]: unknown</li>;
									}
								})}
							</ul>
							<h2>TestId: {testId} </h2>
						</>
					);
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

// THIS IS KINDA A HACK. Basically we need a new cache for each test, and I can't figure
// out how to clear it. So we will just create it in each test.
const UseListingSupportSample = ({ cache, actions, testId }) => {
	return (
		<ListingSupportContext.Provider value={{ cache }}>
			<InternalListingSupportSample actions={actions} testId={testId} />
		</ListingSupportContext.Provider>
	);
};

describe('useListingSupport', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('one paramater use cases', () => {
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
			const actions = [IdAction({ ids: ['C4872'] })];

			const cache = new ListingSupportCache();
			await act(async () => {
				render(<UseListingSupportSample cache={cache} actions={actions} />);
			});

			expect(screen.getByText('Payload[0]-ids: C4872')).toBeInTheDocument();
			expect(getListingInformationById.mock.calls).toHaveLength(1);
			expect(getListingInformationById.mock.calls[0][1]).toEqual(['C4872']);
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

			const cache = new ListingSupportCache();
			await act(async () => {
				render(<UseListingSupportSample cache={cache} actions={actions} />);
			});

			expect(screen.getByText('Payload[0]-ids: C4872')).toBeInTheDocument();
			expect(getListingInformationByName.mock.calls).toHaveLength(1);
		});

		it('should fetch the data for a trial type', async () => {
			// This will work for now because we don't care it is
			// an axios instance. When we add in aborting, we will
			// very much care.
			useStateValue.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { trialListingSupportClient: true },
				},
			]);

			getTrialType.mockReturnValue({
				prettyUrlName: 'treatment',
				idString: 'treatment',
				label: 'Treatment',
			});

			const actions = [TrialTypeAction({ trialType: 'treatment' })];

			const cache = new ListingSupportCache();
			await act(async () => {
				render(<UseListingSupportSample cache={cache} actions={actions} />);
			});

			expect(screen.getByText('Payload[0]-ids: treatment')).toBeInTheDocument();
			expect(getTrialType.mock.calls).toHaveLength(1);
		});
	});

	describe('multi-parameter use cases', () => {
		it('handles multiple parameters', async () => {
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

			getTrialType.mockReturnValue({
				prettyUrlName: 'treatment',
				idString: 'treatment',
				label: 'Treatment',
			});

			const actions = [
				IdAction({ ids: ['C4872'] }),
				TrialTypeAction({ trialType: 'treatment' }),
			];

			const cache = new ListingSupportCache();
			await act(async () => {
				render(<UseListingSupportSample cache={cache} actions={actions} />);
			});

			expect(screen.getByText('Payload[0]-ids: C4872')).toBeInTheDocument();
			expect(screen.getByText('Payload[1]-ids: treatment')).toBeInTheDocument();
			expect(getListingInformationById.mock.calls).toHaveLength(1);
			expect(getListingInformationById.mock.calls[0][1]).toEqual(['C4872']);
			expect(getTrialType.mock.calls).toHaveLength(1);
			expect(getTrialType.mock.calls[0][1]).toEqual('treatment');
		});
	});

	describe('route changing use cases', () => {
		it('handles changing concepts from one to another', async () => {
			// This will work for now because we don't care it is
			// an axios instance. When we add in aborting, we will
			// very much care.
			useStateValue.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { trialListingSupportClient: true },
				},
			]);

			getListingInformationById
				.mockReturnValueOnce({
					conceptId: ['C4872'],
					name: {
						label: 'Breast Cancer',
						normalized: 'breast cancer',
					},
					prettyUrlName: 'breast-cancer',
				})
				.mockReturnValueOnce({
					conceptId: ['C99999'],
					name: {
						label: 'Dummy Concept',
						normalized: 'dummy concept',
					},
					prettyUrlName: 'dummy-concept',
				});

			let renderRtn;
			const cache = new ListingSupportCache();

			// Pass 1.
			const actions = [IdAction({ ids: ['C4872'] })];
			await act(async () => {
				renderRtn = render(
					<UseListingSupportSample
						cache={cache}
						actions={actions}
						testId={'round1'}
					/>
				);
			});
			expect(screen.getByText('TestId: round1')).toBeInTheDocument();
			expect(screen.getByText('Payload[0]-ids: C4872')).toBeInTheDocument();

			const actionsPt2 = [IdAction({ ids: ['C99999'] })];
			await act(async () => {
				renderRtn.rerender(
					<UseListingSupportSample
						cache={cache}
						actions={actionsPt2}
						testId={'round2'}
					/>
				);
			});
			expect(screen.getByText('Payload[0]-ids: C99999')).toBeInTheDocument();
			expect(screen.getByText('TestId: round2')).toBeInTheDocument();
			expect(screen.queryByText('TestId: round1')).not.toBeInTheDocument();
			expect(getListingInformationById.mock.calls).toHaveLength(2);
			expect(getListingInformationById.mock.calls[0][1]).toEqual(['C4872']);
			expect(getListingInformationById.mock.calls[1][1]).toEqual(['C99999']);
		});

		it('handles same concept but changing ids from one to another', async () => {
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
				conceptId: ['C1111', 'C2222'],
				name: {
					label: 'Multi-id concept',
					normalized: 'multi-id concept',
				},
				prettyUrlName: 'multi-id-concept',
			});

			let renderRtn;
			const cache = new ListingSupportCache();

			// Pass 1.
			const actions = [IdAction({ ids: ['C1111'] })];
			await act(async () => {
				renderRtn = render(
					<UseListingSupportSample
						cache={cache}
						actions={actions}
						testId={'round1'}
					/>
				);
			});
			expect(screen.getByText('TestId: round1')).toBeInTheDocument();
			expect(
				screen.getByText('Payload[0]-ids: C1111,C2222')
			).toBeInTheDocument();

			const actionsPt2 = [IdAction({ ids: ['C2222'] })];
			await act(async () => {
				renderRtn.rerender(
					<UseListingSupportSample
						cache={cache}
						actions={actionsPt2}
						testId={'round2'}
					/>
				);
			});
			expect(
				screen.getByText('Payload[0]-ids: C1111,C2222')
			).toBeInTheDocument();
			expect(screen.getByText('TestId: round2')).toBeInTheDocument();
			expect(screen.queryByText('TestId: round1')).not.toBeInTheDocument();
			expect(getListingInformationById.mock.calls).toHaveLength(1);
			expect(getListingInformationById.mock.calls[0][1]).toEqual(['C1111']);
		});

		it('handles id to name transition', async () => {
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

			getListingInformationByName.mockImplementation(() => {
				throw new Error('I should not be called');
			});

			let renderRtn;
			const cache = new ListingSupportCache();

			// Pass 1.
			const actions = [IdAction({ ids: ['C4872'] })];
			await act(async () => {
				renderRtn = render(
					<UseListingSupportSample
						cache={cache}
						actions={actions}
						testId={'round1'}
					/>
				);
			});
			expect(screen.getByText('TestId: round1')).toBeInTheDocument();
			expect(screen.getByText('Payload[0]-ids: C4872')).toBeInTheDocument();

			const actionsPt2 = [NameAction({ name: 'breast-cancer' })];
			await act(async () => {
				renderRtn.rerender(
					<UseListingSupportSample
						cache={cache}
						actions={actionsPt2}
						testId={'round2'}
					/>
				);
			});
			expect(screen.getByText('Payload[0]-ids: C4872')).toBeInTheDocument();
			expect(screen.getByText('TestId: round2')).toBeInTheDocument();
			expect(screen.queryByText('TestId: round1')).not.toBeInTheDocument();
			expect(getListingInformationById.mock.calls).toHaveLength(1);
			expect(getListingInformationById.mock.calls[0][1]).toEqual(['C4872']);
		});

		it('handles adding then removing parameters', async () => {
			// This will work for now because we don't care it is
			// an axios instance. When we add in aborting, we will
			// very much care.
			useStateValue.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { trialListingSupportClient: true },
				},
			]);

			getListingInformationById.mockImplementation((client, ids) => {
				if (ids.includes('C1111') || ids.includes('C2222')) {
					return {
						conceptId: ['C1111', 'C2222'],
						name: {
							label: 'Multi-id concept',
							normalized: 'multi-id concept',
						},
						prettyUrlName: 'multi-id-concept',
					};
				} else if (ids.includes('C99999')) {
					return {
						conceptId: ['C99999'],
						name: {
							label: 'Dummy Concept',
							normalized: 'dummy concept',
						},
						prettyUrlName: 'dummy-concept',
					};
				}
			});

			getListingInformationByName.mockImplementation((client, name) => {
				if (name === 'multi-id-concept') {
					return {
						conceptId: ['C1111', 'C2222'],
						name: {
							label: 'Multi-id concept',
							normalized: 'multi-id concept',
						},
						prettyUrlName: 'multi-id-concept',
					};
				} else if (name === 'dummy-concept') {
					return {
						conceptId: ['C99999'],
						name: {
							label: 'Dummy Concept',
							normalized: 'dummy concept',
						},
						prettyUrlName: 'dummy-concept',
					};
				}
			});

			getTrialType.mockImplementation((client, trialType) => {
				if (trialType === 'treatment') {
					return {
						prettyUrlName: 'treatment',
						idString: 'treatment',
						label: 'Treatment',
					};
				}
			});

			let renderRtn;
			const cache = new ListingSupportCache();

			// Round 1
			const actions = [IdAction({ ids: ['C1111', 'C2222'] })];

			await act(async () => {
				renderRtn = render(
					<UseListingSupportSample
						cache={cache}
						actions={actions}
						testId={'round1'}
					/>
				);
			});

			expect(
				screen.getByText('Payload[0]-ids: C1111,C2222')
			).toBeInTheDocument();
			expect(screen.getByText('TestId: round1')).toBeInTheDocument();
			expect(getListingInformationById.mock.calls).toHaveLength(1);
			expect(getListingInformationById.mock.calls[0][1]).toEqual([
				'C1111',
				'C2222',
			]);

			// Round 2
			const actions2 = [
				NameAction({ name: 'multi-id-concept' }),
				TrialTypeAction({ trialType: 'treatment' }),
			];

			await act(async () => {
				renderRtn.rerender(
					<UseListingSupportSample
						cache={cache}
						actions={actions2}
						testId={'round2'}
					/>
				);
			});
			expect(
				screen.getByText('Payload[0]-ids: C1111,C2222')
			).toBeInTheDocument();
			expect(screen.getByText('Payload[1]-ids: treatment')).toBeInTheDocument();
			expect(screen.getByText('TestId: round2')).toBeInTheDocument();
			// ID Should still only be one cause it was not in the actions list.
			expect(getListingInformationById.mock.calls).toHaveLength(1);

			// Name should not have been called because it is cached.
			expect(getListingInformationByName.mock.calls).toHaveLength(0);

			// Trial type should be added.
			expect(getTrialType.mock.calls).toHaveLength(1);
			expect(getTrialType.mock.calls[0][1]).toEqual('treatment');

			// Round 3
			const actions3 = [
				IdAction({ ids: ['C2222'] }),
				TrialTypeAction({ trialType: 'treatment' }),
				NameAction({ name: 'dummy-concept' }),
			];

			await act(async () => {
				renderRtn.rerender(
					<UseListingSupportSample
						cache={cache}
						actions={actions3}
						testId={'round3'}
					/>
				);
			});
			expect(
				screen.getByText('Payload[0]-ids: C1111,C2222')
			).toBeInTheDocument();
			expect(screen.getByText('Payload[1]-ids: treatment')).toBeInTheDocument();
			expect(screen.getByText('Payload[2]-ids: C99999')).toBeInTheDocument();

			expect(screen.getByText('TestId: round3')).toBeInTheDocument();

			// ID should still only be 1 because it was cached.
			expect(getListingInformationById.mock.calls).toHaveLength(1);

			// We should expect trial type to not have been called again
			// because it is cached.
			expect(getTrialType.mock.calls).toHaveLength(1);

			// A new call to get by name hsould have happened because of
			// the new third parameter.
			expect(getListingInformationByName.mock.calls).toHaveLength(1);
			expect(getListingInformationByName.mock.calls[0][1]).toEqual(
				'dummy-concept'
			);

			// Round 4
			const actions4 = [IdAction({ ids: ['C99999'] })];

			await act(async () => {
				renderRtn.rerender(
					<UseListingSupportSample
						cache={cache}
						actions={actions4}
						testId={'round4'}
					/>
				);
			});
			expect(screen.getByText('Payload[0]-ids: C99999')).toBeInTheDocument();
			expect(screen.getByText('TestId: round4')).toBeInTheDocument();

			// Nothing should be fetched now since C99999 is in the cache.
			expect(getListingInformationById.mock.calls).toHaveLength(1);
			expect(getTrialType.mock.calls).toHaveLength(1);
			expect(getListingInformationByName.mock.calls).toHaveLength(1);
		});
	});

	describe('error cases', () => {
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
			const actions = [IdAction({ ids: ['C4872'] })];

			const cache = new ListingSupportCache();
			await act(async () => {
				render(<UseListingSupportSample cache={cache} actions={actions} />);
			});

			// TODO: Make this actually check the payload
			expect(screen.getByText('Payload[0]: null')).toBeInTheDocument();
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

			const actions = [
				{
					type: 'dummy',
					payload: { a: 1 },
				},
			];

			await act(async () => {
				render(<UseListingSupportSample actions={actions} />);
			});

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
			const actions = [IdAction({ ids: ['C4872'] })];

			const cache = new ListingSupportCache();
			await act(async () => {
				render(<UseListingSupportSample cache={cache} actions={actions} />);
			});

			expect(screen.getByText('Error: Bad Mojo')).toBeInTheDocument();
			expect(getListingInformationById.mock.calls).toHaveLength(1);
		});
	});
});
