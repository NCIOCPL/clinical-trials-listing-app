import React from 'react';
import CISBanner from '../../atomic/CISBanner';
import { useStateValue } from '../../../store/store'; // Import useStateValue

const NoResultsWithFilters = () => {
	const [{ dynamicListingPatterns, trialListingPageType }] = useStateValue();

	// Determine the correct pattern based on page type
	// This logic might need adjustment based on the actual structure of dynamicListingPatterns
	let pattern = null;
	if (dynamicListingPatterns) {
		// Try finding a pattern matching the page type, or fallback to the first one.
		pattern = dynamicListingPatterns[trialListingPageType] || Object.values(dynamicListingPatterns)[0];
	}

	// Define the default HTML for the links/contact info
	const defaultHtml = 'You can try a <a href="/about-cancer/treatment/clinical-trials/search">new search</a> or <a href="/contact">contact our Cancer Information Service</a> to talk about options for clinical trials.';

	// Get the configured HTML or use the default
	const filteredHtml = pattern?.noTrialsFilteredHtml || defaultHtml;

	return (
		<div className="ctla-results__no-results">
			<p>
				{/* Static first part of the message */}
				There are no NCI-supported clinical trials that match your selected filters. <span dangerouslySetInnerHTML={{ __html: filteredHtml }} />
			</p>
			{/* Keep the CISBanner */}
			<CISBanner />
		</div>
	);
};

export default NoResultsWithFilters;
