import PropTypes from 'prop-types';
import React from 'react';

import './Radio.scss';

const Radio = ({ id, label, className, disabled, value, ...otherProps }) => {
	return (
		<div className={`ncids-radio ${className}`}>
			<input className="ncids-radio__input" type="radio" disabled={disabled} aria-disabled={disabled} id={id} value={value ? value : id} {...otherProps} />
			<label className="ncids-radio__label" htmlFor={id}>
				{label}
			</label>
		</div>
	);
};

Radio.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	name: PropTypes.string,
	value: PropTypes.string,
	checked: PropTypes.bool,
	defaultChecked: PropTypes.bool,
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
	className: PropTypes.string,
};

Radio.defaultProps = {
	name: 'radios',
	disabled: false,
	className: '',
};

export default Radio;
