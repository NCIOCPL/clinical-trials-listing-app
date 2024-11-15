import '../tracking.defs';

/**
 * FieldTrackingObject - Field tracking object that can be instantiated with a "new" keyword
 * @returns {Object}
 */
export class FieldTrackingObject {
	constructor() {
		return this;
	}

	get() {
		return {
			errorMessage: '',
			hasError: false,
			id: '',
			isFocused: false,
			value: '',
		};
	}
}
