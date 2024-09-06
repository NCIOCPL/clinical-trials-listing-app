import PropTypes from 'prop-types';
import React from 'react';

import './InputLabel.scss';

const InputLabel = ({ label, labelHint, htmlFor, required, hasError }) => {
	let classes = 'ncids-label';
	classes += required ? ' ncids-label--required' : '';
	classes += hasError ? ' ncids-label--error' : '';
	return (
		<label id={`${htmlFor}-label`} className={classes} htmlFor={htmlFor} data-testid={`tid-${htmlFor}-label`}>
			{label}
			{labelHint && <span className="ncids-hint"> {labelHint}</span>}
		</label>
	);
};

InputLabel.propTypes = {
	hasError: PropTypes.bool,
	htmlFor: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	labelHint: PropTypes.string,
	required: PropTypes.bool,
};

export default InputLabel;
