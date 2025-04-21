/**
 * @file This file defines the MobileFilterToggle component, a button specifically
 * designed for mobile viewports to toggle the visibility of the filter sidebar.
 * It also displays a badge indicating the number of currently applied filters.
 */
import React from 'react';
import { useFilters } from '../../context/FilterContext/FilterContext';
import './MobileFilterToggle.scss';

/**
 * Renders a button used on smaller screens to show/hide the filter sidebar.
 * Displays the text "Filters" and a count of applied filters if any exist.
 * Clicking the button dispatches the 'TOGGLE_SIDEBAR' action via the FilterContext.
 *
 * @returns {JSX.Element} The rendered MobileFilterToggle button.
 */
const MobileFilterToggle = () => {
	// Access the filter state and dispatch function from the context
	const { state, dispatch } = useFilters();
	// Get the list of applied filters to display the count
	const { appliedFilters } = state;

	/**
	 * Handles the click event on the toggle button.
	 * Dispatches an action to toggle the sidebar's visibility state in the FilterContext.
	 */
	const handleToggleClick = () => {
		dispatch({ type: 'TOGGLE_SIDEBAR' });
	};

	// Determine the aria-label based on the number of filters applied for better accessibility
	const ariaLabel = appliedFilters.length > 0 ? `Show filters (${appliedFilters.length} applied)` : 'Show filters';

	return (
		<button
			className="mobile-filter-toggle"
			onClick={handleToggleClick}
			aria-label={ariaLabel} // Dynamic aria-label
			// Consider adding aria-controls="sidebar-id" if the sidebar has a stable ID
			// aria-expanded might also be relevant if tracking sidebar state here, but it's in context
		>
			<span className="mobile-filter-toggle__text">Filters</span>
			{/* Conditionally render the count badge if filters are applied */}
			{appliedFilters.length > 0 && (
				<span className="mobile-filter-toggle__count" aria-hidden="true">
					{' '}
					{/* Hide count from screen reader, covered by aria-label */}
					{appliedFilters.length}
				</span>
			)}
		</button>
	);
};

export default MobileFilterToggle;
