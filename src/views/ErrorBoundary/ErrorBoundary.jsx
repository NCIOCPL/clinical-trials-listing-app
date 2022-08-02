import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorPage from './ErrorPage';
import PageNotFound from './PageNotFound';

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

		if (hasError) {
			const showPageNotFound =
				typeof error === 'string' && error.indexOf('404') > -1;
			return showPageNotFound ? <PageNotFound /> : <ErrorPage />;
		}
		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node,
};

export default ErrorBoundary;
