/**
 * @file This file defines the FilterSection component, a simple container used
 * to structure major sections within the filter sidebar, such as 'Trial Filters'
 * or 'Location Filters'. It provides a title and an optional help icon.
 */
import React from 'react';
import PropTypes from 'prop-types';
import './FilterSection.scss';

/**
 * Renders a distinct section within the filter interface.
 * Includes a title (h2) and an optional help button/icon.
 * The main content is passed as children.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The title displayed for the section.
 * @param {React.ReactNode} props.children - The content (usually FilterGroup components) to be rendered within the section.
 * @param {string} [props.helpText] - Optional text for the aria-label of the help button. If provided, the help button is rendered. Note: The button currently lacks onClick functionality.
 * @returns {JSX.Element} The rendered FilterSection component.
 */
const FilterSection = ({ title, children, helpText }) => {
	return (
		<div className="filter-section">
			{/* Header containing the title and optional help button */}
			<div className="filter-section__header">
				<h2 className="filter-section__title">{title}</h2>
				{/* Render help button only if helpText is provided */}
				{helpText && (
					// TODO: Implement tooltip or modal functionality for the help button.
					<button
						className="filter-section__help"
						aria-label={`Help for ${title}: ${helpText}`} // Include helpText in aria-label for context
						// onClick={() => { /* Implement help display logic */ }}
					>
						<span className="filter-section__help-icon" aria-hidden="true">
							?
						</span>
					</button>
				)}
			</div>
			{/* Container for the main content of the section */}
			<div className="filter-section__content">{children}</div>
		</div>
	);
};

// Define PropTypes for type checking and documentation
FilterSection.propTypes = {
	/** The title displayed for the section (required). */
	title: PropTypes.string.isRequired,
	/** The content (e.g., FilterGroup components) to be rendered within the section (required). */
	children: PropTypes.node.isRequired,
	/** Optional text for the aria-label of the help button. Renders the button if provided. */
	helpText: PropTypes.string,
};

export default FilterSection;
