import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockAnalyticsProvider } from '../../../../../tracking';
import ResultsListItem from '../ResultsListItem';

jest.mock('../../../../../store/store');

describe('<ResultsListItem />', function () {
	it('should display title, summary and location', () => {
		const locationText = '3 locations';
		const nciId = 'NCI-12984';
		const status = 'sample status';
		const title = 'sample title';
		const resultsItemTitleLink = '/clinicaltrials/{{nci_id}}';
		const locationJSX = (
			<>
				<strong>Location: </strong>
				{locationText}
			</>
		);
		render(
			<MemoryRouter initialEntries={['/']}>
				<MockAnalyticsProvider>
					<ResultsListItem status={status} title={title} locationInfo={locationJSX} nciId={nciId} resultIndex={0} resultsItemTitleLink={resultsItemTitleLink} />
				</MockAnalyticsProvider>
			</MemoryRouter>
		);
		expect(screen.getByText('sample title')).toBeInTheDocument();
		expect(screen.getByText('sample status')).toBeInTheDocument();
		expect(screen.getByText('3 locations')).toBeInTheDocument();
		expect(screen.getByRole('link')).toHaveAttribute('href', '/clinicaltrials/NCI-12984');
	});
});
