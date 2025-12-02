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

	it('should scroll to filter area on mobile when there is an error', () => {
		// Set viewport to mobile width
		Object.defineProperty(window, 'innerWidth', {
			value: BREAKPOINTS.MOBILE_LG,
			writable: true,
		});

		// Mock the sidebar element
		const mockSidebar = document.createElement('div');
		mockSidebar.className = 'ctla-sidebar';
		document.body.appendChild(mockSidebar);

		// Mock getBoundingClientRect
		mockSidebar.getBoundingClientRect = jest.fn(() => ({
			top: 200,
			left: 0,
			right: 0,
			bottom: 0,
			width: 0,
			height: 0,
		}));

		// Mock pageYOffset
		Object.defineProperty(window, 'pageYOffset', {
			value: 100,
			writable: true,
		});

		const ScrollMockComponent = () => {
			useScrollRestoration();
			return <div>Test Component</div>;
		};

		// Render with filter update AND scrollToError state
		render(
			<MemoryRouter initialEntries={[{ pathname: '/test', state: { filterUpdate: true, scrollToError: true } }]}>
				<ScrollMockComponent />
			</MemoryRouter>
		);

		// On mobile with error, should scroll to filter area (sidebar position - 20px offset)
		// scrollTop = pageYOffset (100) + sidebarRect.top (200) - 20 = 280
		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 280,
			behavior: 'smooth',
		});

		// Clean up
		document.body.removeChild(mockSidebar);
	});

	it('should scroll to top on mobile with error if sidebar not found', () => {
		// Set viewport to mobile width
		Object.defineProperty(window, 'innerWidth', {
			value: BREAKPOINTS.MOBILE_LG,
			writable: true,
		});

		const ScrollMockComponent = () => {
			useScrollRestoration();
			return <div>Test Component</div>;
		};

		// Render with filter update AND scrollToError state but no sidebar in DOM
		render(
			<MemoryRouter initialEntries={[{ pathname: '/test', state: { filterUpdate: true, scrollToError: true } }]}>
				<ScrollMockComponent />
			</MemoryRouter>
		);

		// Fallback to scroll to top when sidebar not found
		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: 'smooth',
		});
	});
});
