import React from 'react';
import { render, screen } from '@testing-library/react';
import { useCtsApi } from '../useCtsApi';
import { useStateValue } from '../../../store/store';
import { getClinicalTrials as getClinicalTrialsQuery } from '../../../services/api/actions/getClinicalTrials';
import { getClinicalTrials } from '../../../services/api/clinical-trials-search-api/getClinicalTrials';

jest.mock('../../../store/store');
jest.mock('../../../services/api/clinical-trials-search-api/getClinicalTrials.js');

describe('tests for useCtsApi', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	/* eslint-disable react/prop-types */

	const UseCtsApiSupportSample = ({ query }) => {
		const { loading, payload, error, aborted } = useCtsApi(query);

		return (
			<div>
				{(() => {
					if (!loading && payload) {
						return (
							<>
								<h1>Payload</h1>
								Total: {payload.total}
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

	it('should fetch the data with one requestFilter in the query', async () => {
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		getClinicalTrials.mockReturnValue({
			total: 1,
			trials: [
				{
					brief_summary: 'first summary',
					brief_title: 'first title',
					current_trial_status: 'Active',
					nci_id: 'NCI-2015-00054',
					sites: 0,
				},
			],
		});

		const requestFilters = {
			'arms.interventions.intervention_code': ['C1234'],
		};

		const query = getClinicalTrialsQuery({
			from: 0,
			requestFilters,
			size: 1,
		});

		const expected = {
			current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
			include: ['brief_summary', 'brief_title', 'current_trial_status', 'nci_id', 'nct_id', 'sites.org_name', 'sites.org_country', 'sites.org_state_or_province', 'sites.org_city', 'sites.recruitment_status'],
			'arms.interventions.intervention_code': ['C1234'],
			from: 0,
			size: 1,
		};

		render(<UseCtsApiSupportSample query={query} />);

		expect(await screen.findByText('Payload')).toBeInTheDocument();

		expect(getClinicalTrials.mock.calls).toHaveLength(1);
		expect(getClinicalTrials.mock.calls[0][1]).toEqual(expected);
		// Todo: check that the expected text is on the page.
	});

	it('should handle an AbortError when calling getClinicalTrials with client and query params', async () => {
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		let isErrorThrown = false;

		getClinicalTrials.mockImplementation(() => {
			isErrorThrown = true;
			const err = new Error('AbortError');
			err.name = 'AbortError';
			throw err;
		});

		const requestFilters = {
			'arms.interventions.intervention_code': ['C1234'],
		};

		const query = getClinicalTrialsQuery({
			from: 0,
			requestFilters,
			size: 1,
		});

		const expected = {
			current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
			include: ['brief_summary', 'brief_title', 'current_trial_status', 'nci_id', 'nct_id', 'sites.org_name', 'sites.org_country', 'sites.org_state_or_province', 'sites.org_city', 'sites.recruitment_status'],
			'arms.interventions.intervention_code': ['C1234'],
			from: 0,
			size: 1,
		};

		render(<UseCtsApiSupportSample query={query} />);

		expect(await screen.findByText('Aborted: This should not happen')).toBeInTheDocument();

		expect(getClinicalTrials.mock.calls).toHaveLength(1);
		expect(getClinicalTrials.mock.calls[0][1]).toEqual(expected);
		expect(isErrorThrown).toBeTruthy();
	});

	it('should handle any other kind of error when calling getClinicalTrials with client and query params', async () => {
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				apiClients: { trialListingSupportClient: true },
			},
		]);

		let isErrorThrown = false;

		getClinicalTrials.mockImplementation(() => {
			isErrorThrown = true;
			const err = new Error('WIERDERROR');
			err.name = 'WEIRDERROR';
			throw err;
		});

		const requestFilters = {
			'arms.interventions.intervention_code': ['C1234'],
		};

		const query = getClinicalTrialsQuery({
			from: 0,
			requestFilters,
			size: 1,
		});

		const expected = {
			current_trial_status: ['Active', 'Approved', 'Enrolling by Invitation', 'In Review', 'Temporarily Closed to Accrual', 'Temporarily Closed to Accrual and Intervention'],
			include: ['brief_summary', 'brief_title', 'current_trial_status', 'nci_id', 'nct_id', 'sites.org_name', 'sites.org_country', 'sites.org_state_or_province', 'sites.org_city', 'sites.recruitment_status'],
			'arms.interventions.intervention_code': ['C1234'],
			from: 0,
			size: 1,
		};

		render(<UseCtsApiSupportSample query={query} />);

		expect(await screen.findByText('Error: WIERDERROR')).toBeInTheDocument();

		expect(getClinicalTrials.mock.calls).toHaveLength(1);
		expect(getClinicalTrials.mock.calls[0][1]).toEqual(expected);
		expect(isErrorThrown).toBeTruthy();
	});
});
