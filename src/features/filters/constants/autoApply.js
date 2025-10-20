/**
 * @file Configuration constants for auto-apply filter functionality
 */

// Default delay before auto-applying filters (in milliseconds)
export const AUTO_APPLY_DELAY_MS = 1500; // 1.5 seconds default

// Filter-specific delays for different input types
export const AUTO_APPLY_DELAYS_BY_TYPE = {
	age: 2000, // 2 seconds for text input
	location: 2000, // 2 seconds for ZIP code input
	maintype: 1000, // 1 second for dropdown selection
	subtype: 1000, // 1 second for dropdown selection
	stage: 1000, // 1 second for dropdown selection
	drugIntervention: 1000, // 1 second for dropdown selection
};

// Feature flag to enable/disable auto-apply functionality
export const AUTO_APPLY_ENABLED = true;
