import { createSelector } from 'reselect';

import './tracking.defs';

/**
 * getTrackingData - Simple selector that returns tracking data in store
 * @param {State} store
 * @returns {tracking}
 */
export const getTrackingData = (store) => store.tracking;

/**
 * getHasDispatchedFormInteractionEvent - Returns set store flag that determines if an analytics tracking
 * event has been dispatched for start of a form interaction
 * @param {Function} getTrackingData
 * @returns {boolean} hasDispatchedFormInteractionEvent
 */
export const getHasDispatchedFormInteractionEvent = createSelector(
	getTrackingData,
	(trackingData) => trackingData.hasDispatchedFormInteractionEvent
);

/**
 * getHasUserInteractedWithForm - Returns set store flag that determines if any tracked form has been interacted with
 * @param {Function} getTrackingData
 * @returns {boolean} hasUserInteractedWithForm
 */
export const getHasUserInteractedWithForm = createSelector(
	getTrackingData,
	(trackingData) => trackingData.hasUserInteractedWithForm
);

/**
 * getFormTrackingData - Simple selector to return forms array from tracking object
 * @param {tracking} getTrackingData
 * @returns {Array} forms
 */
export const getFormTrackingData = createSelector(
	getTrackingData,
	(trackingData) => trackingData.forms
);

/**
 * getFormInFocus - Returns the current/last tracked form that had focus
 * @param {Function} getHasUserInteractedWithForm
 * @param {Function} getFormTrackingData
 * @returns {Object} formInFocus
 */
export const getFormInFocus = createSelector(
	getHasUserInteractedWithForm,
	getFormTrackingData,
	(hasUserInteractedWithForm, formTrackingData) => {
		const formInFocus = hasUserInteractedWithForm
			? formTrackingData.filter((form) => form.isFocused)
			: [];
		return formInFocus;
	}
);

/**
 * getFieldInFocus - Returns the current/last tracked form field that had focus
 * @param {Function} getFormInFocus
 * @returns {Object} fieldInFocus
 */
export const getFieldInFocus = createSelector(getFormInFocus, (formInFocus) => {
	const fieldInFocus =
		formInFocus.length > 0
			? formInFocus[0].fields.length > 0 &&
			  formInFocus[0].fields.filter((field) => field.isFocused)[0]
			: {};
	return fieldInFocus;
});
