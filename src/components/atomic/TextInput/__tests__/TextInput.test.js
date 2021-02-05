import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import TextInput from '../TextInput';

let errorMessage;
let retMockActionObject;
let wrapper;
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
	beforeEach(function () {
		wrapper = render(<TextInput {...mockTextInput} />);
	});

	afterEach(cleanup);

	test('TextInput renders with label, placeholder, and help text', function () {
		const { getByLabelText, getByPlaceholderText, getByText } = wrapper;
		expect(getByLabelText(labelText)).toBeTruthy();
		expect(getByPlaceholderText(placeholderText)).toBeTruthy();
		expect(getByText(inputHelpText)).toBeInTheDocument();
	});

	test('Enter input text and validate entered text', function () {
		const { getByDisplayValue, getByPlaceholderText } = wrapper;
		const expectedText = 'term';
		const textInput = getByPlaceholderText(placeholderText);
		fireEvent.change(textInput, { target: { value: expectedText } });
		expect(getByDisplayValue(expectedText).value).toBe(expectedText);
	});

	describe('TextInput with error', function () {
		beforeEach(cleanup);

		test('TextInput event handlers ( action, onBlur )', function () {
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

			wrapper = render(
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
			const { getByPlaceholderText } = wrapper;
			const textInput = getByPlaceholderText(placeholderText);
			fireEvent.change(textInput, { ...mockActionEvent.event });
			fireEvent.blur(textInput);

			// onBlur event fired once
			expect(handleBlurEvent).toHaveBeenCalledTimes(1);
			// Check action handler passed is fired and validate target value is correct
			expect(retMockActionObject.isExecuted).toBe(true);
			expect(retMockActionObject.hasCorrectTargetEventValue).toBe(true);
		});

		test('Trigger error and validate', function () {
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
			wrapper = render(
				<TextInput errorMessage={errorMessage} {...mockTextInput} />
			);
			const { getByTestId, getByPlaceholderText, getByText } = wrapper;
			const textInput = getByPlaceholderText(placeholderText);
			fireEvent.change(textInput, { target: { value: 'error' } });
			const error = getByTestId('tid-error');

			expect(error).toBeTruthy();
			expect(getByText(errorMessage)).toBeTruthy();
		});
	});
});
