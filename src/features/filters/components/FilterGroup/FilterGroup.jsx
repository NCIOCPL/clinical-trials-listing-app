import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTracking } from 'react-tracking';
import './FilterGroup.scss';

const FilterGroup = ({ title, helpText, children, defaultExpanded = true, required = false, showHelp = false, className = '', id, badge, hasSelectedValues = false }) => {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const contentRef = useRef(null);
	const tracking = useTracking();
	const groupId = id || `filter-group-${title.toLowerCase().replace(/\s+/g, '-')}`;

	useEffect(() => {
		// Automatically expand group if it has selected values
		if (hasSelectedValues && !isExpanded) {
			setIsExpanded(true);
		}
	}, [hasSelectedValues]);

	// const handleToggle = () => {
	// 	setIsExpanded(!isExpanded);
	// 	tracking.trackEvent({
	// 		type: 'Other',
	// 		event: 'TrialListingApp:Filter:GroupToggle',
	// 		filterGroup: title,
	// 		action: !isExpanded ? 'expand' : 'collapse',
	// 	});
	// };

	return (
		<div
			className={`
        filter-group
        ${className}
        ${hasSelectedValues ? 'filter-group--has-selection' : ''}
      `}
			role="group"
			aria-labelledby={`${groupId}-header`}>
			<div className="filter-group__header">
				<div className="filter-group__title-container">
					<h3 className="filter-group__title">
						{title}
						{showHelp && (
							<button
								className="filter-group__help"
								aria-label={`Help information for ${title}`}
								title={helpText}
								onClick={(e) => {
									e.stopPropagation();
								}}>
								?
							</button>
						)}
						{required && (
							<span className="filter-group__required" aria-label="required">
								*
							</span>
						)}
						{badge && (
							<span className="filter-group__badge" aria-label={`${badge} options`}>
								{badge}
							</span>
						)}
					</h3>
					{/*<button id={`${groupId}-header`} className="filter-group__toggle" onClick={handleToggle} aria-expanded={isExpanded} aria-controls={`${groupId}-content`}>*/}
					{/*	<span className="filter-group__toggle-icon" aria-hidden="true">*/}
					{/*		{isExpanded ? '−' : '+'}*/}
					{/*	</span>*/}
					{/*</button>*/}
				</div>

				{helpText && <div className="filter-group__help-text">{helpText}</div>}
			</div>

			<div
				id={`${groupId}-content`}
				ref={contentRef}
				className={`filter-group__content ${isExpanded ? 'is-expanded' : ''}`}
				role="region"
				aria-labelledby={`${groupId}-header`}
				style={{
					maxHeight: isExpanded ? contentRef.current?.scrollHeight + 'px' : 0,
				}}>
				{children}
			</div>
		</div>
	);
};

FilterGroup.propTypes = {
	title: PropTypes.string.isRequired,
	helpText: PropTypes.string,
	children: PropTypes.node.isRequired,
	defaultExpanded: PropTypes.bool,
	required: PropTypes.bool,
	showHelp: PropTypes.bool,
	className: PropTypes.string,
	id: PropTypes.string,
	badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	hasSelectedValues: PropTypes.bool,
};

export default FilterGroup;
