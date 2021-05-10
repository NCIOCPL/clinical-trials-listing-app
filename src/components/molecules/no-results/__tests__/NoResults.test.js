import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import NoResults from '../no-results';
import { useStateValue } from '../../../../store/store.js';
import { MockAnalyticsProvider } from '../../../../tracking';

jest.mock('../../../../store/store.js');

describe('<NoResults />', () => {
	test('should contain component text', async () => {
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
		expect(
			screen.getByText('There are currently no available trials.')
		).toBeInTheDocument();
	});
});
