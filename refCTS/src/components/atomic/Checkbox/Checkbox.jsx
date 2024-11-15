import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { trackFormInputChange } from '../../../store/modules/analytics/tracking/tracking.actions';
import './Checkbox.scss';

const Checkbox = ({
	id,
	label,
	value,
	name,
	classes,
	disabled,
	hideLabel,
	disableTracking,
	...otherProps
}) => {
	const dispatch = useDispatch();

	const handleInput = (event) => {
		if (!disableTracking) {
			trackInteraction(event);
		}
	};

	const trackInteraction = (event) => {
		const { target } = event;
		const { form, id, value } = target;
		const formName = form && form.id ? form.id : null;
		const inputActionProps = {
			formName,
			id,
			value,
		};
		dispatch(trackFormInputChange(inputActionProps));
	};

	return (
		<div className={`cts-checkbox ${classes}`}>
			<input
				id={id}
				className="cts-checkbox__input"
				type="checkbox"
				name={name}
				onInput={handleInput}
				value={value ? value : id}
				disabled={disabled || false}
				{...otherProps}
			/>
			<label className="cts-checkbox__label" htmlFor={id}>
				{hideLabel ? <span className="show-for-sr">{label}</span> : label}
			</label>
		</div>
	);
};

Checkbox.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	disabled: PropTypes.bool,
	classes: PropTypes.string,
	hideLabel: PropTypes.bool,
	disableTracking: PropTypes.bool,
};

Checkbox.defaultProps = {
	classes: '',
	name: 'checkboxes',
	hideLabel: false,
	disableTracking: false,
};

export default Checkbox;
