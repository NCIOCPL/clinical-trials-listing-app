import React from 'react';
import PropTypes from 'prop-types';
import { uniqueIdForComponent } from '../../../utilities';
import InputLabel from '../InputLabel';
import './TextInput.scss';
import { connect } from 'react-redux';
import { trackFormInputChange } from '../../../store/modules/analytics/tracking/tracking.actions';

class TextInput extends React.Component {
	static propTypes = {
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
		trackFormInputChange: PropTypes.func,
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
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	};

	static defaultProps = {
		action: () => {},
		classes: '',
		type: 'text',
		enableSpellCheck: false,
		required: false,
		modified: false,
		disabled: false,
	};

	constructor(props) {
		super(props);

		let pristine = true;
		if (this.props.value || this.props.errorMessage) {
			pristine = false;
		}

		this.state = {
			value: this.props.value || '',
			isPristine: pristine,
			isValid: this.props.isValid ? true : false,
			hasError: this.props.errorMessage ? true : false,
			errorMessageBody: this.props.errorMessage,
		};

		// Generate an HTML ID if one was not provided
		this.id = this.props.id || uniqueIdForComponent();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.value !== this.props.value) {
			this.setState({
				...this.state,
				value: this.props.value,
			});
		}

		// If an errorMessage is passed after initial render, adjust the state accordingly
		if (prevProps.errorMessage !== this.props.errorMessage) {
			this.setState({
				isPristine: false,
				isValid: false,
				hasError: this.props.errorMessage !== '',
				errorMessageBody: this.props.errorMessage,
			});
		}
	}

	render() {
		let error,
			helpText,
			ariaLabel = null;

		if (this.state.hasError) {
			error = (
				<span className="cts-input__error-message" role="alert">
					{this.state.errorMessageBody}
				</span>
			);
		}
		if (this.props.inputHelpText) {
			helpText = (
				<span className="cts-input__help-text">{this.props.inputHelpText}</span>
			);
		}

		ariaLabel = this.props.labelHidden
			? { 'aria-label': this.props.label }
			: { 'aria-labelledby': this.props.id + '-label' };

		return (
			<div
				className={`cts-input-group ${
					this.state.hasError ? 'cts-input-group--error ' : ''
				}${this.props.classes}`}>
				{this.props.labelHidden ? null : (
					<InputLabel
						label={this.props.label}
						labelHint={this.props.labelHint}
						htmlFor={this.id}
						hasError={this.state.hasError}
						required={this.props.required}
					/>
				)}
				{error}
				<input
					id={this.id}
					name={this.props.name || this.id}
					type={this.props.type}
					value={this.state.value}
					className={`cts-input ${
						this.state.hasError ? 'cts-input--error ' : ''
					}${this.props.classes} ${
						this.props.modified ? 'cts-input--modified' : ''
					}`}
					required={this.props.required}
					maxLength={this.props.maxLength}
					placeholder={this.props.placeHolder}
					aria-required={this.props.required}
					disabled={this.props.disabled}
					onBlur={this._handleBlur.bind(this)}
					onChange={this._handleChange.bind(this)}
					onInput={this._internalTrackInputChange.bind(this)}
					spellCheck={this.props.enableSpellCheck ? true : false}
					{...ariaLabel}
				/>
				{helpText}
			</div>
		);
	}

	//  onBlur event on input
	_handleBlur() {
		if ((this.props.required || this.props.onBlur) && !this.state.isPristine) {
			this.props.onBlur();
		}
	}

	/**
	 * Shared change handler for field tracking
	 * @param {Object} event
	 */
	_internalTrackInputChange(event) {
		const { target } = event;

		const { form, id, value } = target;
		const { trackFormInputChange } = this.props;
		const { errorMessageBody, hasError } = this.state;
		const formName = form && form.id ? form.id : null;
		const inputActionProps = {
			errorMessage: errorMessageBody,
			formName,
			hasError,
			id,
			value,
		};
		trackFormInputChange(inputActionProps);
		return true;
	}

	//  his function runs every time the user changes the contents of the input.
	//  @param {event} event The event
	_handleChange(event) {
		// Check if allowedChars validator exists. If it does, check the last char
		// entered against the validator. If validation fails, return thereby preventing
		// the value from being added to the state.

		if (this.props.allowedChars) {
			let input = event.target.value.slice(-1);
			if (!this.props.allowedChars.isValid(input)) {
				return;
			}
		}

		// Call action handler prop
		this.props.action(event);

		// Commit the input's value to state.value.
		this.setState({ value: event.target.value }, () => {
			// React docs suggest this callback should generally go in ComponentDidUpdate,
			// however since both this callback actions update the state, they must
			// go here because changing state in ComponentDidUpdate would cause a
			// recursive loop and blow up the call stack
			if (this.state.value && this.state.isPristine) {
				this.setState({ isPristine: false });
			}
		});
	}
}

const mapDispatchToProps = {
	trackFormInputChange,
};

export default connect(null, mapDispatchToProps)(TextInput);
