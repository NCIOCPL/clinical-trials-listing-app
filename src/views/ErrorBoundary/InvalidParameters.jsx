import React from 'react';
import PropTypes from 'prop-types';

const InvalidParameters = ({ paramName }) => {
	return (
		<div>
			<h4>Missing or invalid &quot;{paramName}&quot; provided to app initialization.</h4>
		</div>
	);
};

InvalidParameters.propTypes = {
	paramName: PropTypes.string,
};

export default InvalidParameters;
