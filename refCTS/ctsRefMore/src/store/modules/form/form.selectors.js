import { createSelector } from 'reselect';

/**
 * getFormData - Simple selector that returns form data in store
 * @param {State} store
 * @returns {Object} formData
 */
export const getFormData = (state) => state.form;

/**
 * getHasInvalidAge - Returns boolean flag if an invalid age has been entered in the form
 * @param {Function} getFormData
 * @returns {boolean} hasInvalidAge
 */
export const getHasInvalidAge = createSelector(
	getFormData,
	(formData) => formData.hasInvalidAge
);

/**
 * getHasInvalidZip - Returns boolean flag if an invalid zip has been entered in the form
 * @param {Function} getFormData
 * @returns {boolean} hasInvalidZip
 */
export const getHasInvalidZip = createSelector(
	getFormData,
	(formData) => formData.hasInvalidZip
);

/**
 * getHasFormError - Returns boolean flag if an error has occurred om the form
 * @param {Function} getHasInvalidAge
 * @param {Function} getHasInvalidZip
 * @returns {boolean} hasFormError
 */
export const getHasFormError = createSelector(
	getHasInvalidAge,
	getHasInvalidZip,
	(hasInvalidAge, hasInvalidZip) => hasInvalidAge || hasInvalidZip
);

export const getFieldError = createSelector(
	getHasInvalidAge,
	getHasInvalidZip,
	(hasInvalidAge, hasInvalidZip) =>
		hasInvalidZip && hasInvalidAge
			? 'a,z'
			: hasInvalidZip
			? 'z'
			: hasInvalidAge
			? 'a'
			: ''
);
