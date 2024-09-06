import React from 'react';
import PropTypes from 'prop-types';
import track from 'react-tracking';
import WrapperComponent from './wrapper-component';

/**
 * A HoC to handle deficiencies in the react-tracking module when using stateless
 * function. This is used to wrap the app so that we can bind the analyticsHandler
 * to the dispatch function for the tracking.
 *
 * @param {Object} props - The props
 * @param {array} props.children - the child objects
 * @param {object} props.data - the event data
 * @param {function} props.analyticsHandler - The function for handling tracking dispatches
 */
const MockAnalyticsProvider = ({ children, data = {}, analyticsHandler = () => {} }) => {
	const TrackingWrapper = track(data, {
		dispatch: analyticsHandler,
	})(WrapperComponent);

	return <TrackingWrapper>{children}Î</TrackingWrapper>;
};

MockAnalyticsProvider.propTypes = {
	children: PropTypes.node,
	data: PropTypes.object,
	analyticsHandler: PropTypes.func,
};

export default MockAnalyticsProvider;
