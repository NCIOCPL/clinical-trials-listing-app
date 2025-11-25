import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useScrollRestoration } from '../useScrollRestoration';
import { BREAKPOINTS } from '../../../../constants/breakpoints';

describe('useScrollRestoration()', () => {
	let originalInnerWidth;

	beforeEach(() => {
		originalInnerWidth = window.innerWidth;
		jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
		jest.spyOn(window, 'addEventListener');
		jest.spyOn(window, 'removeEventListener');
	});

	afterEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			value: originalInnerWidth,
			writable: true,
		});
		jest.restoreAllMocks();
	});

	it('should scroll to top on initial render and register beforeunload event listener', () => {
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
	});

	it('should scroll to top on desktop when filter is updated', () => {
		// Set viewport to desktop width
		Object.defineProperty(window, 'innerWidth', {
			value: BREAKPOINTS.DESKTOP,
			writable: true,
		});

		const ScrollMockComponent = () => {
			useScrollRestoration();
			return <div>Test Component</div>;
		};

		// Render with filter update state - on desktop this should scroll to top
		render(
			<MemoryRouter initialEntries={[{ pathname: '/test', state: { filterUpdate: true } }]}>
				<ScrollMockComponent />
			</MemoryRouter>
		);

		// On desktop, should scroll to top even for filter updates
		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: 'smooth',
		});
	});

	it('should NOT scroll to top on mobile when filter is updated', () => {
		// Set viewport to mobile width
		Object.defineProperty(window, 'innerWidth', {
			value: BREAKPOINTS.MOBILE_LG,
			writable: true,
		});

		const ScrollMockComponent = () => {
			useScrollRestoration();
			return <div>Test Component</div>;
		};

		// Render with filter update state from the start
		render(
			<MemoryRouter initialEntries={[{ pathname: '/test', state: { filterUpdate: true } }]}>
				<ScrollMockComponent />
			</MemoryRouter>
		);

		// On mobile with filter update, should skip scroll to top
		expect(window.scrollTo).not.toHaveBeenCalled();
	});

	it('should NOT scroll to top on tablet when filter is updated', () => {
		// Set viewport to tablet width (less than desktop breakpoint)
		Object.defineProperty(window, 'innerWidth', {
			value: BREAKPOINTS.TABLET_LG,
			writable: true,
		});

		const ScrollMockComponent = () => {
			useScrollRestoration();
			return <div>Test Component</div>;
		};

		// Render with filter update state
		render(
			<MemoryRouter initialEntries={[{ pathname: '/test', state: { filterUpdate: true } }]}>
				<ScrollMockComponent />
			</MemoryRouter>
		);

		// On tablet with filter update, should skip scroll to top
		expect(window.scrollTo).not.toHaveBeenCalled();
	});

	it('should clean up beforeunload event listener on unmount', () => {
		const ScrollMockComponent = () => {
			useScrollRestoration();
			return null;
		};

		const { unmount } = render(
			<MemoryRouter initialEntries={['/']}>
				<ScrollMockComponent />
			</MemoryRouter>
		);

		unmount();

		expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
	});
});
