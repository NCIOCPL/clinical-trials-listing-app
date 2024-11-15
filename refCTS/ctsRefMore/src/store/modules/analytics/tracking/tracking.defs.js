/**
 * @typedef field
 * @type {Object}
 * @property {string} errorMessage - Error message set by validator
 * @property {boolean} hasError - Flag signifying if field has an error
 * @property {string} id - Field identifier
 * @property {boolean} isFocused - Flag signifying if field is currently in focus
 * @property {string} value - Field value
 */

/**
 * @typedef form
 * @type {Object}
 * @property {boolean} attemptedSubmit - Flag signifying if a submission was attempted on the form
 * @property {Array.<field>} field
 * @property {string} formName - Yeah, what it says
 * @property {string} formType - Type of form (can be type advanced or basic)
 * @property {boolean} isFocused - Flag signifying if form is currently in focus
 * @property {boolean} isPristine - Flag signifying if user has started interacting with form
 * @property {boolean} isSubmitted - Flag signifying if form has been successfully submitted
 * @property {string} previousFieldName - Name of previously focused field
 */

/**
 * @typedef forms
 * @type {Array.<form>}
 */

/**
 * @typedef tracking
 * @type {Object}
 * @property {forms} forms
 * @property {boolean} hasDispatchedFormInteractionEvent - Flag signifying user form interaction event has been dispatched
 * @property {boolean} hasUserInteractedWithForm - Flag signifying if user has started interacting with form
 */
