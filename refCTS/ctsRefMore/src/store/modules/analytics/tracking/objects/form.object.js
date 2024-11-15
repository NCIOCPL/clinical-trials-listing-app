import '../tracking.defs';

/**
 * FormTrackingObject - Form tracking object that can be instantiated with a "new" keyword
 * @returns {form}
 */
export class FormTrackingObject {
	constructor() {
		return this;
	}

	get() {
		return {
			attemptedSubmit: false,
			formType: '',
			fields: [],
			isFocused: false,
			isPristine: true,
			isSubmitted: false,
			name: '',
			previousFieldName: '',
		};
	}
}
