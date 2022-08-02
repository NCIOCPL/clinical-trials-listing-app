import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollRestoration = () => {
	const location = useLocation();

	useEffect(() => {
		// Scroll to top on initial load
		window.scrollTo({ top: 0, behavior: 'smooth' });

		window.addEventListener(
			'beforeunload',
			onEventHandler(() => {
				setScrollState(window.pageXOffset, window.pageYOffset);
			})
		);

		window.addEventListener(
			'click',
			onEventHandler((event) => {
				const origin = event.target.closest('a');
				// Only stash scroll state for anchor tags.
				// (Pager uses buttons and will be excluded)
				if (origin) {
					setScrollState(window.pageXOffset, window.pageYOffset);
				}
			})
		);

		const historyState = window.history.state;

		// Apply scroll state if history state contains locationKey
		if (historyState && historyState.locationKey) {
			window.scrollTo(historyState.xOffset, historyState.yOffset);
		}

		return () => {
			// Cleanup
			setScrollState(0, 0);
			window.removeEventListener('beforeunload', onEventHandler);
			window.removeEventListener('click', onEventHandler);
		};
	}, [location.key]);

	const onEventHandler = (onStart) => {
		return (event) => onStart && onStart(event);
	};

	const setScrollState = (xOffset, yOffset) => {
		const scrollState = {
			xOffset,
			yOffset,
			locationKey: location.key,
		};
		window.history.replaceState(scrollState, '', window.location.search);
	};
};
