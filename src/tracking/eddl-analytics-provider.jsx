import PropTypes from 'prop-types';
import React from 'react';
import track from 'react-tracking';

import { AnalyticsProvider } from './';
import { EDDLAnalyticsHandler } from '../utils/index';
// import {EDDLAnalyticsHandler} from '../utils/index'
import WrapperComponent from './wrapper-component';

/**
 * A HoC to handle deficiencies in the react-tracking module when using stateless
 * function. This is used to wrap the app so that we can bind the analyticsHandler
 * to the dispatch function for the tracking.
 *
 * @param {Object} props - The props
 * @param {array} props.children - the child objects
 * @param {function} props.analyticsHandler - The function for handling tracking dispatches
 * TODO: Document page object override
 */
const EddlAnalyticsProvider = ({
	children,
	analyticsHandler = EDDLAnalyticsHandler(window),
	pageName,
	pageTitle,
	pageMetaTitle,
	pageLanguage,
	pageAudience,
	pageChannel,
	pageContentGroup,
	pagePublishedDate,
	...pageAdditionalDetails
}) => {
	// const tracking = useTracking();
	const TrackingWrapper = track(
		{
			name: pageName,
			title: pageTitle,
			metaTitle: pageMetaTitle,
			language: pageLanguage,
			audience: pageAudience,
			channel: pageChannel,
			contentGroup: pageContentGroup,
			publishedDate: pagePublishedDate,
			...pageAdditionalDetails,
		},
		{
			dispatch: analyticsHandler,
		}
	)(WrapperComponent);

	return (
		<AnalyticsProvider analyticsHandler={analyticsHandler}>
			<TrackingWrapper>{children}</TrackingWrapper>
		</AnalyticsProvider>
	);
};

EddlAnalyticsProvider.propTypes = {
	children: PropTypes.node,
	analyticsHandler: PropTypes.func,
	pageName: PropTypes.string,
	pageTitle: PropTypes.string,
	pageMetaTitle: PropTypes.string,
	pageLanguage: PropTypes.string,
	pageAudience: PropTypes.string,
	pageChannel: PropTypes.string,
	pageContentGroup: PropTypes.string,
	pagePublishedDate: PropTypes.string,
};

export default EddlAnalyticsProvider;
