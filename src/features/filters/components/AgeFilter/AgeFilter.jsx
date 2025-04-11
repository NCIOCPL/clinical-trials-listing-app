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

		// Validate input is a number
		const numericValue = parseInt(inputValue, 10);
		if (isNaN(numericValue)) {
			// Don't update for non-numeric input
			return;
		}

		// Ignore leading zeros (except when input is just a single '0')
		const hasLeadingZeros = inputValue.length > 1 && inputValue[0] === '0';
		if (hasLeadingZeros) {
			return; // aka do nothing
		}

		// Check range constraints
		if (numericValue < FILTER_CONFIG.age.min || numericValue > FILTER_CONFIG.age.max) {
			// Prevent the update
			return;
		}

		// Only update if input is valid number in correct format
		if (numericValue.toString() === inputValue) {
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
