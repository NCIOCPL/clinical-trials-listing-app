import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import ResultsListItem from '../results-list-item';

jest.mock('../../../../../store/store.js');

describe('<ResultsListItem />', function () {
	test('should display title, summary and location', () => {
		const locationText = '3 locations';
		const nciId = 'NCI-12984';
		const summary = 'sample summary';
		const title = 'sample title';
		const resultsItemTitleLink = '/clinicaltrials/{{nci_id}}';
		const locationJSX = (
			<>
				<strong>Location: </strong>
				{locationText}
			</>
		);
		const { container } = render(
			<MemoryRouter initialEntries={['/']}>
				<ResultsListItem
					summary={summary}
					title={title}
					locationInfo={locationJSX}
					nciId={nciId}
					resultsItemTitleLink={resultsItemTitleLink}
				/>
			</MemoryRouter>
		);
		expect(screen.getByText('sample title')).toBeInTheDocument();
		expect(screen.getByText('sample summary')).toBeInTheDocument();
		expect(screen.getByText('3 locations')).toBeInTheDocument();
		expect(container.querySelector('a')).toHaveAttribute(
			'href',
			'/clinicaltrials/NCI-12984'
		);
	});
});
