// Shamelessly inspired by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#differentiate_between_similar_errors
export class NCIError extends Error {
	constructor(message = '') {
		super(message);

		// Maintains proper stack trace for where our error was thrown
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}

		this.name = this.constructor.name;
		this.date = new Date();
	}
}
export class NotFoundError extends NCIError {
	constructor(message = 'Resource not found') {
		super(message);
	}
}

export class InvalidCriteriaError extends NCIError {
	constructor(errors = [], message = 'Invalid criteria') {
		super(message);
		this.errors = errors;
	}
}

export class GenericError extends NCIError {
	constructor(message = 'An error occurred') {
		super(message);
	}
}

export class ApiError extends NCIError {
	constructor(message = 'API error', statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class ApiServerError extends NCIError {
	constructor(message = 'API server error', statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
	}
}
