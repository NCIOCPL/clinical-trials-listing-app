/* eslint-disable */
import React from 'react';
import { useFilters } from '../../context/FilterContext/FilterContext';
import './AppliedFilters.scss';

const AppliedFilters = () => {
	const { state, dispatch } = useFilters();
	const { appliedFilters } = state;

	if (appliedFilters.length === 0) {
		return null;
	}

	const handleRemoveFilter = (filterType, value) => {
		dispatch({
			type: 'REMOVE_FILTER',
			payload: { filterType, value },
		});
		dispatch({ type: 'APPLY_FILTERS' });
	};

	const handleClearAll = () => {
		dispatch({ type: 'CLEAR_FILTERS' });
	};

	const formatFilterLabel = (filter) => {
		switch (filter.type) {
			case 'subtype':
				return {
					label: filter.values.map((value) => value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())),
					displayType: 'Subtype',
				};
			case 'stage':
				return {
					label: filter.values.map((value) => `Stage ${value.split('_')[1].toUpperCase()}`),
					displayType: 'Stage',
				};
			case 'drugIntervention':
				return {
					label: filter.values,
					displayType: 'Drug/Intervention',
				};
			case 'age':
				const ageLabels = {
					child: 'Child (birth - 17)',
					adult: 'Adult (18 - 64)',
					older_adult: 'Older Adult (65+)',
				};
				return {
					label: filter.values.map((value) => ageLabels[value] || value),
					displayType: 'Age',
				};
			case 'location':
				return {
					label: [`Within ${filter.values.radius} miles of ${filter.values.zipCode}`],
					displayType: 'Location',
				};
			default:
				return {
					label: filter.values,
					displayType: filter.type,
				};
		}
	};

	return (
		<div className="applied-filters">
			<div className="applied-filters__header">
				<h3>Applied Filters</h3>
				<button className="applied-filters__clear-all" onClick={handleClearAll}>
					Clear All
				</button>
			</div>
			<div className="applied-filters__content">
				{appliedFilters.map((filter) => {
					const { label, displayType } = formatFilterLabel(filter);
					return label.map((value, index) => (
						<div key={`${filter.type}-${value}-${index}`} className="applied-filters__tag">
							<span className="applied-filters__tag-type">{displayType}:</span>
							<span className="applied-filters__tag-value">{value}</span>
							<button onClick={() => handleRemoveFilter(filter.type, filter.values[index])} className="applied-filters__tag-remove" aria-label={`Remove ${value} filter`}>
								×
							</button>
						</div>
					));
				})}
			</div>
		</div>
	);
};

export default AppliedFilters;
