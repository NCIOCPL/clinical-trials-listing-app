/**
 * @file This file defines the FilterGroup component, a container used to visually
 * group related filter controls within the sidebar. It provides a consistent header
 * structure including a title, optional help text tooltip, required indicator, and badge.
 * Note: Expand/collapse functionality was previously present but is currently removed/commented out.
 */
import React from 'react';
import PropTypes from 'prop-types';
// Note: Tracking functionality is currently commented out.
// import { useTracking } from 'react-tracking';
import './FilterGroup.scss';

/**
 * Renders a container for filter controls with a standardized header.
 * Displays a title, and optionally a help icon/tooltip, required indicator, and badge.
 * The content area (children) is always visible but retains styling based on `defaultExpanded`.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The title displayed in the group header.
 * @param {string} [props.helpText] - Optional text for a help tooltip displayed next to the title.
 * @param {React.ReactNode} props.children - The filter control(s) to be rendered within the group.
 * @param {boolean} [props.defaultExpanded=true] - Determines the initial CSS class for styling (e.g., 'is-expanded'), though toggling is disabled.
 * @param {boolean} [props.required=false] - If true, displays a required indicator (*) next to the title.
 * @param {string} [props.className=''] - Additional CSS class names for the root element.
 * @param {string} [props.id] - Optional custom ID for the group; defaults to a generated ID based on the title.
 * @param {string|number} [props.badge] - Optional badge content (e.g., count) displayed next to the title.
 * @param {boolean} [props.hasSelectedValues=false] - If true, adds a specific CSS class (`filter-group--has-selection`) for styling.
 * @returns {JSX.Element} The rendered FilterGroup component.
 */
const FilterGroup = ({ title, helpText, children, defaultExpanded = true, required = false, className = '', id, badge, hasSelectedValues = false }) => {
	// Generate a default ID based on the title if no ID is provided
	const groupId = id || `filter-group-${title.toLowerCase().replace(/\s+/g, '-')}`;
	// const contentRef = useRef(null); // Ref was likely for managing height transition (unused now)
	// const tracking = useTracking(); // Tracking hook initialization (commented out)

	// Commented-out state and effects for expand/collapse functionality:
	// const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	// useEffect(() => {
	// 	// Automatically expand group if it has selected values
	// 	if (hasSelectedValues && !isExpanded) {
	// 		setIsExpanded(true);
	// 	}
	// }, [hasSelectedValues]);

	// Commented-out toggle handler:
	// const handleToggle = () => {
	// 	setIsExpanded(!isExpanded);
	// 	tracking.trackEvent({
	// 		type: 'Other',
	// 		event: 'TrialListingApp:Filter:GroupToggle',
	// 		filterGroup: title,
	// 		action: !isExpanded ? 'expand' : 'collapse',
	// 	});
	// };

	const headerId = `${groupId}-header`;
	const contentId = `${groupId}-content`;

	return (
		<div
			className={`
        filter-group
        ${className}
        ${hasSelectedValues ? 'filter-group--has-selection' : ''}
      `}
			role="group" // Semantically a group of related elements
			aria-labelledby={headerId} // Associated with the header/title
		>
			{/* Header section containing the title and indicators */}
			<div className="filter-group__header">
				<div className="filter-group__title-container">
					{/* Use h3 for the title within the group */}
					<h3 className="filter-group__title" id={headerId}>
						{title}
						{/* Optional Help Text Tooltip */}
						{helpText && (
							<div className="filter-group__help-icon-container">
								{/* Simple tooltip using data-attribute and CSS */}
								<span
									className="filter-group__help-icon"
									role="tooltip"
									aria-label={helpText} // Provide accessible label
									data-tooltip={helpText} // For CSS-based tooltip
								>
									?
								</span>
							</div>
						)}
						{/* Optional Required Indicator */}
						{required && (
							<span className="filter-group__required" aria-label="required">
								*
							</span>
						)}
						{/* Optional Badge */}
						{badge && (
							<span
								className="filter-group__badge"
								aria-label={`${badge} options`} // Context for screen readers
							>
								{badge}
							</span>
						)}
					</h3>
				</div>
				{/* Expand/Collapse Button (Removed/Commented Out) */}
				{/* <button
					type="button"
					className="filter-group__toggle"
					onClick={handleToggle}
					aria-expanded={isExpanded}
					aria-controls={contentId}
				>
					{isExpanded ? 'Collapse' : 'Expand'}
				</button> */}
			</div>
			{/* Content section containing the filter controls */}
			<div
				id={contentId}
				// Apply class based on defaultExpanded, but content is always visible
				className={`filter-group__content ${defaultExpanded ? 'is-expanded' : ''}`}
				role="region" // Content area is a region
				aria-labelledby={headerId} // Associated with the header/title
				// The 'hidden' attribute or height manipulation would be used if toggling was active
				// hidden={!isExpanded}
				// ref={contentRef}
			>
				{children}
			</div>
		</div>
	);
};

// Define PropTypes for type checking and documentation
FilterGroup.propTypes = {
	/** The title displayed in the group header. */
	title: PropTypes.string.isRequired,
	/** Optional text for a help tooltip displayed next to the title. */
	helpText: PropTypes.string,
	/** The filter control(s) or other content to be rendered within the group. */
	children: PropTypes.node.isRequired,
	/** Determines the initial CSS class for styling (e.g., 'is-expanded'). Defaults to true. */
	defaultExpanded: PropTypes.bool,
	/** If true, displays a required indicator (*) next to the title. Defaults to false. */
	required: PropTypes.bool,
	// showHelp: PropTypes.bool, // This prop seems unused
	/** Optional additional CSS class name(s) for the root element. */
	className: PropTypes.string,
	/** Optional custom ID for the group; defaults to a generated ID based on the title. */
	id: PropTypes.string,
	/** Optional badge content (e.g., count) displayed next to the title. */
	badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	/** If true, adds a specific CSS class (`filter-group--has-selection`) for styling. Defaults to false. */
	hasSelectedValues: PropTypes.bool,
};

export default FilterGroup;
