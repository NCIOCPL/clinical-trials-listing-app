/* eslint-disable */

import React from 'react';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';

const AgeFilter = ({ value, onChange, onFocus }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;

	const handleAgeChange = (e) => {
		const value = e.target.value;
		if (value >= FILTER_CONFIG.age.min && value <= FILTER_CONFIG.age.max) {
			dispatch({
				type: 'SET_FILTER',
				payload: {
					filterType: 'age',
					value: value,
				},
			});
		}
	};

	return (
		<FilterGroup title="Age">
			<input id="age-filter-input" name="age-filter" aria-label="Enter participant age" type="number" className="usa-input form-control" value={filters.age || ''} onChange={handleAgeChange} onFocus={onFocus} min={FILTER_CONFIG.age.min} max={FILTER_CONFIG.age.max} />
		</FilterGroup>
	);
};

export default AgeFilter;
