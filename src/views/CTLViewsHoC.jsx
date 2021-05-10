import PropTypes from 'prop-types';
import React from 'react';

const CTLViewsHoC = (WrappedView) => (props) => {
	return <WrappedView {...props} />;
};

CTLViewsHoC.propTypes = {
	children: PropTypes.node,
};

export default CTLViewsHoC;
