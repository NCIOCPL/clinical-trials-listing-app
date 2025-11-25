import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BREAKPOINTS } from '../../../constants/breakpoints';

export const useScrollRestoration = () => {
	const location = useLocation();
	const scrollPositions = useRef({});
	const prevLocationKey = useRef(location.key);

	useEffect(() => {
		const isFilterUpdate = location.state?.filterUpdate;
		const isMobileOrTablet = window.innerWidth < BREAKPOINTS.DESKTOP;

		// Skip scroll-to-top for filter updates on mobile/tablet only
		// On desktop (1024px+), filters are in a sidebar so scrolling to top is appropriate
		// On mobile/tablet (<1024px), filters are inline so scrolling disrupts the user experience
		if (isFilterUpdate && isMobileOrTablet) {
			prevLocationKey.current = location.key;
			return;
		}

		// Save scroll position for the previous location before scrolling
		if (prevLocationKey.current && prevLocationKey.current !== location.key) {
			scrollPositions.current[prevLocationKey.current] = {
				x: window.pageXOffset,
				y: window.pageYOffset,
			};
		}

		// Check if we have a saved position for this location (back/forward navigation)
		const savedPosition = scrollPositions.current[location.key];

		if (savedPosition && !isFilterUpdate) {
			// Restore saved position for back/forward navigation
			window.scrollTo(savedPosition.x, savedPosition.y);
		} else {
			// Scroll to top for new navigations, filter updates on desktop, or initial load
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}

		prevLocationKey.current = location.key;

		// Handle beforeunload to save position when leaving the page
		const handleBeforeUnload = () => {
			scrollPositions.current[location.key] = {
				x: window.pageXOffset,
				y: window.pageYOffset,
			};
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [location.key, location.state?.filterUpdate]);
};
