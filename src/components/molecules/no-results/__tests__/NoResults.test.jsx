import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import NoResults from '../no-results';
import { useStateValue } from '../../../../store/store';
import { MockAnalyticsProvider } from '../../../../tracking';

jest.mock('../../../../store/store');

describe('<NoResults />', () => {
	it('should contain component text', async () => {
		const noTrialsHtml = 'There are currently no available trials.';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				noTrialsHtml,
			},
		]);

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/']}>
					<NoResults />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);
		expect(screen.getByText('There are currently no available trials.')).toBeInTheDocument();
	});

	it('should contain replaced component text', async () => {
		const noTrialsHtml = 'There are currently no available trials.';
		const replacedNoTrialsHtml = 'There are currently no available trials for chronic fatigue syndrome.';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				noTrialsHtml,
			},
		]);

		render(
			<MockAnalyticsProvider>
				<MemoryRouter initialEntries={['/']}>
					<NoResults replacedNoTrialsHtml={replacedNoTrialsHtml} />
				</MemoryRouter>
			</MockAnalyticsProvider>
		);
		expect(screen.getByText('There are currently no available trials for chronic fatigue syndrome.')).toBeInTheDocument();
	});
});
