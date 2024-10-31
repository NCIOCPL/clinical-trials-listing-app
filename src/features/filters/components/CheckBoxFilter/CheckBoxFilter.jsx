import React from 'react';
import PropTypes from 'prop-types';
import { useTracking } from 'react-tracking';
import './CheckboxFilter.scss';

const CheckboxFilter = ({ options, selectedValues, onChange, name, disabled = false }) => {
	const tracking = useTracking();

	const handleChange = (value, checked) => {
		const newValues = checked ? [...selectedValues, value] : selectedValues.filter((v) => v !== value);

		onChange(newValues);

		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Checkbox',
			filterName: name,
			value,
			action: checked ? 'select' : 'deselect',
		});
	};

	return (
		<div className="checkbox-filter" role="group">
			{options.map((option) => (
				<label key={option.value} className="checkbox-filter__item">
					<input type="checkbox" className="checkbox-filter__input" checked={selectedValues.includes(option.value)} onChange={(e) => handleChange(option.value, e.target.checked)} disabled={disabled} value={option.value} aria-label={option.label} />
					<span className="checkbox-filter__label">{option.label}</span>
				</label>
			))}
		</div>
	);
};

CheckboxFilter.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
};

export default CheckboxFilter;
