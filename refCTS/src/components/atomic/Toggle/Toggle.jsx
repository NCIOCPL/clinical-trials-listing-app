import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { trackFormInputChange } from '../../../store/modules/analytics/tracking/tracking.actions';
import './Toggle.scss';

const Toggle = ({ id, classes, label, onClick, checked, ...otherProps }) => {
	const dispatch = useDispatch();

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

	const handleChange = (e) => {
		onClick(e);
	};
	return (
		<div className={`cts-toggle ${classes}`}>
			<input
				type="checkbox"
				className="cts-toggle__input"
				id={id}
				onInput={trackInteraction}
				checked={checked}
				{...otherProps}
				onClick={handleChange}
			/>
			<label className="cts-toggle__label" htmlFor={id} aria-label={label}>
				<span aria-hidden="true" className="neg">
					No
				</span>
				<span aria-hidden="true" className="pos">
					Yes
				</span>
			</label>
		</div>
	);
};

Toggle.propTypes = {
	id: PropTypes.string,
	classes: PropTypes.string,
	label: PropTypes.string,
	onClick: PropTypes.func,
	checked: PropTypes.bool,
};

Toggle.defaultProps = {
	classes: '',
	label: '',
	onClick: {},
	checked: false,
};

export default Toggle;
