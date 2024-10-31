import React from 'react';
import PropTypes from 'prop-types';
import { useTracking } from 'react-tracking';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './CheckboxGroup.scss';

const CheckboxGroup = ({ selectedValues = [], onChange, name, disabled = false }) => {
	const tracking = useTracking();

	const filterConfig = FILTER_CONFIG[name];

	const handleChange = (value, checked) => {
		const newValues = checked ? [...selectedValues, value] : selectedValues.filter((v) => v !== value);

		onChange(newValues);

		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Change',
			filterType: name,
			filterValue: value,
			action: checked ? 'select' : 'deselect',
		});
	};

	return (
		<div className="checkbox-group" role="group" aria-label={filterConfig.title}>
			{filterConfig.options.map((option) => (
				<label key={option.value} className="checkbox-group__item">
					<input type="checkbox" className="checkbox-group__input" checked={selectedValues.includes(option.value)} onChange={(e) => handleChange(option.value, e.target.checked)} disabled={disabled} value={option.value} aria-label={option.label} />
					<span className="checkbox-group__label">{option.label}</span>
				</label>
			))}
		</div>
	);
};

CheckboxGroup.propTypes = {
	selectedValues: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func.isRequired,
	name: PropTypes.oneOf(Object.keys(FILTER_CONFIG)).isRequired,
	disabled: PropTypes.bool,
};

export default CheckboxGroup;
