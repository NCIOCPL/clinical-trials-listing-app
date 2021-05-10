import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorPage from './ErrorPage';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			hasError: false,
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the error page.
		return {
			error,
			hasError: true,
		};
	}

	render() {
		const { error, hasError } = this.state;

		if (error && hasError) {
			return <ErrorPage />;
		}
		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node,
};

export default ErrorBoundary;
