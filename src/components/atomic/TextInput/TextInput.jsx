import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import './TextInput.scss';

import InputLabel from '../InputLabel';

const TextInput = ({
	action = () => {},
	allowedChars,
	classes = '',
	disabled = false,
	enableSpellCheck = false,
	errorMessage,
	id,
	inputHelpText,
	isValid, // Todo: might no longer be valid
	label,
	labelHidden,
	labelHint,
	maxLength,
	name,
	onBlur,
	placeHolder,
	required = false,
	modified = false,
	type = 'text',
	value,
}) => {
	const [hasError, setError] = useState(false);
	const [inputValue, setInputValue] = useState(value || '');
	const [isPristine, setPristine] = useState(true);

	let error = null,
		helpText = null,
		ariaLabel = null;

	if (hasError) {
		error = (
			<span
				className="ncids-input__error-message"
				data-testid="tid-error"
				role="alert">
				{errorMessage}
			</span>
		);
	}

	if (inputHelpText) {
		helpText = <span className="ncids-input__help-text">{inputHelpText}</span>;
	}

	ariaLabel = labelHidden
		? { 'aria-label': label }
		: { 'aria-labelledby': `${id}-label` };

	useEffect(() => {
		setError(!!errorMessage);
	}, [errorMessage]);

	//  onBlur event on input
	const handleBlur = () => {
		if (onBlur) {
			onBlur();
		}
	};

	const handleChange = (event) => {
		// Check if allowedChars validator exists. If it does, check the last char
		// entered against the validator. If validation fails, return thereby preventing
		// the value from being added to the state.
		if (allowedChars) {
			let input = event.target.value.slice(-1);
			if (!allowedChars.isValid(input)) {
				return;
			}
		}

		// Call action handler prop
		action(event);

		// Commit the input's value to state inputValue.
		setInputValue(event.target.value);
		// Set pristine state to false
		if (isPristine) {
			setPristine(false);
		}
	};

	return (
		<div
			className={`ncids-input-group ${
				hasError ? 'ncids-input-group--error ' : ''
			}${classes}`}>
			{labelHidden ? null : (
				<InputLabel
					label={label}
					labelHint={labelHint}
					htmlFor={id}
					hasError={hasError}
					required={required}
				/>
			)}
			{error}
			<input
				id={id}
				name={name || id}
				type={type}
				value={inputValue}
				className={`ncids-input ${
					hasError ? 'ncids-input--error ' : ''
				}${classes} ${modified ? 'ncids-input--modified' : ''}`}
				required={required}
				maxLength={maxLength}
				placeholder={placeHolder}
				aria-required={required}
				disabled={disabled}
				onBlur={handleBlur}
				onChange={handleChange}
				spellCheck={enableSpellCheck ? true : false}
				{...ariaLabel}
			/>
			{helpText}
		</div>
	);
};

TextInput.propTypes = {
	action: PropTypes.func,
	allowedChars: PropTypes.object,
	classes: PropTypes.string,
	disabled: PropTypes.bool,
	enableSpellCheck: PropTypes.bool,
	errorMessage: PropTypes.string,
	id: PropTypes.string.isRequired,
	inputHelpText: PropTypes.string,
	isValid: PropTypes.bool,
	label: PropTypes.string.isRequired,
	labelHidden: PropTypes.bool,
	labelHint: PropTypes.string,
	maxLength: PropTypes.number,
	name: PropTypes.string,
	onBlur: PropTypes.func,
	placeHolder: PropTypes.string,
	required: PropTypes.bool,
	modified: PropTypes.bool,
	type: PropTypes.oneOf([
		'text',
		'email',
		'password',
		'search',
		'url',
		'date',
		'month',
		'tel',
		'week',
		'number',
	]),
	value: PropTypes.string,
};

export default TextInput;
