import { FieldTrackingObject } from './objects/field.object';
import { FormTrackingObject } from './objects/form.object';
import {
	ADD_FORM_TO_TRACKING,
	DISPATCHED_FORM_INTERACTION_EVENT,
	TRACK_FORM_INPUT_CHANGE,
	TRACKED_FORM_SUBMITTED,
} from './tracking.actions';
import './tracking.defs';
import { SEARCH_FORM_ID } from '../../../../constants';

const defaultState = {
	forms: [],
	hasDispatchedFormInteractionEvent: false,
	hasUserInteractedWithForm: false,
};

/**
 * Tracking reducer
 * @param {tracking} state
 * @param action
 * @returns {tracking}
 */
export const reducer = (state = defaultState, action) => {
	const { payload, type } = action;
	switch (type) {
		case ADD_FORM_TO_TRACKING: {
			const { formType } = payload;
			const trackedForm = [];
			const form = new FormTrackingObject().get();
			form.formType = formType;
			form.name = SEARCH_FORM_ID;
			trackedForm.push(form);

			return {
				...defaultState,
				forms: trackedForm,
			};
		}
		case DISPATCHED_FORM_INTERACTION_EVENT: {
			return {
				...state,
				hasDispatchedFormInteractionEvent: payload,
			};
		}
		case TRACK_FORM_INPUT_CHANGE: {
			const { errorMessage, formName, hasError, id, value } = payload;
			const { forms } = state;
			// Check if current element has a parent form in store
			const hasParentForm = forms.some((form) => form.name === formName);

			if (!hasParentForm) {
				console.log(
					`Could not find matching parent form for ${id} while running ${type} action.\n 
                    This element would not be tracked! Wrap element in a form tag in order to track.`
				);
				return state;
			}
			// Parent form for tracked field
			const parentForm = forms.map((form) => {
				// Reset all values to false
				form.isFocused = false;
				return form.name === formName ? form : {};
			})[0];

			const hasMatchingField =
				parentForm.fields && parentForm.fields.some((field) => field.id === id);

			const trackedField = new FieldTrackingObject().get();
			trackedField.id = id;
			trackedField.isFocused = true;
			trackedField.errorMessage = errorMessage;
			trackedField.hasError = hasError;
			trackedField.value = value;

			const fields = hasMatchingField
				? parentForm.fields.map((field) => {
						return field.id === id
							? {
									...field,
									errorMessage,
									hasError,
									isFocused: field.id === id,
									value,
							  }
							: {
									...field,
									isFocused: false,
							  };
				  })
				: [...parentForm.fields, trackedField];

			const form = {
				...parentForm,
				isPristine: false,
				isFocused: true,
				fields: fields,
				previousFieldName: id,
			};

			return {
				...state,
				hasUserInteractedWithForm: true,
				forms: [form],
			};
		}
		case TRACKED_FORM_SUBMITTED: {
			const forms = state.forms.map((form) => {
				form.isSubmitted = payload;
				return form;
			});
			return {
				...state,
				forms,
			};
		}
		default:
			return state;
	}
};
