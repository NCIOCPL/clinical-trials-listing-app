import { act, render } from '@testing-library/react';
import PropTypes from 'prop-types';
import React from 'react';
import { MemoryRouter, useLocation } from 'react-router';

import CTLViewsHoC from '../CTLViewsHoC';
import { MockAnalyticsProvider } from '../../tracking';
import { useCustomQuery } from '../../hooks';
import { useStateValue } from '../../store/store';

jest.mock('../../hooks/customFetch');
jest.mock('../../store/store.js');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		codeOrPurl: 'C4872',
	}),
}));

let location;

const mockComponent = jest.fn(() => {
	return <>Hello World</>;
});

function ComponentWithLocation({ RenderComponent }) {
	location = useLocation();
	return <RenderComponent />;
}

ComponentWithLocation.propTypes = {
	RenderComponent: PropTypes.func,
};

// This must be called before each, or else mockComponent.calls
// will continue to accumulate across all tests.
beforeEach(() => {
	mockComponent.mockClear();
});

describe('<CTLViewsHoc />', () => {
	it('Should assert page is redirected to pretty URL with redirect parameter', async () => {
		const data = {
			conceptId: ['C4872'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer',
			},
			prettyUrlName: 'breast-cancer',
		};

		useCustomQuery.mockReturnValue({
			error: false,
			loading: false,
			status: 200,
			payload: data,
		});

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath: '/',
			},
		]);

		const WrappedComponent = CTLViewsHoC(mockComponent);

		await act(async () => {
			render(
				<MockAnalyticsProvider>
					<MemoryRouter initialEntries={['/']}>
						<ComponentWithLocation RenderComponent={WrappedComponent} />
					</MemoryRouter>
				</MockAnalyticsProvider>
			);
		});

		const expectedLocationObject = {
			pathname: '/breast-cancer',
			search: '?redirect=true',
			hash: '',
			state: null,
			key: expect.any(String),
		};

		expect(location).toMatchObject(expectedLocationObject);
	});
});
