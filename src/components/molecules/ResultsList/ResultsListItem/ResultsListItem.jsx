/* eslint-disable */

import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { TokenParser } from '../../../../utils';
import { FilterContext } from '../../../../features/filters/context/FilterContext/FilterContext';
import { getAnalyticsCounters } from '../../../../features/filters/utils/eddlAnalytics';

const ResultsListItem = ({ locationInfo, nciId, resultsItemTitleLink, status, title, resultIndex, totalResults }) => {
	const context = { nci_id: nciId };
	const titleLink = TokenParser.replaceTokens(resultsItemTitleLink, context);
	const { filterAppliedCounter, filterRemovedCounter } = getAnalyticsCounters();

	// Get current filters for analytics
	const filterContext = useContext(FilterContext);
	let currentFilters = {};
	let fieldsUsed = 'none';
	let age = 'none';
	let loc = 'none';
	let currentPage = 1;

	if (filterContext) {
		const { state } = filterContext;
		currentFilters = state.appliedFilters || {};
		currentPage = state.currentPage || 1;

		// Build fieldsUsed string per requirements - in order: t:st:stg:d:a:loc
		const fields = [];
		if (currentFilters.maintype?.length > 0) fields.push('t');
		if (currentFilters.subtype?.length > 0) fields.push('st');
		if (currentFilters.stage?.length > 0) fields.push('stg');
		if (currentFilters.drugIntervention?.length > 0) fields.push('d');
		if (currentFilters.age) fields.push('a');
		if (currentFilters.location?.zipCode) fields.push('loc');
		fieldsUsed = fields.length > 0 ? fields.join(':') : 'none';

		// Set age value
		age = currentFilters.age || 'none';

		// Set location value per requirements format: z|zipcode|radius
		if (currentFilters.location?.zipCode && currentFilters.location?.radius) {
			loc = `z|${currentFilters.location.zipCode}|${currentFilters.location.radius}`;
		}
	}

	const handleResultItemTitleClick = () => {
		// Create analytics event with data wrapper for consistency with EDDL format
		// Use alphabetical field order to match test expectations
		const eventData = {
			linkName: 'TrialListingApp:ResultClick',
			event: 'TrialListingApp:ResultClick',
			type: 'Other',
			data: {
				// Order fields to match non-EDDL test expectations
				resultIndex: resultIndex + 1,
				numberResults: totalResults || 0,
				currentPage: Number(currentPage) || 1,
				fieldsUsed: fieldsUsed,
				age: age,
				loc: loc,
				filterAppliedCounter: filterAppliedCounter,
				filterRemovedCounter: filterRemovedCounter,
			},
		};

		// Push directly to NCIDataLayer
		if (typeof window !== 'undefined') {
			window.NCIDataLayer = window.NCIDataLayer || [];
			window.NCIDataLayer.push(eventData);
		}

	};
	return (
		<li className="ctla-results__list-item grid-container">
			<div className="grid-row">
				<a className="ctla-results__list-item-title grid-col" href={titleLink} onClick={handleResultItemTitleClick}>
					{title}
				</a>
			</div>
			<div className="grid-row">
				<div className="ctla-results__list-item-status grid-col">
					<strong>Status:</strong> {status}
				</div>
			</div>
			<div className="grid-row">
				<div className="ctla-results__list-item-location grid-col">{locationInfo}</div>
			</div>
		</li>
	);
};

ResultsListItem.propTypes = {
	nciId: PropTypes.string.isRequired,
	resultsItemTitleLink: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	resultIndex: PropTypes.number.isRequired,
};

export default ResultsListItem;
