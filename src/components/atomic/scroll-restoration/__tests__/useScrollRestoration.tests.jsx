import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { useScrollRestoration } from '../useScrollRestoration';

describe('useScrollRestoration()', () => {
	it('should confirm initial scroll to top for mock component, and event listeners registered for "beforeunload" and "click"', () => {
		jest.spyOn(window, 'scrollTo');
		jest.spyOn(window, 'addEventListener');

		const ScrollMockComponent = () => {
			useScrollRestoration();
			return null;
		};

		render(
			<MemoryRouter initialEntries={['/']}>
				<ScrollMockComponent />
			</MemoryRouter>
		);

		expect(window.scrollTo).toHaveBeenCalledTimes(1);
		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: 'smooth',
		});
		expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
		expect(window.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
	});

	it('should assert window history replaceState has expected attributes after scroll is set, link is clicked and history back is traversed', async () => {
		const xOffset = 0;
		const yOffset = 850;

		Object.defineProperty(window, 'pageXOffset', {
			value: xOffset,
			writable: true,
		});
		Object.defineProperty(window, 'pageYOffset', {
			value: yOffset,
			writable: true,
		});
		Object.defineProperty(window, 'location.search', {
			value: '',
			writable: true,
		});

		window.history.replaceState = jest.fn();
		const history = createBrowserHistory();

		const ScrollMockComponent = () => {
			useScrollRestoration();
			return (
				<div>
					<a href="http://sample.com">Sample Link Test</a>
				</div>
			);
		};

		render(
			<MemoryRouter initialEntries={['/test']}>
				<ScrollMockComponent />
			</MemoryRouter>
		);

		fireEvent.click(screen.getByText('Sample Link Test'));
		history.back();

		expect(window.history.replaceState).toHaveBeenLastCalledWith(
			{
				xOffset,
				yOffset,
				locationKey: expect.any(String),
			},
			'',
			''
		);
	});
});
