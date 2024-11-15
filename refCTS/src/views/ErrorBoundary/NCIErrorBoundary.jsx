import React from 'react';
import PropTypes from 'prop-types';

import PageNotFound from './PageNotFound/PageNotFound';
import InvalidCriteriaPage from '../InvalidCriteriaPage';
import GenericErrorPage from './GenericErrorPage/GenericErrorPage';
import {
	NotFoundError,
	InvalidCriteriaError,
	GenericError,
	ApiError,
} from './NCIError';

function NCIErrorBoundary({ error }) {
	console.log('Error details:', {
		name: error.name,
		message: error.message,
		stack: error.stack,
	});
	if (
		error instanceof NotFoundError ||
		(typeof error === 'string' && error.message.indexOf('404') > -1)
	) {
		return <PageNotFound />;
	} else if (
		error instanceof InvalidCriteriaError ||
		error.name === 'InvalidCriteriaError'
	) {
		// Note: This is more of a safety check. Validation errors should be handled at the component level.
		return <InvalidCriteriaPage initErrorsList={error.errors} />;
	} else if (error instanceof GenericError || error.name === 'GenericError') {
		return <GenericErrorPage message={error.message} />;
	} else if (error instanceof ApiError) {
		return (
			<GenericErrorPage message="An error occurred while fetching data. Please try again later." />
		);
	} else {
		return <GenericErrorPage />;
	}
}
NCIErrorBoundary.propTypes = {
	error: PropTypes.object.isRequired,
};

export default NCIErrorBoundary;
