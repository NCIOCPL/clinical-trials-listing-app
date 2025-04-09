/**
 * @file This file defines configurations for which filters are enabled and
 * their display order on different types of pages within the application.
 */

/**
 * Configuration object mapping page types to their specific filter settings.
 * Keys represent the page type (e.g., 'Disease', 'Intervention').
 * Values are objects specifying:
 *   - enabledFilters: An array of filter keys (from FILTER_CONFIG) that should be active on this page type.
 *   - order: An array defining the display order of the enabled filters in the sidebar.
 */
export const PAGE_FILTER_CONFIGS = {
	// Configuration for 'Disease' type pages
	Disease: {
		enabledFilters: ['maintype', 'age', 'location'], // Only Age and Location filters are enabled
		order: ['maintype', 'age', 'location'], // Display Age first, then Location
	},

	// Configuration for 'Manual' type pages (currently no filters enabled)
	Manual: {
		enabledFilters: [],
		order: [],
	},

	// Configuration for 'Intervention' type pages
	Intervention: {
		enabledFilters: ['age', 'location', 'maintype'],
		order: ['age', 'location', 'maintype'],
	},
	// Add configurations for other page types as needed
};
