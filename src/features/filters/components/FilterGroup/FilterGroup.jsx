/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes, { element } from 'prop-types';
import { useTracking } from 'react-tracking';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './FilterGroup.scss';

const FilterGroup = ({ title, helpText, children, defaultExpanded = true, required = false, className = '', id, badge, hasSelectedValues = false }) => {
	const groupId = id || `filter-group-${title.toLowerCase().replace(/\s+/g, '-')}`;
	// const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const contentRef = useRef(null);
	const tracking = useTracking();
	// useEffect(() => {
	// 	// Automatically expand group if it has selected values
	// 	if (hasSelectedValues && !isExpanded) {
	// 		setIsExpanded(true);
	// 	}
	// }, [hasSelectedValues]);

	// const handleToggle = () => {
	// 	setIsExpanded(!isExpanded);
	// 	tracking.trackEvent({
	// 		type: 'Other',
	// 		event: 'TrialListingApp:Filter:GroupToggle',
	// 		filterGroup: title,
	// 		action: !isExpanded ? 'expand' : 'collapse',
	// 	});
	// };

	const container = document.getElementById(`${groupId}-tooltip-container`);
	if (container !== null) {
		const body = document.getElementById(`${groupId}-tooltip-body`);
		container.addEventListener('mouseover', function() {
			body.classList.add('is-visible', 'is-set');
			body.setAttribute('aria-hidden', 'false');
		});

		container.addEventListener('mouseout', function() {
			body.classList.remove('is-visible', 'is-set');
			body.setAttribute('aria-hidden', 'true');
		});
	}
	
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
						{helpText && (
							<span id={`${groupId}-tooltip-container`} className="filter-group__help-icon-container usa-tooltip">
								<span className="filter-group__help-icon usa-tooltip__trigger" role="tooltip" aria-label={helpText} data-position="right" data-tooltip={helpText} tabIndex="0">
									?
								</span>
								<span id={`${groupId}-tooltip-body`} aria-hidden='true' role='tooltip' className='usa-tooltip__body usa-tooltip__body--right'>{helpText}</span>
							</span>
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
				</div>
			</div>
			<div id={`${groupId}-content`} className={`filter-group__content ${defaultExpanded ? 'is-expanded' : ''}`} role="region" aria-labelledby={`${groupId}-header`}>
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
