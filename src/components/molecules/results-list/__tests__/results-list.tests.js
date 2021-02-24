import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { ResultsList } from '../../../index';
import { useStateValue } from '../../../../store/store';

jest.mock('../../../../store/store.js');

describe('<ResultsList />', () => {
	test('', () => {
		const resultsList = [
			{
				brief_summary: 'Test brief summary 1',
				brief_title: 'Test brief title 1',
				current_trial_status: 'Active',
				nci_id: 'NCI-120803',
				nct_id: 'NCT2364746',
				sites: [
					{
						org_country: 'United States',
						org_name: 'Wingstop',
						org_city: 'Gaithersburg',
						org_state_or_province: 'MD',
						recruitment_status: 'approved'
					},
				],
			},
			{
				brief_summary: 'Test brief summary 2',
				brief_title: 'Test brief title 2',
				current_trial_status: 'In Review',
				nci_id: 'NCI-354788',
				nct_id: 'NCT884563',
				sites: [
					{
						org_country: 'United Kingdom',
						org_name: 'Johnson & Johnson',
						org_city: 'Arlington',
						org_state_or_province: 'VA',
						recruitment_status: 'in review'
					},
				],
			},
		];

		useStateValue.mockReturnValue([
			{ resultsItemTitleLink: 'http://sample.com/test-url/v' },
		]);

		render(
			<MemoryRouter initialEntries={['/']}>
				<ResultsList results={resultsList} />
			</MemoryRouter>
		);

		let expectedLocationInfo;

		expect(screen.getByText('Test brief summary 1')).toBeInTheDocument();
		expect(screen.getByText('Test brief title 1')).toBeInTheDocument();
		expect(screen.getByText('Test brief title 1').closest('a')).toHaveAttribute(
			'href',
			'http://sample.com/test-url/v?id=NCI-120803'
		);
		expectedLocationInfo = 'Wingstop, Gaithersburg, Maryland';
		expect(screen.getByText(expectedLocationInfo)).toBeInTheDocument();
		expect(screen.getByText('Test brief summary 2')).toBeInTheDocument();
		expect(screen.getByText('Test brief title 2')).toBeInTheDocument();
		expect(screen.getByText('Test brief title 2').closest('a')).toHaveAttribute(
			'href',
			'http://sample.com/test-url/v?id=NCI-354788'
		);
		expectedLocationInfo = 'Location information is not yet available.';
		expect(screen.getByText(expectedLocationInfo)).toBeInTheDocument();
	});
});
