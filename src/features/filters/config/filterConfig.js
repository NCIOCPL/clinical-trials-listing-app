/**
 * @file This file defines the configuration object for various filters used
 * throughout the application. It centralizes properties like titles, input types,
 * options, placeholders, help text, and associated URL parameters for each filter type.
 */
import { URL_PARAM_MAPPING } from '../constants/urlParams';

/**
 * Configuration object defining properties for each filter type.
 * Keys represent the filter type (e.g., 'subtype', 'age').
 * Values are objects containing configuration details for that filter.
 */
export const FILTER_CONFIG = {
	maintype: {
		title: 'Primary Cancer Type/Condition',
		type: 'combobox',
		multiSelect: false,
		helpText: 'Filter trials by the type of cancer being studied',
		placeholder: 'Start typing to select a type',
		urlParam: URL_PARAM_MAPPING.maintype?.shortCode,
	},
	// Configuration for the 'Subtype' filter
	subtype: {
		title: 'Subtype', // Display title for the filter group
		type: 'combobox', // Type of input control (used for rendering logic)
		multiSelect: false, // Single selection for simplicity
		helpText: 'The smaller groups that the primary cancer can be divided into', // Tooltip text
		placeholder: '', // Placeholder for input
		urlParam: URL_PARAM_MAPPING.subtype.shortCode, // Link to URL parameter mapping
	},

	// Configuration for the 'Stage' filter
	stage: {
		title: 'Stage',
		type: 'combobox',
		multiSelect: false, // Only single selection allowed
		helpText: 'Select the extent of the cancer in the body',
		placeholder: 'Select',
		urlParam: URL_PARAM_MAPPING.stage.shortCode,
	},

	// Configuration for the 'Drug/Intervention' filter
	drugIntervention: {
		title: 'Drug/Drug Family',
		type: 'combobox', // Likely uses dynamic options fetched elsewhere
		multiSelect: true,
		helpText: 'Start typing to select a drug and/or drug family',
		placeholder: 'Start typing to select drugs and/or drug combinations',
		// urlParam: URL_PARAM_MAPPING.drugIntervention.shortCode,
	},

	// Configuration for the 'Age' filter
	age: {
		title: 'Age',
		type: 'number', // Numeric input type
		helpText: 'Enter the age of the participant',
		placeholder: 'Enter the age of the participant.',
		min: 1, // Minimum allowed age
		max: 120, // Maximum allowed age
		urlParam: URL_PARAM_MAPPING.age.shortCode, // Associated URL parameter
	},

	// Configuration for the 'Location' (ZIP Code) filter
	location: {
		title: 'Location by Zip Code',
		type: 'text', // Text input for ZIP code
		helpText: 'Enter a valid U.S. ZIP code',
		placeholder: 'Enter U.S. Zip Code',
		urlParam: URL_PARAM_MAPPING.zipCode.shortCode, // Associated URL parameter
	},

	// Configuration for the 'Radius' filter (used with Location)
	radius: {
		title: 'Distance from Location',
		type: 'select', // Dropdown select input
		helpText: 'Select miles within search radius',
		options: [
			// Static radius options
			{ id: '20', label: '20 miles', value: '20' },
			{ id: '50', label: '50 miles', value: '50' },
			{ id: '100', label: '100 miles', value: '100' },
			{ id: '200', label: '200 miles', value: '200' },
			{ id: '500', label: '500 miles', value: '500' },
		],
		urlParam: URL_PARAM_MAPPING.radius.shortCode, // Associated URL parameter
	},
};

/**
 * Helper function to get the filter configurations as an array of objects.
 * Useful for iterating over all filter configurations.
 *
 * @returns {Array<object>} An array containing the configuration objects for all filters.
 */
export const getFilterArray = () => Object.values(FILTER_CONFIG);

/**
 * Helper function to get the predefined options for a specific filter type.
 * Returns an empty array if the filter type doesn't exist or has no options defined.
 *
 * @param {string} id - The key (filter type) of the filter in FILTER_CONFIG.
 * @returns {Array<object>} An array of option objects ({ id, label, value }) or an empty array.
 */
export const getFilterOptions = (id) => FILTER_CONFIG[id]?.options || [];
