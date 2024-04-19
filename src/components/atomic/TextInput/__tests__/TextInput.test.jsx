import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import TextInput from '../TextInput';

let errorMessage;
let retMockActionObject;
const inputHelpText = 'We are in test mode';
const labelText = 'Text Input Test';
const placeholderText = 'This is a test';
const mockTextInput = {
	id: 'ti-test',
	inputHelpText,
	label: labelText,
	placeHolder: placeholderText,
};

describe('TextInput component', function () {
	it('TextInput renders with label, placeholder, and help text', function () {
		render(<TextInput {...mockTextInput} />);

		expect(screen.getByLabelText(labelText)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
		expect(screen.getByText(inputHelpText)).toBeInTheDocument();
	});

	it('Enter input text and validate entered text', function () {
		render(<TextInput {...mockTextInput} />);

		const expectedText = 'term';
		const textInput = screen.getByPlaceholderText(placeholderText);
		fireEvent.change(textInput, { target: { value: expectedText } });
		expect(screen.getByDisplayValue(expectedText).value).toBe(expectedText);
	});

	describe('TextInput with error', function () {
		it('TextInput event handlers ( action, onBlur )', function () {
			const handleBlurEvent = jest.fn();
			const mockActionObject = {
				action: 'mock handler',
				isExecuted: false,
				hasCorrectTargetEventValue: false,
			};
			const mockActionEvent = {
				event: {
					target: {
						value: 'action handler test',
					},
				},
			};

			const actionEventHandler = (event) => {
				const { value } = event.target;
				retMockActionObject = {
					...mockActionObject,
					isExecuted: true,
					hasCorrectTargetEventValue:
						value === mockActionEvent.event.target.value,
				};
			};

			render(
				<TextInput
					action={actionEventHandler}
					allowedChars={{
						isValid: () => true,
					}}
					errorMessage={errorMessage}
					onBlur={handleBlurEvent}
					{...mockTextInput}
				/>
			);
			const textInput = screen.getByPlaceholderText(placeholderText);
			fireEvent.change(textInput, { ...mockActionEvent.event });
			fireEvent.blur(textInput);

			// onBlur event fired once
			expect(handleBlurEvent).toHaveBeenCalledTimes(1);
			// Check action handler passed is fired and validate target value is correct
			expect(retMockActionObject.isExecuted).toBe(true);
			expect(retMockActionObject.hasCorrectTargetEventValue).toBe(true);
		});

		it('Trigger error and validate', function () {
			const mockEvent = {
				event: {
					target: {
						value: 'error',
					},
				},
			};

			const setErrorMessage = ({ event }) => {
				const { value } = event.target;
				if (value === 'error') {
					errorMessage = `You typed in "${value}" which generated an error`;
				} else {
					errorMessage = '';
				}
			};

			setErrorMessage(mockEvent);
			render(<TextInput errorMessage={errorMessage} {...mockTextInput} />);
			const textInput = screen.getByPlaceholderText(placeholderText);
			fireEvent.change(textInput, { target: { value: 'error' } });
			const error = screen.getByTestId('tid-error');

			expect(error).toBeInTheDocument();
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
		});
	});
});
