import React from 'react';
import PropTypes from 'prop-types';
import './FilterSection.scss';

const FilterSection = ({ title, children, helpText }) => {
	return (
		<div className="filter-section">
			<div className="filter-section__header">
				<h2 className="filter-section__title">{title}</h2>
				{helpText && (
					<button className="filter-section__help" aria-label={`Help for ${title}`}>
						<span className="filter-section__help-icon">?</span>
					</button>
				)}
			</div>
			<div className="filter-section__content">{children}</div>
		</div>
	);
};

FilterSection.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	helpText: PropTypes.string,
};

export default FilterSection;
