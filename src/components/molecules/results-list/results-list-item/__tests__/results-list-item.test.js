import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import ResultsListItem from '../results-list-item';
import { useStateValue } from '../../../../../store/store';

jest.mock('../../../../../store/store.js');

describe('<ResultsListItem />', function () {
	test('should display title, summary and location', () => {
		const locationText = '3 locations';
		const nciId = 'NCI-12984';
		const summary = 'sample summary';
		const title = 'sample title';

		useStateValue.mockReturnValue([
			{ resultsItemTitleLink: 'http://sample.com/test-url/v' },
		]);

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
				/>
			</MemoryRouter>
		);
		expect(screen.getByText('sample title')).toBeInTheDocument();
		expect(screen.getByText('sample summary')).toBeInTheDocument();
		expect(screen.getByText('3 locations')).toBeInTheDocument();
		expect(container.querySelector('a')).toHaveAttribute(
			'href',
			'http://sample.com/test-url/v?id=NCI-12984'
		);
	});
});
