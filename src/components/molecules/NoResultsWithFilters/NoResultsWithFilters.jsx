import React from 'react';
import CISBanner from '../../atomic/CISBanner';

const NoResultsWithFilters = () => (
	<div className="ctla-no-results-filters">
		<p>There are no NCI-supported clinical trials that match your selected filters. You can modify the filters to adjust your search or contact our Cancer Information Service to talk about options for clinical trials. </p>
		<CISBanner />
	</div>
);

export default NoResultsWithFilters;
