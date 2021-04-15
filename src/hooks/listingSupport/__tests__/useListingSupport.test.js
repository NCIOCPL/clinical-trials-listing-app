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

const UseListingSupportSample = ({ actions }) => {
	const { loading, payload, error, aborted } = useListingSupport(actions);

	return (
		<div>
			{(() => {
				if (!loading && payload) {
					// Smush all the codes together into a string so we can test...
					// TODO: when we write the multiple item tests we need to account
					// for the calls being concept or trials type.
					const ids = payload.reduce((ac, curr) => {
						return (
							(ac === '' ? ac : ac + '|') +
							(curr !== null ? curr.conceptId.join(',') : 'null')
						);
					}, '');
					return <h1>Payload: {ids}</h1>;
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
// Shutup the linter...
UseListingSupportSample.propTypes = {
	actions: PropTypes.array,
};

describe('useListingSupport', () => {
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

		// TODO: Make this actually check the payload
		expect(screen.getByText('Payload: C4872')).toBeInTheDocument();
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

		// TODO: Make this actually check the payload
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
