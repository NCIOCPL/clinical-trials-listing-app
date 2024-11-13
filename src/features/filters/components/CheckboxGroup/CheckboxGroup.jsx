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
				<div className="usa-checkbox checkbox-group__item">
					<input className="usa-checkbox__input checkbox-group__input" id={option.value} type="checkbox" value={option.value} checked={selectedValues.includes(option.value)} onChange={(e) => handleChange(option.value, e.target.checked)} aria-label={option.label} />
					<label className="usa-checkbox__label checkbox-group__label" htmlFor={option.value}>
						{option.label}
					</label>
				</div>
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
