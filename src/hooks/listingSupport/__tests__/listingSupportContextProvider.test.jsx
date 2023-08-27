import React, { useContext, useEffect } from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router';
import { ListingSupportContext, ListingSupportContextProvider } from '../index';

describe('ListingSupportContextProvider', () => {
	it('keeps cache between multiple routes', async () => {
		const MockComponent = jest.fn().mockImplementation(() => {
			const { cache } = useContext(ListingSupportContext);
			const navigate = useNavigate();

			useEffect(() => {
				cache.add('item1', { a: 1 });
				navigate('/othertest');
			}, []);

			return <div>The component</div>;
		});

		const MockComponent2 = jest.fn().mockImplementation(() => {
			const { cache } = useContext(ListingSupportContext);

			const cacheKeys = cache.keys().join(',');

			return <div>Keys: {cacheKeys}</div>;
		});

		act(() => {
			render(
				<ListingSupportContextProvider>
					<MemoryRouter initialEntries={['/test']}>
						<Routes>
							<Route path="/test" element={<MockComponent />} />
							<Route path="/othertest" element={<MockComponent2 />} />
						</Routes>
					</MemoryRouter>
				</ListingSupportContextProvider>
			);
		});

		expect(MockComponent.mock.calls).toHaveLength(1);
		expect(MockComponent2.mock.calls).toHaveLength(1);
		expect(screen.getByText('Keys: item1')).toBeInTheDocument();
	});
});
