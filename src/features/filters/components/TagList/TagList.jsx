import React from 'react';
import PropTypes from 'prop-types';
import './TagList.scss';

const TagList = ({ tags, onRemove }) => {
	if (!tags.length) return null;

	return (
		<div className="tag-list" role="list">
			{tags.map((tag) => (
				<div key={tag.id} className="tag-list__item" role="listitem">
					<span className="tag-list__text">{tag.label}</span>
					<button type="button" className="tag-list__remove" onClick={() => onRemove(tag)} aria-label={`Remove ${tag.label}`}>
						×
					</button>
				</div>
			))}
		</div>
	);
};

TagList.propTypes = {
	tags: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	onRemove: PropTypes.func.isRequired,
};

export default TagList;
