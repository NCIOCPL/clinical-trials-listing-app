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
		helpText: 'Search for a primary cancer type or condition.',
		placeholder: 'Start typing to select a type',
		urlParam: URL_PARAM_MAPPING.maintype?.shortCode,
	},
	// Configuration for the 'Subtype' filter
	subtype: {
		title: 'Subtype', // Display title for the filter group
		type: 'combobox', // Type of input control (used for rendering logic)
		multiSelect: true, // Allows multiple selections
		helpText: 'More than one selection may be made.', // Tooltip text
		placeholder: 'Start typing to select a subtype', // Placeholder for input
		options: [
			// Static options (can be overridden by dynamic options)
			{ id: 'her2_pos', label: 'HER2-Positive', value: 'her2_pos' },
			{ id: 'her2_neg', label: 'HER2-Negative', value: 'her2_neg' },
			{ id: 'triple_neg', label: 'Triple Negative', value: 'triple_neg' },
		],
		// urlParam: URL_PARAM_MAPPING.subtype.shortCode, // Link to URL parameter mapping (if applicable)
	},

	// Configuration for the 'Stage' filter
	stage: {
		title: 'Stage',
		type: 'combobox',
		multiSelect: false, // Only single selection allowed
		placeholder: 'Select',
		options: [
			{ id: 'stage_1', label: 'Stage I', value: 'stage_1' },
			{ id: 'stage_2', label: 'Stage II', value: 'stage_2' },
		],
		// urlParam: URL_PARAM_MAPPING.stage.shortCode,
	},

	// Configuration for the 'Drug/Intervention' filter
	drugIntervention: {
		title: 'Drug/Intervention',
		type: 'combobox', // Likely uses dynamic options fetched elsewhere
		multiSelect: true,
		helpText: "You can use the drug's generic or brand name. More than one selection may be made.",
		placeholder: 'Start typing to select drugs and/or drug combinations',
		// urlParam: URL_PARAM_MAPPING.drugIntervention.shortCode,
	},

	// Configuration for the 'Age' filter
	age: {
		title: 'Age',
		type: 'number', // Numeric input type
		placeholder: 'Enter the age of the participant.',
		min: 1, // Minimum allowed age
		max: 120, // Maximum allowed age
		urlParam: URL_PARAM_MAPPING.age.shortCode, // Associated URL parameter
	},

	// Configuration for the 'Location' (ZIP Code) filter
	location: {
		title: 'Location by Zip Code',
		type: 'text', // Text input for ZIP code
		placeholder: 'Enter U.S. Zip Code',
		urlParam: URL_PARAM_MAPPING.zipCode.shortCode, // Associated URL parameter
	},

	// Configuration for the 'Radius' filter (used with Location)
	radius: {
		title: 'Radius',
		type: 'select', // Dropdown select input
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
