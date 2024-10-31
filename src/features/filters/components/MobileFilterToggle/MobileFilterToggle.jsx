import React from 'react';
import { useFilters } from '../../context/FilterContext/FilterContext';
import './MobileFilterToggle.scss';

const MobileFilterToggle = () => {
	const { state, dispatch } = useFilters();
	const { appliedFilters } = state;

	return (
		<button className="mobile-filter-toggle" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} aria-label="Show filters">
			<span className="mobile-filter-toggle__text">Filters</span>
			{appliedFilters.length > 0 && <span className="mobile-filter-toggle__count">{appliedFilters.length}</span>}
		</button>
	);
};

export default MobileFilterToggle;
