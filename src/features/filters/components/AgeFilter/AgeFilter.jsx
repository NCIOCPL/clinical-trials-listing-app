/* eslint-disable */

import React from 'react';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';

const AgeFilter = ({ value, onChange, onFocus, disabled }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;

	const handleAgeChange = (e) => {
		// Get the raw input value
		const inputValue = e.target.value;

		// If the input is empty, clear the filter
		if (inputValue === '') {
			dispatch({
				type: 'SET_FILTER',
				payload: {
					filterType: 'age',
					value: '',
				},
			});
			return;
		}

		// Convert to a number and ensure it's positive
		const numericValue = parseInt(inputValue, 10);

		// Only dispatch if it's a valid positive number within range
		if (!isNaN(numericValue) &&
			numericValue >= FILTER_CONFIG.age.min &&
			numericValue <= FILTER_CONFIG.age.max &&
			numericValue.toString() === inputValue) { // Ensures no leading minus sign

			dispatch({
				type: 'SET_FILTER',
				payload: {
					filterType: 'age',
					value: numericValue,
				},
			});
		}
	};

	return (
		<FilterGroup title="Age">
			<input
				id="age-filter-input"
				name="age-filter"
				aria-label="Enter participant age"
				type="number"
				className="usa-input form-control"
				value={filters.age || ''}
				onChange={handleAgeChange}
				onFocus={onFocus}
				min={FILTER_CONFIG.age.min}
				max={FILTER_CONFIG.age.max}
				pattern="[0-9]*"
				inputMode="numeric"
				disabled={disabled}
			/>
		</FilterGroup>
	);
};

export default AgeFilter;
